<template>
  <div>
    <NavBar />
    <Form
      :title="'Transfer USDC'"
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
import Web3 from 'web3';
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE } from '@/utils/constants';
import { toHex } from '@/utils/utils';
import { abi } from '@/utils/web3abi';

const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

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
}

.button {
  width: 20%;
}

</style>
