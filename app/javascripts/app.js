import "bootstrap/dist/css/bootstrap.css"
import "../stylesheets/app.css";

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import ecommerce_store_artifacts from '../../build/contracts/EcommerceStore.json'
import ipfsAPI from 'ipfs-api'
import ethUtil from 'ethereumjs-util'
import $ from 'jquery'

const ethereumNodeUrl = ETHEREUM_NODE_URL ? ETHEREUM_NODE_URL : 'http://localhost:8545'
const ipfsApiAddress = {
  protocol: 'http',
  host: IPFS_API_HOST ? IPFS_API_HOST : 'localhost',
  port: IPFS_API_PORT ? IPFS_API_PORT : 5001  
}
const ipfsGatewayUrl = IPFS_GATEWAY_URL ? IPFS_GATEWAY_URL : 'https://ipfs.io/'

const EcommerceStore = contract(ecommerce_store_artifacts);
const ipfs = ipfsAPI(ipfsApiAddress);

let reader;
window.App = {
  start: function() {
    EcommerceStore.setProvider(web3.currentProvider);
    
    if($("#index-page").length>0){
      renderStore()
    }
    
    if($('#list-item-page').length>0){
      $("#product-image").change( event => {
        if(event.target.files.length === 0) return
        const file = event.target.files[0]
        reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
      });      
      
      $("#add-item-to-store").submit(event => {
         event.preventDefault();
         const req = $("#add-item-to-store").serialize();
         let params = JSON.parse('{"' + req.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
         let decodedParams = {}
         Object.keys(params)
          .forEach( k => decodedParams[k] = decodeURIComponent(decodeURI(params[k])) )
         saveProduct(reader, decodedParams);
      })      
    }
    
    if($("#product-page").length > 0) { 
      let productId = new URLSearchParams(window.location.search).get('id');
      if(!productId) return $('#msg').html('错误:没有指定产品id').show();
      renderProductDetails(productId);
      
      $("#bidding").submit(function(event) {
        event.preventDefault();
        $("#msg").hide();
        let amount = $("#bid-amount").val();
        let sendAmount = $("#bid-send-amount").val();
        let secretText = $("#secret-text").val();
        let sealedBid = '0x' + ethUtil.sha3(web3.toWei(amount, 'ether') + secretText).toString('hex');
        let productId = $("#product-id").val();
        
        EcommerceStore.deployed()
          .then(inst => inst.bid(parseInt(productId), sealedBid, {value: web3.toWei(sendAmount), from: web3.eth.accounts[1], gas: 440000}))
          .then(ret => {
              $("#msg").html("你的报价已经成功提交！");
              $("#msg").show();
            })
            .catch(err => console.log(err))
      });    
      
      $("#revealing").submit(function(event) {
        event.preventDefault();
        $("#msg").hide();
        let amount = $("#actual-amount").val();
        let secretText = $("#reveal-secret-text").val();
        let productId = $("#product-id").val();
        EcommerceStore.deployed()
          .then(inst => inst.revealBid(parseInt(productId), web3.toWei(amount).toString(), secretText, {from: web3.eth.accounts[1], gas: 440000}))
          .then(ret => {
              $("#msg").show();
              $("#msg").html("你的报价已经成功揭示！");
            })
            .catch(err => console.log(err))
      });      
      
      $("#finalize-auction").submit(function(event) {
        event.preventDefault();
        $("#msg").hide();
        let productId = $("#product-id").val();
        EcommerceStore.deployed()
          .then(inst => inst.finalizeAuction(parseInt(productId), {from: web3.eth.accounts[9], gas: 4400000}))
          .then(ret => {
             $("#msg").show();
             $("#msg").html("拍卖已经结束，获胜者已经宣布。");
             //location.reload();
          })
          .catch(err => console.log(err))
      });    
      
      $(".release-funds").click(function() {
        let productId = new URLSearchParams(window.location.search).get('id');
        let account = $(this).data('account')
        EcommerceStore.deployed()
          .then(inst => inst.releaseAmountToSeller(productId, {from: account, gas: 440000}))
          .then(() => $("#msg").html("您的交易已经提交。请稍候几秒钟确认").show())
          .catch(err => console.log(err))
      });

      $(".refund-funds").click(function() {
        let productId = new URLSearchParams(window.location.search).get('id');
        let account = $(this).data('account')
        EcommerceStore.deployed()
          .then(f => f.refundAmountToBuyer(productId, {from: account, gas: 440000}))
          .then(() => $("#msg").html("您的交易已经提交。请稍候几秒钟确认").show())
          .catch(err => console.log(err))
      });
            
    }    
    
  }
};

window.addEventListener('load', function() {
  window.web3 = new Web3(new Web3.providers.HttpProvider(ethereumNodeUrl));
  App.start();
});

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

function saveProductToBlockchain(params, imageId, descId) {
  let auctionStartTime = Date.parse(params["product-auction-start"]) / 1000;
  let auctionEndTime = auctionStartTime + parseInt(params["product-auction-end"]) * 24 * 60 * 60
  return EcommerceStore.deployed()
    .then( inst => inst.addProductToStore(params["product-name"], 
                        params["product-category"], 
                        imageId, descId, auctionStartTime,auctionEndTime, 
                        web3.toWei(params["product-price"], 'ether'), 
                        parseInt(params["product-condition"]), 
                        {from: web3.eth.accounts[0], gas: 440000}))
    .then(() =>{
      $("#msg").show();
      $("#msg").html("你的房屋已经成功添加到平台!");    
    })                          
    .catch(err => console.log(err))
}

function saveProduct(reader, decodedParams) {
  let imageId, descId;
  return saveImageOnIpfs(reader)
    .then(id => imageId = id) 
    .then(() => saveTextBlobOnIpfs(decodedParams["product-description"]) )
    .then(id => descId = id)  
    .then(() => saveProductToBlockchain(decodedParams, imageId, descId))
    .catch(err => console.log(err))
}

function displayPrice(amt) {
  return 'Ξ' + web3.fromWei(amt, 'ether');
}

function getCurrentTimeInSeconds(){
  return Math.round(new Date() / 1000);
}

function displayEndHours(seconds) {
  let current_time = getCurrentTimeInSeconds()
  let remaining_seconds = seconds - current_time;

  if (remaining_seconds <= 0) {
    return "活动已经结束";
  }

  let days = Math.trunc(remaining_seconds / (24*60*60));
  remaining_seconds -= days*24*60*60
  let hours = Math.trunc(remaining_seconds / (60*60));
  remaining_seconds -= hours*60*60
  let minutes = Math.trunc(remaining_seconds / 60);
  if (days > 0) {
    return "距离活动结束还有 " + days + " 天, " + hours + ", 小时, " + minutes + " 分钟";
  } else if (hours > 0) {
    return "距离活动结束还有 " + hours + " 小时, " + minutes + " 分钟 ";
  } else if (minutes > 0) {
    return "距离活动结束还有 " + minutes + " 分钟 ";
  } else {
    return "距离活动结束还有 " + remaining_seconds + " 秒";
  }
}

function renderProductDetails(productId) {
  EcommerceStore.deployed()
    .then(inst => inst.getProduct.call(productId))
    .then(p => {
      let content = "";
      ipfs.cat(p[4])
        .then(function(file) {
          content = file.toString();
          $("#product-desc").append(`<div>${content}</div>`);
        })
        .catch(err => console.log(err))

      $("#product-image").append(`<img src='${ipfsGatewayUrl}/ipfs/${p[3]}' width='250px'/>`);
      $("#product-name").html(p[1]);
      // //显示房子地址
      // $("#product-HouseAddress").html(`<div>房屋地址：${p[6]}</div>`);
      // //显示房间数
      // $("#product-room").html(`<div>房间数：${p[2]}</div>`);
      // //显示阳台数量
      // $("#product-balcony").html(`<div>阳台数：${p[4].toString()}</div>`);
      // //显示卫浴数量
      // $("#product-bathroom").html(`<div>卫浴数：${p[5].toString()}</div>`);
      // //显示房子楼层
      // $("#product-floors").html(`<div>房屋楼层：${p[7]}</div>`);
      $("#product-price").html(displayPrice(p[7]));
      $("#product-auction-end").html(displayEndHours(p[6]));
      $("#product-id").val(p[0]);
      
      let currentTime = getCurrentTimeInSeconds();
      $("#revealing, #bidding,#finalize-auction,#escrow-info").hide();
      if (parseInt(p[8]) == 1) {
        EcommerceStore.deployed()
          .then(inst =>  {
            $("#escrow-info").show();
            inst.highestBidderInfo.call(productId)
              .then(f => {
                if (f[2].toLocaleString() == '0') {
                  $("#product-status").html("拍卖已结束，没有报价公布");
                } else {
                  $("#product-status").html("拍卖已结束， 房屋已售给 " + f[0] + " for " + displayPrice(f[2]) +
                    "资金由第三方保管，三名参与者中的两名(买方、卖方和仲裁机构)要么将资金交给卖方，要么将钱退还给买方。 ");
                }
              })

            inst.escrowInfo.call(productId)
              .then(f => {
                $("#buyer").html('买家: ' + f[0]);
                $("#seller").html('卖家: ' + f[1]);
                $("#arbiter").html('仲裁者: ' + f[2]);
                $("#buyer-vote a").data('账户',f[0])
                console.log($("#buyer-vote a")[0],f[0])
                $("#seller-vote a").data('账户',f[1])
                $("#arbiter-vote a").data('账户',f[2])
                if(f[3] == true) {
                  $("#release-count").html("托管金额已释放");
                } else {
                  $("#release-count").html("3名参与者中有"+f[4] + " 人同意发放资金");
                  $("#refund-count").html("3名参与者中有"+f[5] + " 人同意退款给买家");
                }
              })
              
          })                     
      } else if(parseInt(p[8]) == 2) {
        $("#product-status").html("房屋未售出");
      } else if(currentTime < parseInt(p[6])) {
        $("#bidding").show();
      } else if (currentTime  < (parseInt(p[6])+60) ) {
        $("#revealing").show();
      } else {
        $("#finalize-auction").show();
      }
      
    })
    .catch(err => console.log(err))
}

function renderProducts(selector, filters) {
  $.ajax({
      url: "/api/product",
      method: 'GET',
      contentType: "application/json; charset=utf-8",
      data: filters
    })
    .done(data => {
      if (data.length == 0) 
        $(selector).html('没有找到房屋信息');
      else
        $(selector).html('');
      
      data.forEach(product => {
        let tpl = `
          <div class="col-sm-3 text-center col-margin-bottom-1">
            <img src='${ipfsGatewayUrl}/ipfs/${product['ipfsImageHash']}' width='150px' />
            <div>${product['name']}</div>
            <div>${product['category']}</div>
            <div>${product['auctionStartTime']}</div>
            <div>${product['auctionEndTime']}</div>
            <div>Ether: ${product['price']}</div>
          </div>`
        $(tpl)
          .css('cursor','pointer')
          .click(()=>location.href=`/product.html?id=${product.blockchainId}`)
          .appendTo(selector);
      })
    })
}

const categories = ["Art","Books","Cameras","Cell Phones & Accessories","Clothing",
    "Computers & Tablets","Gift Cards & Coupons","Musical Instruments & Gear",
    "Pet Supplies","Pottery & Glass","Sporting Goods","Tickets","Toys & Hobbies","Video Games"];

function renderStore() {
  renderProducts("#product-list", {});
  renderProducts("#product-reveal-list", {productStatus: "reveal"});
  renderProducts("#product-finalize-list", {productStatus: "finalize"});
  categories.forEach(cat =>  $("#categories").append(`<div>${cat}</div>`))
}
