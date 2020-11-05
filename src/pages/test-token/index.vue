<template>
  <div />
</template>

<script>

// modules
import { abi } from '@/utils/testTokenABI.js';
import Web3 from 'web3';
import { TEST_TOKEN_CONTRACT_ADDRESS } from '@/utils/constants.js';

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
    this.pause().then(() => contract.methods.paused().call().then(console.log),
    );


    // console.log(contract.methods.updatePauser('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb').call().then(console.log));
    // console.log(contract.methods.updateMasterMinter('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb').call().then(console.log));
    // console.log(contract.methods.masterMinter().call().then(console.log));

    // console.log(addMinter('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', 100));
    // console.log(contract.methods.isMinter('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb').call().then(console.log));
    // console.log(contract.methods.balanceOf('0x5df6c542e318966CC5FB8862Faf25452574A6c5D').call().then(console.log));
    // console.log(contract.methods.minterAllowance('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb').call());
    // console.log(mint('0x4A9F11E349d37d074A0D41f05CedeB24c1fA67Fb', TEST_TOKEN_MASTER_MINTER_ADDRESS, 10));
    // console.log(contract.methods.isPauser(TEST_TOKEN_PAUSER_ADDRESS).call());
    // console.log(addMinter(TEST_TOKEN_OWNER_ADDRESS, 100));
  },
  methods: {

    async connectMetamask() {
      // eslint-disable-next-line
          this.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    },

    /**
     * Adds a minter to the test token contract
     *
     * @param {string} address - as a hex string.
     * @param {number} allowance - as a base-10 number.
     * @return {bool} - returns if the address has been successfully added as a minter.
     *  IN PROGRESS
     */
    async addMinter(address, allowance) {
      await contract.methods.configureMinter(address, allowance).call();
      return await contract.methods.isMinter(address);
    },


    /**
     * Returns balance of an address
     *
     * @param {string} address - as a hex string.
     * 
     */
    async balanceOf(address) {
      let balance = await contract.methods.balanceOf(address).call();
      return balance;
    },

    /**
     * Returns 6 (cannot be changed); used in testing contract validity
     * 
     */
    async decimals() {
      let decimals = await contract.methods.decimals().call();
      return decimals;
    },

    /**
     * Returns value of all the currency for this token
     * 
     */
    async totalSupply() {
      let totalsupply = await contract.methods.totalSupply().call();
      return totalsupply;
    },

    /**
     * Checks if an address is a minter
     * @param {string} address - as a hex string.
     * 
     */
    async isMinter(address) {
      let isminter = await contract.methods.isMinter(address).call();
      return isminter;
    },

    /**
     * Returns address of pauser
     * 
     */
    async pauser() {
      let pauser = await contract.methods.pauser().call();
      return pauser;
    },

    /**
     * Returns if address is valid contract 
     * DOESN'T WORK
     */
    // async isContract(address) {
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
    async mint(to_address, amount) {
      //await contract.methods.pause(address, allowance).call();
      return contract.methods.mint(to_address, amount).call();
    },


    /**
     * Adds a minter to the test token contract
     *
     * @param {string} minter_address - as a hex string.
     * @param {number} amount - as a base-10 number.
     *  WORK IN PROGRESS
     */
    async burn(minter_address, amount) {
      return contract.methods.burn(minter_address, amount).call();
    },

    /**
     * Pauses the test token contract
     */
    async pause() {  
      try {
        console.log(this.accounts[0]);
        console.log(TEST_TOKEN_CONTRACT_ADDRESS);
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.accounts[0],
                to: TEST_TOKEN_CONTRACT_ADDRESS,
                data: contract.methods.pause().encodeABI(),
                gasPrice: '0x09184e72a000',
              },
            ],
          });
      } catch (e) {
        console.log(e);
        //show error
      }
    },


    /**
     * Checks if contract is paused
     */
    async paused() {
      return contract.methods.paused().call();
    },


    /**
     * Unpauses the test token contract
     */
    async unpause() {
      return contract.methods.unpause().call();
    },

    /**
     * Blacklists an address
     *  WORK IN PROGRESS
     * @param {string} address - as a hex string.
     */
    async blacklist(address) {
      await contract.methods.blacklist(address).call();
    },


    /**
     * Checks if address is blacklisted
     * 
     * @param {string} address - as a hex string.
     */
    async isBlacklisted(address) {
      return contract.methods.isBlacklisted(address).call();
    },

    /**
     * Unblacklists an address
     *  WORK IN PROGRESS
     * @param {string} address - as a hex string.
     */
    async unblacklist(address) {
      await contract.methods.unblacklist(address).call();
    },


    /**
     * Returns address of owner
     * 
     */
    async owner() {
      return contract.methods.owner().call();
    },
  },

};

</script>
