<template>
  <div class="blacklister">
    <div
      class="header"
      data-testid="header"
    >
      Check and Blacklist Addresses
    </div>
    <form @submit.prevent="lookupBlacklistStatus">
      <md-field class="input-form">
        <md-input
          v-model="address"
          class="input"
          placeholder="Enter address here"
        />
        <md-button
          class="button"
          @click="lookupBlacklistStatus"
        >
          CHECK STATUS
        </md-button>
      </md-field>
    </form>
    <div
      v-if="this.isBlacklisted && this.lookupBlacklistStatus()"
      class="blacklist-clause"
    > 
      <div> This address is currently blacklisted. </div>
      <md-button @click="handleUnblacklist">
        UNBLACKLIST
      </md-button>
      <div> Click to unblacklist. </div>
    </div>
    <div
      v-else
      class="blacklist-clause"
    > 
      <div> This address is not currently blacklisted. </div>
      <md-button @click="handleBlacklist">
        BLACKLIST
      </md-button>
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
import { abi } from '@/utils/web3abi';

const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  name: 'Blacklister',
  data() {
    return {
      address: '',
      isBlacklisted: null,
      accounts,
    };
  },
  methods: {
    async connectMetamask() {
      // eslint-disable-next-line
      this.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    },
    async handleBlacklist() {
      await this.blacklist();
      this.isBlacklisted = true;
    },
    async handleUnblacklist() {
      await this.unBlacklist();
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
      return this.isBlacklisted;
    },
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
    async blacklist(address) {  
      await this.ethReq(contract.methods.blacklist(address).encodeABI());
    },

    async unBlacklist(address) { 
      await this.ethReq(contract.methods.unBlacklist(address).encodeABI())
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
  width: 50%;
}

.header {
  font-size: 20px;
  font-weight: 900;
  padding-bottom: 3%;
}

.button {
  margin-bottom: 5px;
}

.input-form {
  align-items: center;
}

.blacklist-clause {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
