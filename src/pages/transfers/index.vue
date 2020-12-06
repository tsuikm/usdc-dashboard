<template>
  <div>
    <Form
      :title="'Transfer USDC'"
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
    <div class="connect-metamask">
      <ConnectToMetamask ref="connectToMetamaskButton" />
    </div>
  </div>
</template>

<script>
import Form from '@/components/Form';
import ConnectToMetamask from '@/components/ConnectToMetamask';
import { contract } from '@/utils/web3utils';
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE } from '@/utils/constants';
import { toHex } from '@/utils/utils';

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
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.$refs.connectToMetamaskButton.accounts[0],
                to: USDC_CONTRACT_ADDRESS,
                data: contract.methods.transfer(toAddress, toHex(Number(amount) * 1000000)).encodeABI(),
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
  head() {
    return {
      title: 'Transfer',
    };
  },
};
</script>

<style scoped>
.connect-metamask {
  margin-left:auto;
  margin-right:auto;
  text-align:center;
  margin-top: 2%;
}

.button {
  width: 20%;
}

</style>
