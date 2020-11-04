<template>
  <div />
</template>

<script>

// modules
import { abi } from '@/utils/testTokenABI.js';
import Web3 from 'web3';
import { TEST_TOKEN_CONTRACT_ADDRESS, TEST_TOKEN_OWNER_ADDRESS, TEST_TOKEN_PAUSER_ADDRESS, TEST_TOKEN_MASTER_MINTER_ADDRESS, TEST_TOKEN_BLACKLISTER_ADDRESS } from '@/utils/constants.js';

const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(abi, '0xd96125fdc0b3b8db6d5d88146306b661cb42fbd6');

/**
 * Adds a minter to the test token contract
 *
 * @param {string} address - as a hex string.
 * @param {number} allowance - as a base-10 number.
 * @return {bool} - returns if the address has been successfully added as a minter.
 * 
 */
async function addMinter(address, allowance) {
  await contract.methods.configureMinter(address, allowance).call();
  return await contract.methods.isMinter(address);
}


/**
 * Adds a minter to the test token contract
 *
 * @param {string} minter_address - as a hex string.
 * @param {string} to_address - as a hex string.
 * @param {number} amount - as a base-10 number.
 * 
 */
async function mint(minter_address, to_address, amount) {
  //await contract.methods.pause(address, allowance).call();
  await contract.methods.mint(to_address, amount).call();
}

/**
 * Adds a minter to the test token contract
 *
 * @param {string} minter_address - as a hex string.
 * @param {number} amount - as a base-10 number.
 * 
 */
async function burn(minter_address, amount) {
  await contract.methods.burn(minter_address, amount).call();
}

/**
 * Pauses the test token contract
 */
async function pause() {
  await contract.methods.pause().call();
}

async function paused() {
  await contract.methods.paused().call();
}


/**
 * Unpauses the test token contract
 */
async function unpause() {
  await contract.methods.unpause(allowance).call();
}

/**
 * blacklists an address
 * 
 * @param {string} address - as a hex string.
 */
async function blacklist(address) {
  await contract.methods.blacklist(TEST_TOKEN_BLACKLISTER_ADDRESS, address).call();
}

/**
 * Unblacklists an address
 * 
 * @param {string} address - as a hex string.
 */
async function unblacklist(address) {
  await contract.methods.unblacklist(TEST_TOKEN_BLACKLISTER_ADDRESS, address).call();
}

async function owner() {
  return contract.methods.owner().call();
}

export default {
  // computed: {
  //   // testMint: async function() {
  //   //   return  mint('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', TEST_TOKEN_MASTER_MINTER_ADDRESS, 3);
  //   // },
  //   async testMint() {
  //     return await mint('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', TEST_TOKEN_MASTER_MINTER_ADDRESS, 3);
  //   },
  //   async testBurn() {
  //     return await burn('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', TEST_TOKEN_MASTER_MINTER_ADDRESS, 3);
  //   },
  //   async testPause() {
  //     await pause();
  //     return await mint('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', TEST_TOKEN_MASTER_MINTER_ADDRESS, 3);
  //   },
  //   async testUnpause() {
  //     await unpause();
  //     return await mint('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', TEST_TOKEN_MASTER_MINTER_ADDRESS, 3);
  //   },
    
  // },
  //   async created() {
    
//   },
//   methods: {
//   },
};
// console.log(addMinter('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', 100));
// console.log(contract.methods.isMinter('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb').call());
// console.log(contract.methods.minterAllowance('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb').call());
// console.log(mint('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', TEST_TOKEN_MASTER_MINTER_ADDRESS, 10));
console.log(1);
console.log(owner().then(console.log));
console.log(2);
// console.log(addMinter(TEST_TOKEN_OWNER_ADDRESS, 100));

// console.log(contract.methods.isMinter(TEST_TOKEN_OWNER_ADDRESS).call());
// console.log(mint(TEST_TOKEN_OWNER_ADDRESS, TEST_TOKEN_MASTER_MINTER_ADDRESS, 10));

</script>
