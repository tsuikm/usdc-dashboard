<template>
  <div />
</template>

<script>
// modules
import { abi } from '@/utils/testTokenABI.js';
import Web3 from 'web3';
import { TEST_TOKEN_CONTRACT_ADDRESS, TEST_TOKEN_OWNER_ADDRESS, DEFAULT_GAS_PRICE } from '@/utils/constants.js';
const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(abi, TEST_TOKEN_CONTRACT_ADDRESS);

export default {
  data() {
    return { 
      accounts: [],
    };
  },
  async mounted() {
    await this.connectMetamask();
  },

  methods: {
    /**
     * Connects to metamasks and obtains the user's address to use in calling methods
     */
    async connectMetamask() {
      // eslint-disable-next-line
      this.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    },

    /**
     * Returns balance of an address
     * @param {string} address - hex string
     * @return {number} - base-10 number
     */
    async balanceOf(address) {
      return await contract.methods.balanceOf(address).call();
    },

    /**
     * Returns the decimals (6; cannot be changed); used in testing contract validity
     */
    async decimals() {
      return await contract.methods.decimals().call();
    },

    /**
     * Returns value of all the currency in circulation for this token
     * @return {number} - base-10 number
     */
    async totalSupply() {
      return await contract.methods.totalSupply().call();
    },

    /**
     * Checks if an address is a minter
     * @param {string} address - hex string
     * @return {bool} 
     */
    async isMinter(address) {
      return await contract.methods.isMinter(address).call();
    },

    /**
     * Returns address of master minter
     * @return {string} - hex string 
     */
    async masterMinter() {
      return await contract.methods.masterMinter().call();
    },

    /**
     * Returns address of pauser
     * @return {string} - hex string
     */
    async pauser() {
      return await contract.methods.pauser().call();
    },

    /**
     * Returns address of blacklister
     * @return {string} - hex string
     */
    async blacklister() {
      return await contract.methods.blacklister().call();
    },

    /**
     * Adds a minter to the test token contract
     * Must be called by the master minter
     *
     * @param {string} address - hex string
     * @param {number} allowance - base-10 number
     * @return {bool} - returns if the address has been successfully added as a minter
     * 
     */
    async addMinter(address, allowance) {
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.accounts[0],
                to: TEST_TOKEN_CONTRACT_ADDRESS,
                data: contract.methods.configureMinter(address, allowance).encodeABI(),
                gasPrice: DEFAULT_GAS_PRICE,
              },
            ],
          }).then(() => this.isMinter(address).then(bool => {
            return bool;
          }));
      } catch (e) {
        console.log(e);
        //show error
      }
    },

    /**
     * Changes address of master minter
     * Only one master minter can exist at a time
     *
     * @param {string} new_address - hex string
     * @return {string} - returns if the address is the new master minter (change won't be reflected until after transaction completes)
     * 
     */
    async updateMasterMinter(new_address) {
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: TEST_TOKEN_OWNER_ADDRESS,
                to: TEST_TOKEN_CONTRACT_ADDRESS,
                data: contract.methods.updateMasterMinter(new_address).encodeABI(),
                gasPrice: DEFAULT_GAS_PRICE,
              },
            ],
          }).then(() => this.masterMinter().then(masterMinter => {
            return masterMinter == new_address;
          }));
      } catch (e) {
        console.log(e);
        //show error
      }
    },

    /**
     * Mints money to an address
     * Caller must be minter
     *
     * @param {string} to_address - hex string
     * @param {number} amount - base-10 number
     * @return {number} - returns the balance of target address (changes won't be reflected until after transaction completes)
     * 
     */
    async mint(to_address, amount) {
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.accounts[0],
                to: TEST_TOKEN_CONTRACT_ADDRESS,
                data: contract.methods.mint(to_address, amount).encodeABI(),
                gasPrice: DEFAULT_GAS_PRICE,
              },
            ],
          }).then(() => this.balanceOf(to_address).then(balance => {
            return balance;
          }));
      } catch (e) {
        console.log(e);
        //show error
      }
    },

    /**
     * Reduces contract's ether by burning tokens
     * Must be called by a minter
     * 
     * @param {number} amount - base-10 number
     * @return {number} - returns the balance of user's address (burned amount will not be reflected until after transaction is processed)
     */
    async burn(amount) {
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.accounts[0],
                to: TEST_TOKEN_CONTRACT_ADDRESS,
                data: contract.methods.burn(amount).encodeABI(),
                gasPrice: DEFAULT_GAS_PRICE,
              },
            ],
          }).then(() => this.balanceOf(this.accounts[0]).then(balance => {
            return balance;
          }));
      } catch (e) {
        console.log(e);
        //show error
      }
    },

    /**
     * Changes the pauser
     * Only one pauser can exist at a time
     * 
     * @param {string} address - hex string
     * @return {bool} - returns if address is the pauser (changes will not be reflected until after transaction completes)
     */
    async updatePauser(address) {  
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: TEST_TOKEN_OWNER_ADDRESS,
                to: TEST_TOKEN_CONTRACT_ADDRESS,
                data: contract.methods.updatePauser(address).encodeABI(),
                gasPrice: DEFAULT_GAS_PRICE,
              },
            ],
          }).then(() => this.pauser().then( pauser => {
            return address == pauser;
          }));
      } catch (e) {
        console.log(e);
        //show error
      }
    },

    /**
     * Pauses the test token contract
     * Must be called by the pauser
     * 
     * @return {bool} - returns if the contract is paused or not (will not be updated until transaction completes)
     */
    async pause() {  
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.accounts[0],
                to: TEST_TOKEN_CONTRACT_ADDRESS,
                data: contract.methods.pause().encodeABI(),
                gasPrice: DEFAULT_GAS_PRICE,
              },
            ],
          }).then(() => this.paused().then(bool => {
            return bool;
          }));
      } catch (e) {
        console.log(e);
        //show error
      }
    },

    /**
     * Checks if contract is paused
     * @return {bool}
     */
    async paused() {
      return await contract.methods.paused().call();
    },

    /**
     * Unpauses the test token contract
     * Must be called by the pauser
     * 
     * @return {bool} - returns if the contract is paused or not (will not be updated until transaction completes)
     */
    async unpause() {  
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.accounts[0],
                to: TEST_TOKEN_CONTRACT_ADDRESS,
                data: contract.methods.unpause().encodeABI(),
                gasPrice: DEFAULT_GAS_PRICE,
              },
            ],
          }).then(() => this.paused().then(bool => {
            return bool;
          }));
      } catch (e) {
        console.log(e);
        //show error
      }
    },

    /**
     * Changed the address of the blacklister
     * 
     * @param {string} address - hex string
     */
    async updateBlacklister(address) {  
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: TEST_TOKEN_OWNER_ADDRESS,
                to: TEST_TOKEN_CONTRACT_ADDRESS,
                data: contract.methods.updateBlacklister(address).encodeABI(),
                gasPrice: DEFAULT_GAS_PRICE,
              },
            ],
          });
      } catch (e) {
        console.log(e);
        //show error
      }
    },

    /**
     * Blacklists an address
     * Caller must be blacklister
     * 
     * @param {string} address - hex string
     */
    async blacklist(address) {  
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.accounts[0],
                to: TEST_TOKEN_CONTRACT_ADDRESS,
                data: contract.methods.blacklist(address).encodeABI(),
                gasPrice: DEFAULT_GAS_PRICE,
              },
            ],
          });
      } catch (e) {
        console.log(e);
        //show error
      }
    },

    /**
     * Unblacklists an address
     * User must be blacklister
     * 
     * @param {string} address - hex string
     */
    async unBlacklist(address) {  
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.accounts[0],
                to: TEST_TOKEN_CONTRACT_ADDRESS,
                data: contract.methods.unBlacklist(address).encodeABI(),
                gasPrice: DEFAULT_GAS_PRICE,
              },
            ],
          });
      } catch (e) {
        console.log(e);
        //show error
      }
    },

    /**
     * Checks if address is blacklisted
     * @param {string} address - as a hex string.
     * @return {bool}
     */
    async isBlacklisted(address) {
      return await contract.methods.isBlacklisted(address).call();
    },

    /**
     * Returns address of owner
     * 
     */
    async owner() {
      return await contract.methods.owner().call();
    },
  },
};
</script>
