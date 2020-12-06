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
      <span v-if="showMinterWarning">
          <md-icon>error</md-icon> Error: You are not signed in as a minter of this contract and cannot mint tokens.
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
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE, WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import { toHex, padHex } from '@/utils/utils';
import { web3, contract } from '@/utils/web3utils';

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
      address: '',
      accounts: [],
    };
  },
  methods: {
    async submit(toAddress, amount) {
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

      this.address = padHex(toAddress.trim(), WEB3_BALANCEOF_ADDRESS_LENGTH);

      if (!web3.utils.isAddress(this.address)) {
        // Not a valid Ethereum address
        this.showAddressWarning = true;
        return;
      }
      if (isNaN(amount)) {
        // Not a valid Ethereum address
        this.showAmountWarning = true;
        return;
      }

      try {
        await ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: minterAccount,
              to: USDC_CONTRACT_ADDRESS,
              data: contract.methods.mint(this.address, toHex(Number(amount) * 1000000)).encodeABI(),
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

<style scoped>
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2%;
}

</style>
