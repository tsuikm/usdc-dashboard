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
import { contract, web3 } from '@/utils/web3utils';
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE, WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
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
      address: '',
      accounts: [],
    };
  },
  methods: {
    async submit(toAddress, amount) {
      this.showAddressWarning = false;
      this.showAmountWarning = false;
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
      try {
        // eslint-disable-next-line
        const txHash = await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.$refs.connectToMetamaskButton.accounts[0],
                to: USDC_CONTRACT_ADDRESS,
                data: contract.methods.transfer(address, toHex(Number(amount) * 1000000)).encodeABI(),
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
