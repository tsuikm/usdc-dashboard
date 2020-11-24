<template :key="this.connected">
  <div class="container">
    <button
      class="connectButton"
      data-testid="transfers-card-connect-button"
      @click="connectMetamask"
    >
      Connect to MetaMask
    </button>
    <div class="status">
      <div v-if="this.connected">
        <md-icon class="check">
          check
        </md-icon>
        Connected to MetaMask
      </div>
      <div v-else>
        Not Connected to MetaMask
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3';
import { WEB3_PROVIDER } from '@/utils/constants';

const web3 = new Web3(WEB3_PROVIDER || Web3.givenProvider);

export default {
  name: 'ConnectToMetamask',
  data() {
    return {
      connected: null,
      accounts: [],
    };
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
      await web3.eth.getAccounts((err, accounts) => {
        if (err != null) {
          console.error('An error occurred: '+ err);
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

<style scoped lang="scss">
@import "@/assets/styles/variables/_colors.scss";

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.connectButton {
  margin-top: 40px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 5px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  color: #ffffff;
  background-color: #d4d4d4;
}

.status {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.check {
  color: $circle-green;
  margin-right: 10px;
}

</style>
