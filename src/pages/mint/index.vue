<template>
  <div>
    <NavBar />
    <form @submit.prevent="mint">
        <input placeholder='Wallet address:' v-model="walletAddress" />
        <input placeholder='To address:' v-model="toAddress" />
        <input placeholder='amount:' v-model="amount" />
        <button>Submit mint event</button>
    </form>
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
