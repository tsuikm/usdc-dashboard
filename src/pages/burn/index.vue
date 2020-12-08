<template>
  <div>
    <Form
      :title="'Burn USDC'"
      :schema=" [
        {
          label: 'Amount',
          placeholder: 'Amount: i.e. 0'
        }
      ]"
      @submit="this.submit"
    />
    <div class="error"> 
      <span v-if="showMinterWarning">
        <md-icon>error</md-icon> Error: You are not signed in as a minter of this contract and cannot burn USDC.
      </span>
      <span v-if="showAmountWarning">
        <md-icon>error</md-icon> Error: Please input a valid amount.
      </span>
    </div>
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
      showMinterWarning: false,
      showAmountWarning: false,
      accounts: [],
    };
  },
  methods: {
    async submit(amount) {

      this.accounts = this.$refs.connectToMetamaskButton.accounts.map(string => string.toLowerCase());

      let minterAccount = null;
      for (let account of this.accounts) {
        if (await contract.methods.isMinter(account).call()) {
          minterAccount = account;
          break;
        }
      }

      if (minterAccount === null) {
        this.showMinterWarning = true;
        return;
      }

      if (isNaN(amount)) {
        // Not a valid amount
        this.showAmountWarning = true;
        return;
      }

      try {
        // eslint-disable-next-line
          const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: minterAccount,
                to: USDC_CONTRACT_ADDRESS,
                data: contract.methods.burn(toHex(Number(amount) * 1000000)).encodeABI(),
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
      title: 'Burn',
    };
  },
};
</script>

<style scoped>
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2%;
}

</style>
