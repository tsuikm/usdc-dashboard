const LocalERC20 = artifacts.require('./LocalERC20.sol');
const LocalERC20Proxy = artifacts.require('./LocalERC20Proxy.sol');

module.exports = async deployer => {
  await deployer.deploy(LocalERC20);
  await deployer.deploy(LocalERC20Proxy, LocalERC20.address);
}