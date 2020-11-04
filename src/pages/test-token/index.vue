<template>
  <div />
</template>

<script>

// modules
import { abi } from '@/utils/testTokenABI.js';
import Web3 from 'web3';
import { padHex } from '@/utils/utils';
import { WEB3_BALANCEOF_ADDRESS_LENGTH, TEST_TOKEN_CONTRACT_ADDRESS, TEST_TOKEN_OWNER_ADDRESS, TEST_TOKEN_PAUSER_ADDRESS, TEST_TOKEN_MASTER_MINTER_ADDRESS, TEST_TOKEN_BLACKLISTER_ADDRESS } from '@/utils/constants.js';

const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(abi, TEST_TOKEN_CONTRACT_ADDRESS);

 async function connectMetamask() {
      // eslint-disable-next-line
      await ethereum.request({ method: 'eth_requestAccounts' });
  }

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
}


/**
 * Adds a minter to the test token contract
 *
 * @param {string} minter_address - as a hex string.
 * @param {string} to_address - as a hex string.
 * @param {number} amount - as a base-10 number.
 * 
 */
async function mint(to_address, amount) {
  await contract.methods.mint(to_address, amount).call();
}

/**
 * Adds a minter to the test token contract
 *
 * @param {number} amount - as a base-10 number.
 * 
 */
async function burn(amount) {
  await contract.methods.burn(amount).call();
}

/**
 * Pauses the test token contract
 */
async function pause() {
  await contract.methods.pause().call();
}

/**
 * Unpauses the test token contract
 */
async function unpause() {
  await contract.methods.unpause().call();
}

/**
 * blacklists an address
 * 
 * @param {string} address - as a hex string.
 */
async function blacklist(address) {
  await contract.methods.blacklist(address).call();
}

/**
 * Unblacklists an address
 * 
 * @param {string} address - as a hex string.
 */
async function unblacklist(address) {
  await contract.methods.unblacklist(address).call();
}


export default {
  computed: {
    // testMint: async function() {
    //   return  mint('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', TEST_TOKEN_MASTER_MINTER_ADDRESS, 3);
    // },
    async testMint() {
      return await mint('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', TEST_TOKEN_MASTER_MINTER_ADDRESS, 3);
    },
    async testBurn() {
      return await burn('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', TEST_TOKEN_MASTER_MINTER_ADDRESS, 3);
    },
    async testPause() {
      await pause();
      return await mint('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', TEST_TOKEN_MASTER_MINTER_ADDRESS, 3);
    },
    async testUnpause() {
      await unpause();
      return await mint('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', TEST_TOKEN_MASTER_MINTER_ADDRESS, 3);
    },
    
  },
  async created() {
    
  },
  methods: {
  },
};
//web3.eth.defaultAccount = padHex('0x5df6c542e318966CC5FB8862Faf25452574A6c5D', WEB3_BALANCEOF_ADDRESS_LENGTH);
//console.log(addMinter(padHex('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', WEB3_BALANCEOF_ADDRESS_LENGTH), 100));
//console.log(contract.methods.isMinter(padHex('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', WEB3_BALANCEOF_ADDRESS_LENGTH)).call().then(console.log));
//console.log(contract.methods.pauser().call().then(console.log));
console.log(contract.methods.totalSupply().call().then(console.log));
console.log(contract.methods.decimals().call().then(console.log));
console.log(contract.methods.balanceOf(padHex('0x5df6c542e318966CC5FB8862Faf25452574A6c5D', WEB3_BALANCEOF_ADDRESS_LENGTH)).call().then(console.log));
//console.log(contract.methods.minterAllowance('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb').call());
// console.log(mint('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', TEST_TOKEN_MASTER_MINTER_ADDRESS, 10));
// console.log(contract.methods.isPauser(TEST_TOKEN_PAUSER_ADDRESS).call());
// console.log(addMinter(TEST_TOKEN_OWNER_ADDRESS, 100));

// console.log(contract.methods.isMinter(TEST_TOKEN_OWNER_ADDRESS).call());
// console.log(mint(TEST_TOKEN_OWNER_ADDRESS, TEST_TOKEN_MASTER_MINTER_ADDRESS, 10));

</script>
