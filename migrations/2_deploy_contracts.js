var HouseStore = artifacts.require("./HouseStore.sol");

module.exports = function(deployer) {
  deployer.deploy(HouseStore);
};