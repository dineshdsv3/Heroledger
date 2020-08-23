var heroledger = artifacts.require("heroledger.sol");

module.exports = function(deployer){
    deployer.deploy(heroledger);
}