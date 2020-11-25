<template>
  <div>
    <NavBar />
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
      <md-button class="button"
        md-alignment="center"
        data-testid="transfers-card-connect-button"
        @click="connectMetamask"
      >
        Connect to Metamask
      </md-button>
    </div>
  </div>
</template>

<script>
import Form from '@/components/Form';
import NavBar from '@/components/NavBar';
import { contract } from '@/utils/web3utils';
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE } from '@/utils/constants';
import { toHex } from '@/utils/utils';

export default {
  components: {
    Form,
    NavBar,
  },
  data() {
    return {
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
    async submit(toAddress, amount) {
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.accounts[0],
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
