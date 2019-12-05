EcommerceStore = artifacts.require("./EcommerceStore.sol");
module.exports = function(callback) {
  current_time = Math.round(new Date() / 1000);
  amt_1 = web3.toWei(1, 'ether');
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('奥园11号', '别墅', 'QmTHzWWEdg1rCPjTfhbwY6osDaryD2w4FqpMdnM1FZ675M', 'QmTSCQtViKBEbLLXMX41DpkzpF5BsZt2Y5q96eWgghEWFo', current_time, current_time + 200, 2*amt_1, 0).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('奥园12号', '别墅', 'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmTSCQtViKBEbLLXMX41DpkzpF5BsZt2Y5q96eWgghEWFo', current_time, current_time + 400, 3*amt_1, 1).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('奥园13号', '别墅', 'Qmde934rwMWFnyMB9SAkMii9qHgL2ezejJ9RfN4w4bzKRA', 'QmTSCQtViKBEbLLXMX41DpkzpF5BsZt2Y5q96eWgghEWFo', current_time, current_time + 14, amt_1, 0).then(function(f) {console.log(f)})}); 
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('奥园14号', '别墅', 'QmYyTCFZTix6MFhMxhZhzXU5erFuCA8hczLZyrnD5KBPGu', 'QmTSCQtViKBEbLLXMX41DpkzpF5BsZt2Y5q96eWgghEWFo', current_time, current_time + 86400, 4*amt_1, 1).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('澎湖湾18号', '别墅', 'QmeMPD1YAAzbQbeB1ecdgxRBvbAy7d4sQYvAx8WMkt7BzQ', 'QmTSCQtViKBEbLLXMX41DpkzpF5BsZt2Y5q96eWgghEWFo', current_time, current_time + 86400, 5*amt_1, 1).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('澎湖湾100号', '别墅', 'QmUADy5FJmC1qjLSfYN7uqZsUChUci9A4wV1C4cRkhEokZ', 'QmTSCQtViKBEbLLXMX41DpkzpF5BsZt2Y5q96eWgghEWFo', current_time, current_time + 86400 + 86400 + 86400, 5*amt_1, 1).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.productIndex.call().then(function(f){console.log(f)})});
}