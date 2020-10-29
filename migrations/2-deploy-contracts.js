const HelloWorld = artifacts.require('./HelloWorld.sol');

module.exports = deployer => {
  deployer.deploy(HelloWorld);
}