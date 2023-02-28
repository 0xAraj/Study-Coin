const Study = artifacts.require("Study.sol");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Study);
};
