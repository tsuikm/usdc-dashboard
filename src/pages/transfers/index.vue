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
    <div class="error"> 
      <span v-if="showConnectToMetamaskWarning">
        <md-icon>error</md-icon> Please connect your account to Metamask before proceeding.
      </span>
      <span v-if="showAddressWarning">
        <md-icon>error</md-icon> Error: Please input a valid address.
      </span>
      <span v-if="showAmountWarning">
        <md-icon>error</md-icon> Error: Please input a valid amount.
      </span>
    </div>
    <div class="connect-metamask">
      <ConnectToMetamask ref="connectToMetamaskButton" />
    </div>
  </div>
</template>

<script>
import Form from '@/components/Form';
import ConnectToMetamask from '@/components/ConnectToMetamask';
import { contract, ethReq, web3 } from '@/utils/web3utils';
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import { toHex, padHex } from '@/utils/utils';

export default {
  components: {
    Form,
    ConnectToMetamask,
  },
  data() {
    return {
      showAddressWarning: false,
      showAmountWarning: false,
      showConnectToMetamaskWarning: false,
      address: '',
      accounts: [],
    };
  },
  methods: {
    async submit(toAddress, amount) {
      this.showConnectToMetamaskWarning = !this.$refs.connectToMetamaskButton.selectedAddress;
      if (this.showConnectToMetamaskWarning) {
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
      this.transfer(this.address, amount);
    },
    async transfer(address, amount) {
      const decimals = await contract.methods.decimals().call(); 
      const transferData = contract.methods.transfer(address, toHex(Number(amount) * (10 ** decimals))).encodeABI();
      ethReq(this.$refs.connectToMetamaskButton.selectedAddress, transferData);
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
}

.button {
  width: 20%;
}

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2%;
}

</style>
