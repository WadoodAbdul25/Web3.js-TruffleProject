var chainlist = artifacts.require("./Chainlist.sol");

module.exports = function(deployer){
  deployer.deploy(chainlist);
};
