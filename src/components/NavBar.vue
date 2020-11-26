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
              :class="linkClass('')"
            >
              Ethereum
            </nuxt-link>
            <nuxt-link
              to="/solana"
              :class="linkClass('/solana')"
            >
              Solana
            </nuxt-link>
            <nuxt-link
              to="/algorand"
              :class="linkClass('/algorand')"
            >
              Algorand
            </nuxt-link>
          </div>
          <div class="dropdown-section">
            <span class="dropdown-section-header">Objects</span>
            <nuxt-link
              :to="transactionsLink"
              class="nav-link"
            >
              Transactions
            </nuxt-link>
            <nuxt-link
              :to="accountsLink"
              class="nav-link"
            >
              Accounts
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <nuxt-link
          to="/transfers"
          class="nav-item-text"
        >
          Transfer
        </nuxt-link>
      </div>
      <div class="nav-item">
        <span class="nav-item-text">
          Privileged Controls
        </span>
        <div class="dropdown">
          <div class="dropdown-section">
            <span class="dropdown-section-header">Privileged Controls</span>
            <nuxt-link
              to="/roles/owner"
              class="nav-link"
            >
              Owner Controls
            </nuxt-link>
            <nuxt-link
              to="/mint"
              class="nav-link"
            >
              Mint
            </nuxt-link>
            <nuxt-link
              to="/burn"
              class="nav-link"
            >
              Burn
            </nuxt-link>
            <nuxt-link
              to="/roles/pauser"
              class="nav-link"
            >
              Pause &amp; Unpause
            </nuxt-link>
            <nuxt-link
              to="/roles/blacklister"
              class="nav-link"
            >
              Blacklist &amp; Unblacklist
            </nuxt-link>
          </div>
        </div>
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
    transactionsLink() {
      return `${this.basePath}/transactions`;
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
    linkClass(highlightedBasePath) {
      if (this.basePath === highlightedBasePath) {
        return 'nav-link blue';
      }

      return 'nav-link';
    },
  },
};
</script>
