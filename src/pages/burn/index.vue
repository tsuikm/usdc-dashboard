<template>
  <Form
    :title="'Burn USDC'"
    :schema=" [
      {
        label: 'Wallet Address:',
      },
      {
        label: 'Amount:',
        defaultValue: 0
      }
    ]"
    @submit="this.submit"
  />
</template>

<script>

// modules
import Form from '@/components/Form';
import NavBar from '@/components/NavBar';
import { USDC_CONTRACT_ADDRESS, WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import { padHex } from '@/utils/utils';
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
    Form,
  },

  methods: {
    async submit(walletAddress, amount) {
      console.log(walletAddress, amount);
    },
  },
};
</script>
