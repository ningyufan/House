EcommerceStore = artifacts.require("./EcommerceStore.sol");
module.exports = function(callback) {
  current_time = Math.round(new Date() / 1000);
  amt_1 = web3.toWei(1, 'ether');
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('碧桂园1号', '公寓', 'QmSyUnoYmcphMLJZuvKRZKVRY6goEAuxCaYZer3MYXWQNx', 'QmNwaDPdSBQmNQj7fcUnErx4vXv99hCPPXQY6rJB22YGV9', current_time, current_time + 200, 2*amt_1, 0).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('碧桂园2号', '公寓', 'QmSyxND4nfk5Ys92nua3CdeXmofic3zVDYka1KcAx1hmC5', 'QmZxGqhmA4MKMpHx8YMQCV6Tg2FrDjtgPj8DUfNk7E3WZv', current_time, current_time + 400, 3*amt_1, 1).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('奥园13号', '别墅', 'QmcU3CT5SHWfJavUFg2uvBu6LYDz8tsboBxR2SLM8Q2CZU', 'QmPJf3N4tYSZCdwNWFwBDJvabUY5HN6ecJpbLBi5A7j96F', current_time, current_time + 14, amt_1, 0).then(function(f) {console.log(f)})}); 
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('奥园14号', '别墅', 'QmZaPCtjs1fR9ZUfkSBsFTDsGgQwv4ZMBZUXSUdqHvQiNm', 'QmPJf3N4tYSZCdwNWFwBDJvabUY5HN6ecJpbLBi5A7j96F', current_time, current_time + 86400, 4*amt_1, 1).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('澎湖湾18号', '别墅', 'QmdpLaaZYxJKVF1Bz2zJXnFa133zwm66xNQCdnyeAbYQYn', 'QmUxnPBJS1wmZPNbp8BocVzmpLBEoxtpoQBBosea9rQYZi', current_time, current_time + 86400, 5*amt_1, 1).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('澎湖湾100号', '别墅', 'QmYyeWvoJnZD6L6C4sU68kTFM3yyjUB6AuqMKn6qmRbfZC', 'QmUxnPBJS1wmZPNbp8BocVzmpLBEoxtpoQBBosea9rQYZi', current_time, current_time + 86400 + 86400 + 86400, 5*amt_1, 1).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.productIndex.call().then(function(f){console.log(f)})});
}