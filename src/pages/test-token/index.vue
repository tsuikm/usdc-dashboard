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

    /** Pause/Unpause */
    //this.pause().then(() => contract.methods.paused().call().then(console.log));


    /** Mint/Burn */
    // console.log(contract.methods.updatePauser('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb').call().then(console.log));
    // console.log(contract.methods.updateMasterMinter('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb').call().then(console.log));
    // console.log(contract.methods.masterMinter().call().then(console.log));
    // this.unpause();
    // this.paused();
    // this.addMinter('0xdC1e071D120FD40fB1173BCcc86c74F47645F4E0', 200).then(console.log());
    // this.isMinter('0xdC1e071D120FD40fB1173BCcc86c74F47645F4E0').then(console.log);
    // this.mint('0xdC1e071D120FD40fB1173BCcc86c74F47645F4E0', 50).then(console.log);
    this.balanceOf('0xdC1e071D120FD40fB1173BCcc86c74F47645F4E0').then(console.log);
    // this.masterMinter().then(console.log);
    // this.isMinter('0xf7c343FBc40F6B34DaA8bC2a97607BA4cEDF98c3').then(console.log);
    // console.log(contract.methods.balanceOf('0x5df6c542e318966CC5FB8862Faf25452574A6c5D').call().then(console.log));
    // console.log(contract.methods.minterAllowance('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb').call());
    // console.log(mint('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', TEST_TOKEN_MASTER_MINTER_ADDRESS, 10));
    // console.log(contract.methods.isPauser(TEST_TOKEN_PAUSER_ADDRESS).call());
    // console.log(addMinter(TEST_TOKEN_OWNER_ADDRESS, 100));

    /** Blacklist/UnBlacklist */
  },
  methods: {
    async connectMetamask() {
      // eslint-disable-next-line
          this.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    },

    /**
     * Returns balance of an address
     *
     * @param {string} address - as a hex string.
     * 
     */
    async balanceOf(address) {
      return await contract.methods.balanceOf(address).call();
    },

    /**
     * Returns 6 (cannot be changed); used in testing contract validity
     * 
     */
    async decimals() {
      return await contract.methods.decimals().call();
    },

    /**
     * Returns value of all the currency for this token
     * 
     */
    async totalSupply() {
      return await contract.methods.totalSupply().call();
    },

    /**
     * Checks if an address is a minter
     * @param {string} address - as a hex string.
     * 
     */
    async isMinter(address) {
      return await contract.methods.isMinter(address).call();
    },

    /**
     * Returns address of master minter.
     * 
     */
    async masterMinter() {
      return await contract.methods.masterMinter().call();
    },



    /**
     * Returns address of pauser
     * 
     */
    async pauser() {
      return await contract.methods.pauser().call();
    },

    /**
     * Adds a minter to the test token contract
     *
     * @param {string} address - as a hex string.
     * @param {number} allowance - as a base-10 number.
     * @return {bool} - returns if the address has been successfully added as a minter.
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
     * Adds a minter to the test token contract
     *
     * @param {string} master_minter_address - as a hex string.
     * @param {string} new_address - as a hex string.
     * @return {bool} - returns if the address has been successfully added as a master minter.
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
          }).then(() => this.isMinter(new_address).then(bool => {
            return bool;
          }));
      } catch (e) {
        console.log(e);
        //show error
      }
    },

    /**
     * Returns if address is valid contract 
     * DOESN'T WORK
     */
    // async isContract(address) {
    //   return await contract.methods.isContract(address).call();
    // }


    /**
     * Mints money to an address
     *
     * @param {string} address - as a hex string.
     * @param {number} amount - as a base-10 number.
     * @return {number} - returns the balance of target address.
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
     * Adds a minter to the test token contract
     *
     * @param {string} minter_address - as a hex string.
     * @param {number} amount - as a base-10 number.
     *  WORK IN PROGRESS
     */
    async burn(minter_address, amount) {
      return await contract.methods.burn(minter_address, amount).call();
    },

    /**
     * Pauses the test token contract
     * @return {bool} - returns if the contract is paused or not.
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
     */
    async paused() {
      return await contract.methods.paused().call();
    },


    /**
     * Unpauses the test token contract
     */
    // async unpause() {
    //   return await contract.methods.unpause().call();
    // },
    /**
     * Unauses the test token contract
     * @return {bool} - returns if the contract is paused or not.
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
     * Blacklists an address
     *  WORK IN PROGRESS
     * @param {string} address - as a hex string.
     */
    // async blacklist(address) {
    //   contract.methods.blacklist(address).call().then(() => this.isBlacklisted(address).then(bool => {
    //     return bool;
    //   }));
    // },


    /**
     * Blacklists an address
     * 
     * @param {string} address - as a hex string.
     * @return {bool} - Returns if address is blacklisted.
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
     * Checks if address is blacklisted
     * 
     * @param {string} address - as a hex string.
     */
    async isBlacklisted(address) {
      return await contract.methods.isBlacklisted(address).call();
    },

    // /**
    //  * Unblacklists an address
    //  *  WORK IN PROGRESS
    //  * @param {string} address - as a hex string.
    //  */
    // async unblacklist(address) {
    //   return await contract.methods.unblacklist(address).call();
    // },
    
    /**
     * Unlacklists an address
     *  WORK IN PROGRESS
     * @param {string} address - as a hex string.
     * @return {bool} - Returns if address is blacklisted.
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
     * Returns address of owner
     * 
     */
    async owner() {
      return await contract.methods.owner().call();
    },
  },

};

</script>
