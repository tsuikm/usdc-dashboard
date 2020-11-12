const FiatTokenV2 = artifacts.require('./FiatTokenV2.sol');
const FiatTokenProxy = artifacts.require('./FiatTokenProxy.sol');

module.exports = async deployer => {
  await deployer.deploy(FiatTokenV2);
  await deployer.deploy(FiatTokenProxy, FiatTokenV2.address);
}