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
    contract.methods.minterAllowance('0x4ca277e9D70f4681A66f6dB2d537683Ca4e0C5B2').call().then(console.log);

    /**
     * To test write operations on the test token uncomment the corresonding code block
     * To test read operations, call the methods in below, i.e. await this.paused().then(console.log);
     */

    // //PAUSE/UNPAUSE
    // //Enter your address where it says <your address here>
    // //Ask tetsu to add you as the pauser
    // // wait for the transaction to complete, can check events on https://ropsten.etherscan.io/address/0xfc7e3a2554e2d4b23e41c81b14065ee31009cc31?fbclid=IwAR2n5sYWXwL7vuTkORYsBI4j-d8FFFogbQEdj2pZ-Ivb8j-eGjZEhcOCFDg#events
    // // //then uncomment below and check the console
    // //await this.pauser().then(pauser => {
    // //console.log(pauser == <your address here>);
    // //}
    // // //call pause
    // // await this.pause();
    // // //wait for the transaction to complete, can check events on https://ropsten.etherscan.io/address/0xfc7e3a2554e2d4b23e41c81b14065ee31009cc31?fbclid=IwAR2n5sYWXwL7vuTkORYsBI4j-d8FFFogbQEdj2pZ-Ivb8j-eGjZEhcOCFDg#events
    // // //then uncomment below and check the console
    // // //this.paused().then(console.log))
    // // //call unpause
    // // await this.unpause();
    // // //wait for the transaction to complete, can check events on https://ropsten.etherscan.io/address/0xfc7e3a2554e2d4b23e41c81b14065ee31009cc31?fbclid=IwAR2n5sYWXwL7vuTkORYsBI4j-d8FFFogbQEdj2pZ-Ivb8j-eGjZEhcOCFDg#events
    // // //then uncomment below and check the console
    // // //this.paused().then(console.log))


    // //Mint/Burn
    // //Enter your address where it says <your address here>
    // //Ask tetsu to add you as the masterMinter
    // // wait for the transaction to complete, can check events on https://ropsten.etherscan.io/address/0xfc7e3a2554e2d4b23e41c81b14065ee31009cc31?fbclid=IwAR2n5sYWXwL7vuTkORYsBI4j-d8FFFogbQEdj2pZ-Ivb8j-eGjZEhcOCFDg#events
    // // //then uncomment below and check the console
    // //await this.masterMinter().then(masterMinter => {
    // //console.log(masterMinter == <your address here>);
    // //}
    // //Add minter
    // // await this.addMinter(<minter address here>, <allowance>);
    // // wait for the transaction to complete, can check events on https://ropsten.etherscan.io/address/0xfc7e3a2554e2d4b23e41c81b14065ee31009cc31?fbclid=IwAR2n5sYWXwL7vuTkORYsBI4j-d8FFFogbQEdj2pZ-Ivb8j-eGjZEhcOCFDg#events
    // // //then uncomment below and check the console
    // //await this.isMinter(<minter address here>).then(console.log);
    // // //call mint
    //await this.mint(TEST_TOKEN_OWNER_ADDRESS, 10);
    // // //wait for the transaction to complete, can check events on https://ropsten.etherscan.io/address/0xfc7e3a2554e2d4b23e41c81b14065ee31009cc31?fbclid=IwAR2n5sYWXwL7vuTkORYsBI4j-d8FFFogbQEdj2pZ-Ivb8j-eGjZEhcOCFDg#events
    // // //then uncomment below and check the console
    // // //this.balanceOf(<to address>).then(console.log))
    // // //call burn
    // // await this.burn(<amount>);
    // // //wait for the transaction to complete, can check events on https://ropsten.etherscan.io/address/0xfc7e3a2554e2d4b23e41c81b14065ee31009cc31?fbclid=IwAR2n5sYWXwL7vuTkORYsBI4j-d8FFFogbQEdj2pZ-Ivb8j-eGjZEhcOCFDg#events
    // // //then uncomment below and check the console
    // // //this.balanceOf(<minter address>).then(console.log))

    // //BLACKLIST/UNBLACKLIST
    // //Enter your address where it says <your address here>
    // //Ask tetsu to add you as the blacklister
    // // wait for the transaction to complete, can check events on https://ropsten.etherscan.io/address/0xfc7e3a2554e2d4b23e41c81b14065ee31009cc31?fbclid=IwAR2n5sYWXwL7vuTkORYsBI4j-d8FFFogbQEdj2pZ-Ivb8j-eGjZEhcOCFDg#events
    // // //then uncomment below and check the console
    // //await this.blacklister().then(blacklister => {
    // //console.log(blacklister == <your address here>);
    // //}
    // // //call blacklist
    // // await this.blacklist();
    // // //wait for the transaction to complete, can check events on https://ropsten.etherscan.io/address/0xfc7e3a2554e2d4b23e41c81b14065ee31009cc31?fbclid=IwAR2n5sYWXwL7vuTkORYsBI4j-d8FFFogbQEdj2pZ-Ivb8j-eGjZEhcOCFDg#events
    // // //then uncomment below and check the console
    // // //this.blacklistd().then(console.log))
    // // //call unblacklist
    // // await this.unBlacklist();
    // // //wait for the transaction to complete, can check events on https://ropsten.etherscan.io/address/0xfc7e3a2554e2d4b23e41c81b14065ee31009cc31?fbclid=IwAR2n5sYWXwL7vuTkORYsBI4j-d8FFFogbQEdj2pZ-Ivb8j-eGjZEhcOCFDg#events
    // // //then uncomment below and check the console
    // // //this.unBlacklist().then(console.log))

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
     * General method to make ethereum requests
     * @param {method} data
     */
    async ethReq(data) {
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.accounts[0],
                to: TEST_TOKEN_CONTRACT_ADDRESS,
                data: data,
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
     * Adds a minter to the test token contract
     * Must be called by the master minter
     *
     * @param {string} address - hex string
     * @param {number} allowance - base-10 number
     * 
     */
    async addMinter(address, allowance) {
      await this.ethReq(contract.methods.configureMinter(address, allowance).encodeABI());
    },

    /**
     * Changes address of master minter
     * Only one master minter can exist at a time
     *
     * @param {string} new_address - hex string
     * 
     */
    async updateMasterMinter(new_address) {
      await this.ethReq(contract.methods.updateMasterMinter(new_address).encodeABI());
    },

    /**
     * Mints money to an address
     * Caller must be minter
     *
     * @param {string} to_address - hex string
     * @param {number} amount - base-10 number
     * 
     */
    async mint(to_address, amount) {
      await this.ethReq(contract.methods.mint(to_address, amount).encodeABI());
    },

    /**
     * Reduces contract's ether by burning tokens
     * Must be called by a minter
     * 
     * @param {number} amount - base-10 number
     */
    async burn(amount) {
      await this.ethReq(contract.methods.burn(amount).encodeABI());
    },

    /**
     * Changes the pauser
     * Only one pauser can exist at a time
     * 
     * @param {string} address - hex string
     */
    async updatePauser(address) {  
      await this.ethReq(contract.methods.updatePauser(address).encodeABI());
    },

    /**
     * Pauses the test token contract
     * Must be called by the pauser
     * 
     */
    async pause() {  
      await this.ethReq(contract.methods.pause().encodeABI());
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
     */
    async unpause() {  
      await this.ethReq(contract.methods.unpause().encodeABI());
    },

    /**
     * Changed the address of the blacklister
     * 
     * @param {string} address - hex string
     */
    async updateBlacklister(address) {  
      await this.ethReq(contract.methods.updateBlacklister(address).encodeABI());
    },

    /**
     * Blacklists an address
     * Caller must be blacklister
     * 
     * @param {string} address - hex string
     */
    async blacklist(address) {  
      await this.ethReq(contract.methods.blacklist(address).encodeABI());
    },

    /**
     * Unblacklists an address
     * User must be blacklister
     * 
     * @param {string} address - hex string
     */
    async unBlacklist(address) { 
      await this.ethReq(contract.methods.unBlacklist(address).encodeABI());
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
