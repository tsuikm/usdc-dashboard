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
        :to="accountsLink"
        class="link"
      >
        Accounts
      </nuxt-link>
      <nuxt-link
        :to="transfersLink"
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
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import { padHex, basePathFromPath } from '@/utils/utils';

export default {
  name: 'NavBar',
  data() {
    return {
      address: '',
      menuOpen: false,
    };
  },
  computed: {
    basePath() {
      if (this.$route) {
        return basePathFromPath(this.$route.path);
      }
      
      return '';
    },
    accountsLink() {
      return `${this.basePath}/accounts`;
    },
    transfersLink() {
      return `${this.basePath}/transfers`;
    },
  },
  methods: {
    searchAddress() {
      this.address = padHex(this.address.trim(), WEB3_BALANCEOF_ADDRESS_LENGTH);

      if (this.$router) {
        this.$router.push({path: `${this.basePath}/address/${this.address}` });
      }
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
  },
};
</script>
