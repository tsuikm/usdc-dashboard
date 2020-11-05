<template>
  <div />
</template>

<script>

// modules
import { abi } from '@/utils/testTokenABI.js';
import Web3 from 'web3';
import { TEST_TOKEN_CONTRACT_ADDRESS, TEST_TOKEN_OWNER_ADDRESS, TEST_TOKEN_PAUSER_ADDRESS, TEST_TOKEN_MASTER_MINTER_ADDRESS, TEST_TOKEN_BLACKLISTER_ADDRESS } from '@/utils/constants.js';

const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(abi, '0xfc7e3a2554e2d4b23e41c81b14065ee31009cc31');

/**
 * Adds a minter to the test token contract
 *
 * @param {string} address - as a hex string.
 * @param {number} allowance - as a base-10 number.
 * @return {bool} - returns if the address has been successfully added as a minter.
 *  IN PROGRESS
 */
async function addMinter(address, allowance) {
  await contract.methods.configureMinter(address, allowance).call();
  return await contract.methods.isMinter(address);
}


/**
 * Returns balance of an address
 *
 * @param {string} address - as a hex string.
 * 
 */
async function balanceOf(address) {
  let balance = await contract.methods.balanceOf(address).call();
  return balance;
}

/**
 * Returns 6 (cannot be changed); used in testing contract validity
 * 
 */
async function decimals() {
  let decimals = await contract.methods.decimals().call();
  return decimals;
}

/**
 * Returns value of all the currency for this token
 * 
 */
async function totalSupply() {
  let totalsupply = await contract.methods.totalSupply().call();
  return totalsupply;
}

/**
 * Checks if an address is a minter
 * @param {string} address - as a hex string.
 * 
 */
async function isMinter(address) {
  let isminter = await contract.methods.isMinter(address).call();
  return isminter;
}

/**
 * Returns address of pauser
 * 
 */
async function pauser() {
  let pauser = await contract.methods.pauser().call();
  return pauser;
}

/**
 * Returns if address is valid contract 
 * DOESN'T WORK
 */
// async function isContract(address) {
//   let iscontract = await contract.methods.isContract(address).call();
//   return iscontract;
// }

/**
 * Adds a minter to the test token contract
 *
 * @param {string} minter_address - as a hex string.
 * @param {string} to_address - as a hex string.
 * @param {number} amount - as a base-10 number.
 *  WORK IN PROGRESS
 */
async function mint(to_address, amount) {
  //await contract.methods.pause(address, allowance).call();
  return contract.methods.mint(to_address, amount).call();
}


/**
 * Adds a minter to the test token contract
 *
 * @param {string} minter_address - as a hex string.
 * @param {number} amount - as a base-10 number.
 *  WORK IN PROGRESS
 */
async function burn(minter_address, amount) {
  return contract.methods.burn(minter_address, amount).call();
}

/**
 * Pauses the test token contract
 */
async function pause() {
  return contract.methods.pause().call();
}


/**
 * Checks if contract is paused
 */
async function paused() {
  return contract.methods.paused().call();
}


/**
 * Unpauses the test token contract
 */
async function unpause() {
  return contract.methods.unpause().call();
}

/**
 * Blacklists an address
 *  WORK IN PROGRESS
 * @param {string} address - as a hex string.
 */
async function blacklist(address) {
  await contract.methods.blacklist(TEST_TOKEN_BLACKLISTER_ADDRESS, address).call();
}


/**
 * Checks if address is blacklisted
 * 
 * @param {string} address - as a hex string.
 */
async function isBlacklisted(address) {
  return contract.methods.isBlacklisted(address).call();
}

/**
 * Unblacklists an address
 *  WORK IN PROGRESS
 * @param {string} address - as a hex string.
 */
async function unblacklist(address) {
  await contract.methods.unblacklist(TEST_TOKEN_BLACKLISTER_ADDRESS, address).call();
}


/**
 * Returns address of owner
 * 
 */
async function owner() {
  return contract.methods.owner().call();
}

export default {

};

</script>
