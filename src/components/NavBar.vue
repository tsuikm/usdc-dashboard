<template>
  <div id="navbar">
    <img src="@/assets/logo.svg">
    <nuxt-link
      to="/accounts"
      class="link"
    >
      Accounts
    </nuxt-link>
    <nuxt-link
      to="/accounts"
      class="link"
    >
      Transfer
    </nuxt-link>
    <input
      v-model="walletAddress"
      placeholder="Wallet Address or Txn Hash"
      class="search"
    >
  </div>
</template>

<script>
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import Web3 from 'web3';
import { padHex } from '@/utils/utils';

const web3 = new Web3(Web3.givenProvider);

export default {
  name: 'NavBar',
  data() {
    return {
      walletAddress: '',
    };
  },
  methods: {
    submitAddress() {
      this.walletAddress = padHex(this.walletAddress.trim(), WEB3_BALANCEOF_ADDRESS_LENGTH);

      if (web3.utils.isAddress(this.walletAddress)) {
        window.location.href = `/address/${this.walletAddress}`;
      }
      else {
        window.location.href = '/404';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#navbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  img {
    margin-right: auto;
  }

  .link {
    margin-right: 2rem;
  }
}
</style>
