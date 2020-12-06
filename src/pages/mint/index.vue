<template>
  <div>
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
    <ConnectToMetamask ref="connectToMetamaskButton" />
  </div>
</template>

<script>

// modules
import Form from '@/components/Form';
import ConnectToMetamask from '@/components/ConnectToMetamask';
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE } from '@/utils/constants';
import { toHex } from '@/utils/utils';
import { contract } from '@/utils/web3utils';

export default {
  components: {
    Form,
    ConnectToMetamask,
  },
  data() {
    return {
      accounts: [],
    };
  },
  methods: {
    async submit(toAddress, amount) {
      this.accounts = this.$refs.connectToMetamaskButton.accounts.map(string => string.toLowerCase());

      if (!await contract.methods.isMinter(this.accounts[0]).call()) {
        // not allowed to mint
        console.error(`Wallet ${this.accounts[0]} is not allowed to mint`);
        return;
      }
      
      try {
        await ethereum.request({
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
  head() {
    return {
      title: 'Mint',
    };
  },
};
</script>
