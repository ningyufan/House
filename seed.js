HouseStore = artifacts.require("./HouseStore.sol");
module.exports = function(callback) {
  // current_time = Math.round(new Date() / 1000);
  m_price = web3.toWei(1, 'ether');
  HouseStore.deployed().then(function(i) {i.addHouseToStore('碧桂园123号', 2, '公寓', 1, 1, '教育路123号', 8, m_price, 999, 'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('碧桂园124号', 3, '公寓', 1, 1, '教育路124号', 8, 2 * m_price, 999, 'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('碧桂园125号', 3, '公寓', 1, 1, '教育路125号', 8, 1.5 * m_price, 999,  'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})}); 
  HouseStore.deployed().then(function(i) {i.addHouseToStore('碧桂园126号', 2, '公寓', 0, 1, '教育路126号', 8, 0.8 * m_price, 999, 'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('碧桂园127号', 1, '公寓', 0, 1, '教育路127号', 8, 0.6 * m_price, 999, 'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('碧桂园128号', 2, '公寓', 1, 1, '教育路128号', 8, 0.9 * m_price, 999, 'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('碧桂园129号', 2, '公寓', 1, 1, '教育路123号', 8, m_price, 999, 'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('碧桂园130号', 3, '公寓', 1, 1, '教育路124号', 8, 2 * m_price, 999, 'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('奥园1号', 10, '公寓', 5, 6, '澎湖湾899号', 3, 50 * m_price, 9999,  'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})}); 
  HouseStore.deployed().then(function(i) {i.addHouseToStore('奥园2号', 11, '公寓', 5, 6, '澎湖湾879号', 3, 49 * m_price, 9999, 'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('奥园3号', 12, '公寓', 5, 6, '澎湖湾778号', 3, 49 * m_price, 9999, 'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('奥园4号', 11, '公寓', 4, 5, '澎湖湾789号', 3, 49.99 * m_price, 9999, 'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('奥园5号', 10, '公寓', 5, 5, '澎湖湾897号', 3, 48.99 * m_price, 9999,  'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})}); 
  HouseStore.deployed().then(function(i) {i.addHouseToStore('奥园6号', 13, '公寓', 4, 7, '澎湖湾998号', 4, 50 * m_price, 9999, 'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('奥园7号', 12, '公寓', 4, 6, '澎湖湾999号', 4, 46.99 * m_price, 9999, 'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('奥园8号', 10, '公寓', 5, 5, '澎湖湾888号', 3, 45.99 * m_price, 9999, 'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('奥园9号', 15, '公寓', 6, 7, '澎湖湾777号', 4, 69.99 * m_price, 9999, 'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.addHouseToStore('奥园10号', 10, '公寓', 4, 4, '澎湖湾988号', 3, 48.99 * m_price, 9999, 'QmdqVgDu94zFvEohSVMgRDaHBeeSgYu5kmiHKGTZjAjYE6', 'QmaM2Vnq1PLng3t9doLdq7NrfrTCeV8azW8XUPGTTwQAWt',0).then(function(f) {console.log(f)})});
  HouseStore.deployed().then(function(i) {i.HouseIndex.call().then(function(f){console.log(f)})});
}


// npm install -g ganache-cli@6.1.8
