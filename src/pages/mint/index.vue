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
    <div class="error"> 
      <span v-if="connectedToMetamask === false">
        <md-icon>error</md-icon>Please connect your account to Metamask before proceeding.
      </span>
      <span v-if="showMinterWarning">
        <md-icon>error</md-icon> Error: You are not signed in as a minter of this contract and cannot mint USDC.
      </span>
      <span v-if="showAddressWarning">
        <md-icon>error</md-icon> Error: Please input a valid address.
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
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import { toHex, padHex } from '@/utils/utils';
import { web3, contract, ethReq } from '@/utils/web3utils';

export default {
  components: {
    Form,
    ConnectToMetamask,
  },
  data() {
    return {
      showMinterWarning: false,
      showAddressWarning: false,
      showAmountWarning: false,
      connectedToMetamask: null,
      address: '',
      accounts: [],
    };
  },
  methods: {
    async submit(toAddress, amount) {
      this.connectedToMetamask = !!this.$refs.connectToMetamaskButton.selectedAddress;
      if (!this.connectedToMetamask) {
        return;
      }

      if (!(await contract.methods.isMinter(this.$refs.connectToMetamaskButton.selectedAddress).call())) {
        this.showMinterWarning = true;
        return;
      }

      this.address = padHex(toAddress.trim(), WEB3_BALANCEOF_ADDRESS_LENGTH);

      if (!web3.utils.isAddress(this.address)) {
        // Not a valid Ethereum address
        this.showAddressWarning = true;
        return;
      }
      if (isNaN(amount)) {
        // Not a valid amount
        this.showAmountWarning = true;
        return;
      }
      const mintData = contract.methods.mint(this.address, toHex(Number(amount) * 1000000)).encodeABI();
      await ethReq(this.$refs.connectToMetamaskButton.selectedAddress, mintData);
    },
  },
  head() {
    return {
      title: 'Mint',
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
