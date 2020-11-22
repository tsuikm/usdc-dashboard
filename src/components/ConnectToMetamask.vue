<template>
  <div>
    <md-button
      class='connectButton'
      data-testid="transfers-card-connect-button"
      @click="connectMetamask"
    >
      Connect to Metamask
    </md-button>
    <div v-if="this.connected"> Connected to MetaMask </div>
    <div v-else> Not Connected to MetaMask </div>
  </div>
</template>

<script>
import Web3 from 'web3';
import {
  USDC_CONTRACT_ADDRESS,
  WEB3_PROVIDER,
} from '@/utils/constants';
import { abi } from '@/utils/web3abi';

const web3 = new Web3(WEB3_PROVIDER || Web3.givenProvider);
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  name: 'ConnectToMetamask',
  data() {
    return {
      connected: null,
    }
  },
  updated: function() {
    this.checkConnected();
  },
  methods: {
    async connectMetamask() {
      try {
        // eslint-disable-next-line
        this.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (e) {
        console.log(e);
      }
    },
    checkConnected() {
      web3.eth.getAccounts(function(err, accounts){
        if (err != null) {
          console.error("An error occurred: "+err);
        } else if (accounts.length == 0) {
          this.connected = false;
        } else {
          this.connected = true;
        }
      });
    },
  },
};
</script>

<style scoped>
.connectButton {
  color: #1ED67D;
}
</style>