<template>
  <div>
    <NavBar />
    <Form
      :title="'Mint USDC'"
      :schema=" [
        {
          label: 'To Address',
        },
        {
          label: 'Amount',
          defaultValue: 0
        }
      ]"
      @submit="this.submit"
    />
  </div>
</template>

<script>

// modules
import Form from '@/components/Form';
import NavBar from '@/components/NavBar';
import { USDC_CONTRACT_ADDRESS, WEB3_BALANCEOF_ADDRESS_LENGTH, DEFAULT_GAS_PRICE, WEB3_PROVIDER } from '@/utils/constants';
import { padHex, toHex } from '@/utils/utils';
import Web3 from 'web3';

const web3 = new Web3(WEB3_PROVIDER || Web3.givenProvider);
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
  },
];
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  components: {
    NavBar,
    Form,
  },
  data() {
    return {
      accounts: [],
    };
  },
  async mounted() {
    // eslint-disable-next-line
    this.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  },
  methods: {
    async submit(toAddress, amount) {
      if (!await contract.methods.isMinter(this.accounts[0]).call()) {
        // not allowed to mint
        console.error(`Wallet ${this.accounts[0]} is not allowed to mint`);
        return;
      }
      
      try {
        // eslint-disable-next-line
          const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.accounts[0],
                to: USDC_CONTRACT_ADDRESS,
                data: contract.methods.mint(toAddress, toHex(Number(amount) * 1000000)).encodeABI(),
                gasPrice: DEFAULT_GAS_PRICE,
              },
            ],
          });
      } catch (e) {
        console.error(e);
        // show error
      }
    },
  },
};
</script>
