<template :key="this.updateComponent">
  <div>
    <md-button
      class='connectButton'
      data-testid="transfers-card-connect-button"
      @click="connectMetamask"
    >
      Connect to Metamask
    </md-button>
    <div v-if="this.connected"> {{'test=' + this.connected}} Connected to MetaMask </div>
    <div v-else> {{'test=' + this.connected}} Not Connected to MetaMask </div>
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
      updateComponent: null,
    }
  },
  created: function() {
    this.checkConnected();
  },
  methods: {
    async connectMetamask() {
      try {
        // eslint-disable-next-line
        this.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        this.checkConnected();
      } catch (e) {
        console.log(e);
      }
    },
    async checkConnected() {
      console.log('inside check connected function');
      const check = await web3.eth.getAccounts(function(err, accounts){
        console.log('accounts', accounts);
        if (err != null) {
          console.error("An error occurred: "+err);
        } else if (accounts.length == 0) {
          this.connected = false;
          console.log('should be false', this.connected);

          console.log('not yet', this.updateComponent)
          this.updateComponent = this.connected;
          console.log('now', this.updateComponent)
        } else {
          this.connected = true;
          console.log('should be true', this.connected);
          
          console.log('not yet', this.updateComponent);
          this.updateComponent = this.connected;
          console.log('now', this.updateComponent);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/variables/_colors.scss";

.connectButton {
  color: $circle-green;
}
</style>