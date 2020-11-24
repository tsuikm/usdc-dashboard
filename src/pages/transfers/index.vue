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
      >
        <label>To</label>
        <md-input
          v-model="to"
          data-testid="transfers-card-to-input"
        />
      </md-field>
      <md-field
        class="transferInput"
      >
        <label>Transfer Amount</label>
        <md-input
          v-model="amount"
          data-testid="transfers-card-amount-input"
        />
      </md-field>
      <md-card-actions>
        <ConnectToMetamask />
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
import ConnectToMetamask from '@/components/ConnectToMetamask';
import { contract } from '@/utils/web3utils';
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE } from '@/utils/constants';
import { toHex } from '@/utils/utils';

export default {
  components: {
    NavBar,
    ConnectToMetamask,
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
      try {
        // eslint-disable-next-line
        this.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (e) {
        console.log(e);
      }
    },
    async sendUSDC() {
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.accounts[0],
                to: USDC_CONTRACT_ADDRESS,
                data: contract.methods.transfer(this.to, toHex(Number(this.amount) * 1000000)).encodeABI(),
                gasPrice: DEFAULT_GAS_PRICE,
              },
            ],
          });
      } catch (e) {
        console.log(e);
        //show error
      }
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
