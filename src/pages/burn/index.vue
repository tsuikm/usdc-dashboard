<template>
  <div>
    <NavBar />
    <div>
      <form @submit.prevent="burn">
        <input
          v-model="walletAddress"
          placeholder="Wallet address:"
        >
        <input
          v-model="amount"
          placeholder="amount:"
        >
        <button>Submit burn event</button>
      </form>
    </div>
  </div>
</template>

<script>

// modules
import NavBar from '@/components/NavBar';
import { USDC_CONTRACT_ADDRESS } from '@/utils/constants';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider);
const abi = [
  {
    inputs: [{ name:'_amount', type :'uint256' }],
    name: 'burn',
    outputs:[],
    stateMutability:'nonpayable',
    type:'function',
  },
];
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  components: {
    NavBar,
  },
  data() {
    return {
      walletAddress: '',
      amount: 0,
    };
  },
  async created() {
  },
  methods: {
    burn() {
      console.log('burn');
    },
  },
};
</script>
