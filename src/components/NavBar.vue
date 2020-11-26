<template>
  <div
    id="navbar"
  >
    <img src="@/assets/logo.svg">
    <div
      id="menu-items"
      :class="menuOpen ? 'open' : ''"
    >
      <div class="nav-item">
        <span class="nav-item-text">
          Explore
        </span>
        <div class="dropdown">
          <div class="dropdown-section blue">
            <span class="dropdown-section-header">Blockchains</span>
            <nuxt-link
              to="/"
              class="nav-link"
            >
              Ethereum
            </nuxt-link>
            <nuxt-link
              to="/solana"
              class="nav-link"
            >
              Solana
            </nuxt-link>
            <nuxt-link
              to="/algorand"
              class="nav-link"
            >
              Algorand
            </nuxt-link>
          </div>
          <div class="dropdown-section">
            <span class="dropdown-section-header">Objects</span>
            <nuxt-link
              to="/transactions"
              class="nav-link"
            >
              Transactions
            </nuxt-link>
            <nuxt-link
              to="/accounts"
              class="nav-link"
            >
              Accounts
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <span class="nav-item-text">
          Transfer
        </span>
      </div>
      <input
        v-model="address"
        placeholder="Search Address..."
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
