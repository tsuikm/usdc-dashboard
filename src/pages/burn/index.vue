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
      <span v-if="connectedToMetamask === false">
        <md-icon>error</md-icon>Please connect your account to Metamask before proceeding.
      </span>
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
import { toHex } from '@/utils/utils';
import { contract, ethReq } from '@/utils/web3utils';

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
      connectedToMetamask: null,
    };
  },
  methods: {
    async submit(amount) {
      this.connectedToMetamask = !!(this.$refs.connectToMetamaskButton && this.$refs.connectToMetamaskButton.selectedAddress);
      if (!this.connectedToMetamask) {
        return;
      }

      if (!(await contract.methods.isMinter(this.$refs.connectToMetamaskButton.selectedAddress).call())) {
        this.showMinterWarning = true;
        return;
      }

      if (isNaN(amount)) {
        // Not a valid amount
        this.showAmountWarning = true;
        return;
      }

      await ethReq(this.$refs.connectToMetamaskButton.selectedAddress, 'eth_sendTransaction', contract.methods.burn(toHex(Number(amount) * 1000000)).encodeABI());
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
