const Vault = artifacts.require("Vault");

module.exports = function (deployer, accounts) {
  deployer.deploy(Vault, 30);
};
