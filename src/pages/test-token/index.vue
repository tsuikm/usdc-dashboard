<template>
  <div>
  </div>
</template>

<script>

// modules
import { abi } from '@/utils/testTokenABI.js';
import Web3 from 'web3';
import { TEST_TOKEN_CONTRACT_ADDRESS, TEST_TOKEN_OWNER_ADDRESS, TEST_TOKEN_PAUSER_ADDRESS } from '@/utils/constants.js';

const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(abi, TEST_TOKEN_CONTRACT_ADDRESS);

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
  await address.mint(to_address, amount);
}

/**
 * Adds a minter to the test token contract
 *
 * @param {string} minter_address - as a hex string.
 * @param {number} amount - as a base-10 number.
 * 
 */
async function burn(minter_address, amount) {
  //await contract.methods.pause(address, allowance).call();
  await address.burn(amount);
}

/**
 * Pauses the test token contract
 */
async function pause() {
  //await contract.methods.pause(address, allowance).call();
  await TEST_TOKEN_PAUSER_ADDRESS.pause();
}

/**
 * Unpauses the test token contract
 */
async function unpause() {
  //await contract.methods.pause(address, allowance).call();
  await TEST_TOKEN_PAUSER_ADDRESS.unpause();
}

/**
 * blacklists an address
 * 
 * @param {string} address - as a hex string.
 */
async function blacklist(address) {
  //await contract.methods.blacklist(address).call();
  await TEST_TOKEN_BLACKLISTER_ADDRESS.blacklist(address);
}

/**
 * Unblacklists an address
 * 
 * @param {string} address - as a hex string.
 */
async function unblacklist(address) {
  //await contract.methods.unblacklist(address).call();
  await TEST_TOKEN_BLACKLISTER_ADDRESS.unblacklist(address);
}


export default {
  computed: {
    
  },
  async created() {
    
  },
  methods: {
  },
};
</script>
