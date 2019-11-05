HouseStore = artifacts.require("./HouseStore.sol");
module.exports = function(callback) {
  // current_time = Math.round(new Date() / 1000);
  m_price = web3.toWei(1, 'ether');
  HouseStore.deployed().then(function(i) {i.addHouseToStore('碧桂园', 2, '公寓', 1, 1, '教育路123号', 8, m_price, 999, 'QmRbpprDDwSsohHMLZc8wqLHXYsYvTHqDjrna1A56MY9qJ', 'QmVLJ32c7v9eWJcRAyUoua2opug3yK4p6UHS2yUGafsPjm',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('碧桂园124n', 3, '公寓', 1, 1, '教育路124号', 8, 2 * m_price, 999, 'QmRbpprDDwSsohHMLZc8wqLHXYsYvTHqDjrna1A56MY9qJ', 'QmVLJ32c7v9eWJcRAyUoua2opug3yK4p6UHS2yUGafsPjm',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('碧桂园125n', 3, '公寓', 1, 1, '教育路125号', 8, 1.5 * m_price, 999,  'QmRbpprDDwSsohHMLZc8wqLHXYsYvTHqDjrna1A56MY9qJ', 'QmVLJ32c7v9eWJcRAyUoua2opug3yK4p6UHS2yUGafsPjm',0).then(function(f) {console.log(f)})}); 
  HouseStore.deployed().then(function(i) {i.addHouseToStore('碧桂园126n', 2, '公寓', 0, 1, '教育路126号', 8, 0.8 * m_price, 999, 'QmRbpprDDwSsohHMLZc8wqLHXYsYvTHqDjrna1A56MY9qJ', 'QmVLJ32c7v9eWJcRAyUoua2opug3yK4p6UHS2yUGafsPjm',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('碧桂园127n', 1, '公寓', 0, 1, '教育路127号', 8, 0.6 * m_price, 999, 'QmRbpprDDwSsohHMLZc8wqLHXYsYvTHqDjrna1A56MY9qJ', 'QmVLJ32c7v9eWJcRAyUoua2opug3yK4p6UHS2yUGafsPjm',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('碧桂园128n', 2, '公寓', 1, 1, '教育路128号', 8, 0.9 * m_price, 999, 'QmRbpprDDwSsohHMLZc8wqLHXYsYvTHqDjrna1A56MY9qJ', 'QmVLJ32c7v9eWJcRAyUoua2opug3yK4p6UHS2yUGafsPjm',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.HouseIndex.call().then(function(f){console.log(f)})});
}


// npm install -g ganache-cli@6.1.8
