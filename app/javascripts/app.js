import "bootstrap/dist/css/bootstrap.css"
import "../stylesheets/app.css";

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import house_store_artifacts from '../../build/contracts/HouseStore.json'
import ipfsAPI from 'ipfs-api'
import ethUtil from 'ethereumjs-util'
import $ from 'jquery'

const ethereumNodeUrl = ETHEREUM_NODE_URL ? ETHEREUM_NODE_URL : 'http://localhost:8545'
const ipfsApiAddress = {
  protocol: 'http',
  host: IPFS_API_HOST ? IPFS_API_HOST : 'localhost',
  port: IPFS_API_PORT ? IPFS_API_PORT : 5001  
}
const ipfsGatewayUrl = IPFS_GATEWAY_URL ? IPFS_GATEWAY_URL : 'http://localhost:8080'

const HouseStore = contract(house_store_artifacts);
const ipfs = ipfsAPI(ipfsApiAddress);

let reader;    //文件读取器
window.App = {
  start: function() {
    HouseStore.setProvider(web3.currentProvider);
    renderStore()
  
    //list-item.html  start
    if($("#index-page").length>0){             //商品列表页 
        renderStore()
    }

    if($('#list-item-page').length>0){         //商品上架页
      $("#product-image").change( event => {
        if(event.target.files.length === 0) return
        const file = event.target.files[0]
        reader = new window.FileReader()
        reader.readAsArrayBuffer(file)        //读取指定文件内容到缓冲区
      });      
      
      $("#add-item-to-store").submit(event => {      //提交表单时执行该方法
        event.preventDefault();
        const req = $("#add-item-to-store").serialize();           //序列化表单中的输入值
        //将序列化的表单输入值转换为JSON对象
        let params = JSON.parse('{"' + req.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
        let decodedParams = {}
        Object.keys(params)
          .forEach( k => decodedParams[k] = decodeURIComponent(decodeURI(params[k])) )
        //存入区块链 
        saveProduct(reader, decodedParams);
      })      
    }
    //list-item.html  end
    
    //product.html start
    if($("#product-page").length > 0) {           //商品详情页
      let productId = new URLSearchParams(window.location.search).get('id');
      if(!productId) return $('#msg').html('ERROR: no product id specified.').show();
      renderProductDetails(productId);    

      $("#bidding").submit(function(event) {
        event.preventDefault();

        $("#msg").hide();
        //采集表单信息  
        let productId = $("#product-id").val();
        let buyPrice = $("#buy-price").val();
        let StartTime = $("#buy-StartTime").val();
        let secretText = $("#buy-month").val();
     
        //计算密封出价哈希
        let sealedBid = '0x' + ethUtil.sha3(web3.toWei(buyPrice, 'ether') + secretText).toString('hex');
     
        //密封出价
          HouseStore.deployed()
          .then(inst => inst.bid(parseInt(productId), sealedBid, {value: web3.toWei(sendAmount), from: web3.eth.accounts[1], gas: 440000}))
          .then(ret => {
              $("#msg").html("Your bid has been successfully submitted!");
              $("#msg").show();
            })
            .catch(err => console.log(err))
     });
    }    

    //product.html end

    //监听表单提交事件
    $("#finalize-auction").submit(event => {
      event.preventDefault();
      //提取商品编号
      let productId = $("#product-id").val();
      //调用合约对象的方法
      EcommerceStore.deployed().then(inst => {
        inst.finalizeAuction(parseInt(productId), {from: web3.eth.accounts[2], gas: 4400000})
          .then(() => console.log('finalized')) 
          .catch( err => console.log(err) )
      });

    })
    
  } 
};

window.addEventListener('load', function() {
  window.web3 = new Web3(new Web3.providers.HttpProvider(ethereumNodeUrl));
  App.start();
});



//list-item.html  start
function saveImageOnIpfs(reader) {
  const buffer = Buffer.from(reader.result);
  return ipfs.add(buffer)
    .then( rsp => rsp[0].hash)
    .catch(err => console.error(err))
}

function saveTextBlobOnIpfs(blob) {
  const descBuffer = Buffer.from(blob, 'utf-8');
  return ipfs.add(descBuffer)
    .then( rsp => rsp[0].hash )
    .catch( err => console.error(err))
}

function saveHouseToBlockchain(params, imageId, descId) {
  
  return HouseStore.deployed()
    .then( inst => inst.addHouseToStore(params["product-name"],   //添加商品到区块链
                        params["product-room"], 
                        params["product-category"], 
                        params["product-balcony"], 
                        params["product-bathroom"], 
                        params["product-HouseAddress"], 
                        params["product-floors"],
                        params["product-price"], 
                        params["product-deposit"], 
                        imageId,
                        descId,   
                        parseInt(params["product-condition"]), 
                        {from: web3.eth.accounts[0], gas: 440000}))
    .then(() =>{              
      $("#msg").show();
      $("#msg").html("添加成功!");   //显示操作提示信息   
    })                          
    .catch(err => console.log(err))
}

function saveProduct(reader, decodedParams) {
  let imageId, descId;
  return saveImageOnIpfs(reader)
    .then(id => imageId = id)       //保存图片哈希
    .then(() => saveTextBlobOnIpfs(decodedParams["product-description"]) )
    .then(id => descId = id)        //保存描述文本哈希
    .then(() => saveHouseToBlockchain(decodedParams, imageId, descId))
    .catch(err => console.log(err))
}
//list-item.html  end


//product.html  start
function displayPrice(amt) {
  return 'Ξ' + web3.fromWei(amt, 'ether');
}

function getCurrentTimeInSeconds(){
  return Math.round(new Date() / 1000);
}

// function displayEndHours(seconds) {
//   let current_time = getCurrentTimeInSeconds()
//   let remaining_seconds = seconds - current_time;

//   if (remaining_seconds <= 0) {
//     return "Auction has ended";
//   }

//   let days = Math.trunc(remaining_seconds / (24*60*60));
//   remaining_seconds -= days*24*60*60
//   let hours = Math.trunc(remaining_seconds / (60*60));
//   remaining_seconds -= hours*60*60
//   let minutes = Math.trunc(remaining_seconds / 60);
//   if (days > 0) {
//     return "Auction ends in " + days + " days, " + hours + ", hours, " + minutes + " minutes";
//   } else if (hours > 0) {
//     return "Auction ends in " + hours + " hours, " + minutes + " minutes ";
//   } else if (minutes > 0) {
//     return "Auction ends in " + minutes + " minutes ";
//   } else {
//     return "Auction ends in " + remaining_seconds + " seconds";
//   }
// }

function renderProductDetails(productId) {
  
  HouseStore.deployed().then(inst => {
    //从区块链提取商品数据
    inst.getProduct.call(productId).then(function(p) {
      //显示ipfs上的商品描述信息
      ipfs.cat(p[11]).then( data => {
        let content = data.toString();
        $("#product-desc").append(`<div>${content}</div>`);
      });
      //显示ipfs上的商品图片
      // let imgurl = `https://${appHost}/ipfs/${p[10]}`
      $("#product-image").append(`<img src='${ipfsGatewayUrl}/ipfs/${p[10]}' width='250px' />`);
      //显示起拍价格
      $("#product-price").html(p[8]);
      //显示押金信息
      $("#product-auction-end").html(p[9]);
      //显示商品名称
      $("#product-name").html(p[1]);
      //显示房间数
      $("#product-room").html(p[2]);
      //显示房子类别
      $("#product-category").html(p[3]);
      //显示阳台数量
      $("#product-balcony").html(p[4]);
      //显示卫浴数量
      $("#product-bathroom").html(p[5]);
      //显示房子地址
      $("#product-HouseAddress").html(p[6]);
      //显示房子楼层
      $("#product-floors").html(p[7]);
      //显示房子地址
      $("#product-HouseCondition").html(p[12]);
      //在DOM中保存商品编号
      $("#product-id").val(p[0]);

    })
  })
}

//product.html  end




function renderProducts(selector, filters) {
  $.ajax({
      url: "/api/product",
      method: 'GET',
      contentType: "application/json; charset=utf-8",
      data: filters
    })
    .done(data => {
      if (data.length == 0) 
        $(selector).html('No products found');
      else
        $(selector).html('');
      
      data.forEach(product => {
        let tpl = `
          <div class="col-sm-3 text-center col-margin-bottom-1">
            <img src='${ipfsGatewayUrl}/ipfs/${product[10]}' width='150px' />
            
            <div>房名：${product[1]}</div>
            <div>类别：${product[3]}</div>
            <div>阳台：${product[4]}</div>
            <div>卫浴：${product[5]}</div>
            <div>地址：${product[6]}</div>
          </div>`
        $(tpl)
          .css('cursor','pointer')
          .click(()=>location.href=`/product.html?id=${product.blockchainId}`)
          .appendTo(selector);
      })
    })
}

const categories = ["别墅", "公寓", "二手房"];

// function renderStore() {
//   renderProducts("#product-list",{});
//   // renderProducts("#product-reveal-list", {});
//   // renderProducts("#product-finalize-list", {});
//   categories.forEach(cat =>  $("#categories").append(`<div>${cat}</div>`))
// }


function renderStore() {
  let inst
  return HouseStore.deployed()
    .then(i => inst = i)
    .then(()=> inst.HouseIndex())
    .then(next => {
      for(let id=1;id<=next;id++){
        inst.getProduct.call(id)
          .then(p => $("#product-list").append(buildProduct(p)))
      }        
    })
}


function buildProduct(product) {
  let imgUrl = `${ipfsGatewayUrl}/ipfs/${product[11]}`
  let html = `<div style="margin:20px">
                <img src="${imgUrl}" width="150px" />
                <div>房名：${product[1]}</div>
                <div>类别：${product[3]}</div>
                <div>阳台：${product[4]}</div>
                <div>卫浴：${product[5]}</div>
                <div>地址：${product[6]}</div>
              </div>`
  return $(html)
  .css('cursor','pointer')
  .click(()=>location.href=`/product.html?id=${product[0]}`);
}
