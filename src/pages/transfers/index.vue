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
import Web3 from 'web3';
import { USDC_CONTRACT_ADDRESS } from '@/utils/constants';
const web3 = new Web3(Web3.givenProvider);
const abi = [
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'to',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': 'value',
        'type': 'uint256',
      },
    ],
    'name': 'transfer',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool',
      },
    ],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },

];
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);
// contractData = contract.transfer.getData(this.to, this.from);
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
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.accounts[0],
                to: this.to,
                amount: this.amount,
                data: contract.methods.transfer(this.to, this.amount).encodeABI(),
                gasPrice: '0x09184e72a000',
                gas: '0x2710',
              },
            ],
          });
      } catch (e) {
        console.log(e);
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
