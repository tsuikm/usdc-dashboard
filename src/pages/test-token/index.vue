<template>
  <div />
</template>

<script>
// modules
import { abi } from '@/utils/testTokenABI.js';
import Web3 from 'web3';
import { TEST_TOKEN_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE } from '@/utils/constants.js';
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
      const balance = await contract.methods.balanceOf(address).call();
      return balance;
    },

    /**
     * Returns 6 (cannot be changed); used in testing contract validity
     */
    async decimals() {
      const decimal = await contract.methods.decimals().call();
      return decimal;
    },

    /**
     * Returns value of all the currency in circulation for this token
     * @return {number} - base-10 number
     */
    async totalSupply() {
      const supply = await contract.methods.totalSupply().call();
      return supply;
    },

    /**
     * Checks if an address is a minter
     * @param {string} address - hex string
     * @return {bool} 
     */
    async isMinter(address) {
      const minter = await contract.methods.isMinter(address).call();
      return minter;
    },

    /**
     * Returns address of master minter
     * @return {string} - hex string 
     */
    async masterMinter() {
      const masterminter_address = await contract.methods.masterMinter().call();
      return masterminter_address;
    },

    /**
     * Returns address of pauser
     * @return {string} - hex string
     */
    async pauser() {
      const pauser_address = await contract.methods.pauser().call();
      return pauser_address;
    },

    /**
     * Returns address of blacklister
     * @return {string} - hex string
     */
    async blacklister() {
      const pauser_address = await contract.methods.blacklister().call();
      return pauser_address;
    },

    /**
     * Adds a minter to the test token contract
     * User must be master minter
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
     * @return {string} - returns address of new master minter (should be same as new_address, change won't be reflected until after transaction completes)
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
                from: '0xdC1e071D120FD40fB1173BCcc86c74F47645F4E0',
                to: TEST_TOKEN_CONTRACT_ADDRESS,
                data: contract.methods.updateMasterMinter(new_address).encodeABI(),
                gasPrice: DEFAULT_GAS_PRICE,
              },
            ],
          }).then(() => this.masterMinter().then(console.log));
      } catch (e) {
        console.log(e);
        //show error
      }
    },

    /**
     * Mints money to an address
     * User must be minter
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
          }).then(() => this.balanceOf(to_address).then(console.log,
          ));
      } catch (e) {
        console.log(e);
        //show error
      }
    },


    /**
     * Reduces balance of user's address
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
          }).then(() => this.balanceOf(this.accounts[0]).then(console.log));
      } catch (e) {
        console.log(e);
        //show error
      }
    },



    /**
     * Pauses the test token contract
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
     * Unauses the test token contract
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
     * Allows address to blacklist
     * 
     * @param {string} address - hex string
     * @return {bool} - returns if address is blacklisted (changes will not be reflected until after transaction completes)
     */
    async updateBlacklister(address) {  
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.accounts[0],
                to: TEST_TOKEN_CONTRACT_ADDRESS,
                data: contract.methods.updateBlacklister(address).encodeABI(),
                gasPrice: DEFAULT_GAS_PRICE,
              },
            ],
          }).then(() => this.blacklister().then(bool => {
            return bool;
          }));
      } catch (e) {
        console.log(e);
        //show error
      }
    },

    /**
     * Blacklists an address
     * User must be blacklister
     * 
     * @param {string} address - hex string
     * @return {bool} - returns if address is blacklisted
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
          }).then(() => this.isBlacklisted(address).then(bool => {
            return bool;
          }));
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
     * @return {bool} - returns if address is blacklisted
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
          }).then(() => this.isBlacklisted(address).then(bool => {
            return bool;
          }));
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
      const isblacklist = await contract.methods.isBlacklisted(address).call();
      return isblacklist;
    },

    /**
     * Returns address of owner
     * 
     */
    async owner() {
      const owner_address = await contract.methods.owner().call();
      return owner_address;
    },
  },

};

</script>
