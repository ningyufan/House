HouseStore = artifacts.require("./HouseStore.sol");
module.exports = function(callback) {
  // current_time = Math.round(new Date() / 1000);
  m_price = web3.toWei(1, 'ether');
  HouseStore.deployed().then(function(i) {i.addHouseToStore('bgy', 2, 'apartment', 1, 1, 'yljyl1n', 8, m_price, 'QmRbpprDDwSsohHMLZc8wqLHXYsYvTHqDjrna1A56MY9qJ', 'QmVLJ32c7v9eWJcRAyUoua2opug3yK4p6UHS2yUGafsPjm',9).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('bgy124n', 3, 'apartment', 1, 1, 'yljyl1n', 8, 2 * m_price, 'QmRbpprDDwSsohHMLZc8wqLHXYsYvTHqDjrna1A56MY9qJ', 'QmVLJ32c7v9eWJcRAyUoua2opug3yK4p6UHS2yUGafsPjm',8).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('bgy125n', 3, 'apartment', 1, 1, 'yljyl1n', 8, 1.5 * m_price, 'QmRbpprDDwSsohHMLZc8wqLHXYsYvTHqDjrna1A56MY9qJ', 'QmVLJ32c7v9eWJcRAyUoua2opug3yK4p6UHS2yUGafsPjm',16).then(function(f) {console.log(f)})}); 
  HouseStore.deployed().then(function(i) {i.addHouseToStore('bgy126n', 2, 'apartment', 0, 1, 'yljyl1n', 8, 0.8 * m_price, 'QmRbpprDDwSsohHMLZc8wqLHXYsYvTHqDjrna1A56MY9qJ', 'QmVLJ32c7v9eWJcRAyUoua2opug3yK4p6UHS2yUGafsPjm',5).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('bgy127n', 1, 'apartment', 0, 1, 'yljyl1n', 8, 0.6 * m_price, 'QmRbpprDDwSsohHMLZc8wqLHXYsYvTHqDjrna1A56MY9qJ', 'QmVLJ32c7v9eWJcRAyUoua2opug3yK4p6UHS2yUGafsPjm',2).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('bgy128n', 2, 'apartment', 1, 1, 'yljyl1n', 8, 0.9 * m_price, 'QmRbpprDDwSsohHMLZc8wqLHXYsYvTHqDjrna1A56MY9qJ', 'QmVLJ32c7v9eWJcRAyUoua2opug3yK4p6UHS2yUGafsPjm',7).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.HouseIndex.call().then(function(f){console.log(f)})});
}


// npm install -g ganache-cli@6.1.8