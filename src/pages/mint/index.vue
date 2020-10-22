<template>
  <div>
    <md-card class="card">
      <md-card-header class="header">
        <div class="md-title">Mint USDC</div>
      </md-card-header>

      <label>Wallet address:</label>
      <md-field class="field">
        <md-input class="input" v-model="walletAddress"></md-input>
      </md-field>

      <label>To address:</label>
      <md-field class="field">
        <md-input class="input" v-model="toAddress"></md-input>
      </md-field>


      <label>Amount:</label>
      <md-field class="field">
        <md-input class="input" v-model="amount"></md-input>
      </md-field>
      <md-card-actions>
        <md-button>Send</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>

// modules
import NavBar from '@/components/NavBar';
import { USDC_CONTRACT_ADDRESS, WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import { padHex } from '@/utils/utils'
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider);
const abi = [
  {
    constant: true,
    inputs: [{ name: 'account', type: 'address' }],
    name: 'isMinter',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    inputs: [{ name:'_to', type: 'address'}, {name:'_amount', type:'uint256'}],
    name: 'mint',
    outputs: [{ name:'', type: 'bool' }],
    stateMutability: 'nonpayable',
    type:'function',
  }
];
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  components: {
    NavBar
  },
  data() {
    return {
        walletAddress: '',
        toAddress: '',
        amount: 0
    };
  },

  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Proxima+Nova&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap'
        }
      ]
    }
  },

  async created() {
  },
  methods: {
    async mint() {
      if (! await contract.methods.isMinter(padHex(this.walletAddress, WEB3_BALANCEOF_ADDRESS_LENGTH)).call()) {
        //not allowed to mint
        console.log("not allowed");
        return;
      } else {
        console.log(await contract.methods.mint(this.toAddress, this.amount).call());
      }
    }
  }
};
</script>

<style scoped>
.input {
  width: 25%;
  left: 37.5%;
  box-sizing: border-box;
  border-radius: 5px;
  display: block;
  text-align: left;
  margin-bottom: 14px;
  font-family: Roboto Mono;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.03em;
  color: #717171;
}

.card {
  width: 50%;
  left: 25%;
  padding: 5%;
  background-color: #FFF;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
}

label {
  font-family: Proxima Nova;
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  line-height: 13px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #3D3652;
  display: block;
}

.header {
  color: white;
}

.field {
  border: 1px solid #DBDCDC;
  box-sizing: border-box;
  border-radius: 5px;
}
</style>
