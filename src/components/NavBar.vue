<template>
  <div
    id="navbar"
  >
    <img src="@/assets/logo.svg">
    <div
      id="menu-items"
      :class="menuOpen ? 'open' : ''"
    >
      <nuxt-link
        to="/accounts"
        class="link"
      >
        Accounts
      </nuxt-link>
      <nuxt-link
        to="/transfers"
        class="link"
      >
        Transfer
      </nuxt-link>
      <input
        v-model="address"
        placeholder="Wallet Address or Txn Hash"
        class="search"
        @keydown.enter.prevent="searchAddress"
      >
    </div>
    <i
      v-if="menuOpen"
      id="hamburger"
      class="md-icon md-icon-font md-theme-default"
      @click="toggleMenu"
    >
      close
    </i>
    <i
      v-else
      id="hamburger"
      class="md-icon md-icon-font md-theme-default"
      @click="toggleMenu"
    >
      menu
    </i>
  </div>
</template>

<script>
import { WEB3_BALANCEOF_ADDRESS_LENGTH, WEB3_PROVIDER } from '@/utils/constants';
import Web3 from 'web3';
import { padHex } from '@/utils/utils';

const web3 = new Web3(WEB3_PROVIDER || Web3.givenProvider);

console.log(WEB3_PROVIDER);
export default {
  name: 'NavBar',
  data() {
    return {
      address: '',
      menuOpen: false,
    };
  },
  methods: {
    searchAddress() {
      this.address = padHex(this.address.trim(), WEB3_BALANCEOF_ADDRESS_LENGTH);

      if (web3.utils.isAddress(this.address)) {
        this.$router && this.$router.push({path: `/address/${this.address}` });
      }
      else {
        this.$router && this.$router.push({path: '/404' });
      }
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
  },
};
</script>
