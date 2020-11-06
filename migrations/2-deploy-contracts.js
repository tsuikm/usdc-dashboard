const LocalERC20 = artifacts.require('./LocalERC20.sol');

module.exports = deployer => {
  deployer.deploy(LocalERC20);
}