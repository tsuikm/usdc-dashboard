<template>
  <div>
    <NavBar />
    <Form
      :title="'Mint USDC'"
      :schema=" [
        {
          label: 'To Address',
          placeholder: 'Enter Wallet Address Here'
        },
        {
          label: 'Amount',
          placeholder: 'Amount: i.e. 0'
        }
      ]"
      @submit="this.submit"
    />
    <ConnectToMetamask />
  </div>
</template>

<script>

// modules
import Form from '@/components/Form';
import NavBar from '@/components/NavBar';
import ConnectToMetamask from '@/components/ConnectToMetamask';
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE } from '@/utils/constants';
import { toHex } from '@/utils/utils';
import { contract } from '@/utils/web3utils';

export default {
  components: {
    NavBar,
    Form,
    ConnectToMetamask,
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
