<template>
  <div>
    <NavBar />
    <md-card
      class="transferCard"
      data-testid="transfers-card-test-id"
    >
      <md-card-header class="transferCardHeader">
        <div class="md-title">
          Transfer USDC
        </div>
      </md-card-header>
      <md-field
        class="transferInput"
        data-testid="transfers-card-from-input"
      >
        <label>From</label>
        <md-input />
      </md-field>

      <md-field
        class="transferInput"
        data-testid="transfers-card-to-input"
      >
        <label>To</label>
        <md-input v-model="to" />
      </md-field>
      <md-field
        class="transferInput"
        data-testid="transfers-card-amount-input"
      >
        <label>Transfer Amount</label>
        <md-input v-model="amount" />
      </md-field>
      <md-card-actions>
        <md-button
          data-testid="transfers-card-connect-button"
          @click="connectMetamask"
        >
          Connect to Metamask
        </md-button>
        <md-button
          data-testid="transfers-card-send-button"
          @click="sendUSDC"
        >
          Send
        </md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';

export default {
  components: {
    NavBar,
  },
  data() {
    return {
      to: '',
      amount: '',
      accounts: [],
    };
  },
  methods: {
    async connectMetamask() {
      // eslint-disable-next-line
      this.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    },
    async sendUSDC() {
      // eslint-disable-next-line
      const txHash = await ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: this.accounts[0],
              to: this.to,
              value: this.amount,
              gasPrice: '0x09184e72a000',
              gas: '0x2710',
            },
          ],
        });
    },
  },
};


</script>

<style scoped>
.transferInput {
  color: black;
  width: 25%;
  text-align: center;
  left: 37.5%;
}

.transferCard {
  width: 50%;
  left: 25%;
  padding: 5%;
  background-color: #6cb6ff;
}
.transferCardHeader {
  color: white;
}
</style>
