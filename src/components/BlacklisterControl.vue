<template>
  <div class="blacklister">
    <div class="header" data-testid="header">
      Check and Blacklist Roles
    </div>
    <form @submit.prevent="lookupBlacklistStatus">
      <input
        v-model="address"
        placeholder="Enter Wallet Address Here"
      >
      <button> CHECK STATUS</button>
    </form>
    <div
      v-if="this.isBlacklisted === true"
      data-testid="check-blacklisted"
    > 
      <div> This address is currently blacklisted. </div>
      <button @click="handleUnblacklist" data-testid="unblacklist">
        UNBLACKLIST
      </button>
      <div> Click to unblacklist. </div>
    </div>
    <div
      v-else-if="this.isBlacklisted === false"
      data-testid="check-unblacklisted"
    > 
      <div> This address is not currently blacklisted. </div>
      <button @click="handleBlacklist" data-testid="blacklist">
        BLACKLIST
      </button>
      <div> Click to blacklist. </div>
    </div>
  </div>
</template>

<script>
import {
  USDC_CONTRACT_ADDRESS,
  WEB3_BALANCEOF_ADDRESS_LENGTH,
} from '@/utils/constants';
import Web3 from 'web3';
import { padHex } from '@/utils/utils';

const web3 = new Web3(Web3.givenProvider);

const abi = [
  {
    inputs: [{ name: '_account', type: 'address' }],
    name: 'isBlacklisted',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
];

const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  name: 'Blacklister',
  data() {
    return {
      address: '',
      isBlacklisted: null,
    };
  },
  methods: {
    async handleBlacklist() {
      this.isBlacklisted = true;
    },
    async handleUnblacklist() {
      this.isBlacklisted = false;
    },
    async lookupBlacklistStatus() {
      if (this.address === '') {
        this.isBlacklisted = null;
        return;
      }
      this.isBlacklisted = await contract.methods
        .isBlacklisted(padHex(this.address, WEB3_BALANCEOF_ADDRESS_LENGTH))
        .call();
    },
  },
};
</script>

<style scoped>
.blacklister {
  padding: 30px;
  margin: 40px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header {
  font-size: 20px;
  font-weight: 900;
  padding-bottom: 3%;
}
.check-blacklisted {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.check-unblacklisted {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
