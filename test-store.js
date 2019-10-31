//导入HouseStore合约构件
HouseStore = artifacts.require("./HouseStore.sol");
module.exports = function(callback){
  //金额单位换算：ether -> wei
    m_price = web3.toWei(1, 'ether');
    //时间单位换算：毫秒 -> 秒
    //   current_time = Math.round(new Date() / 1000);
    HouseStore.deployed() //获取电商合约实例
        .then(inst => {
        //添加商品
        inst.addHouseToStore('bgy', 2, 'apartment', 1, 1, 'jyl',
                                8, m_price, 'imagelink', 'desclink',9)
            .then(()=> inst.HouseIndex()) //获取商品计数器当前值
            .then(lastid => inst.getProduct(lastid)) //获取最后添加的商品信息
            .then(product => console.log(product))  //输出商品信息
        });  
}


//>truffle exec test-store.js     //然后在终端中执行truffle exec命令来启动脚本：