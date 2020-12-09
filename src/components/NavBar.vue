<template>
  <div
    id="navbar"
  >
    <div>
      <nuxt-link 
        to="/"
      >
        <img
          :src="require('@/assets/logo.svg')"
          width="250"
        >
      </nuxt-link>
    </div>

    <div
      id="menu-items"
      :class="menuOpen ? 'open' : ''"
    >
      <div class="nav-item">
        <span class="nav-item-text">
          Explore
        </span>
        <div
          class="dropdown"
          @mouseleave="setChain"
        >
          <div class="dropdown-section blue">
            <span class="dropdown-section-header">Blockchains</span>
            <nuxt-link
              to="/"
              data-testid="ethereum-link"
              :class="linkClass('')"
              @mouseover.native="hover('Ethereum')"
            >
              Ethereum
            </nuxt-link>
            <nuxt-link
              to="/solana"
              data-testid="solana-link"
              :class="linkClass('/solana')"
              @mouseover.native="hover('Solana')"
            >
              Solana
            </nuxt-link>
            <nuxt-link
              to="/algorand"
              data-testid="algorand-link"
              :class="linkClass('/algorand')"
              @mouseover.native="hover('Algorand')"
            >
              Algorand
            </nuxt-link>
          </div>
          <div class="dropdown-section">
            <span class="dropdown-section-header">{{ objectsHeader }}</span>
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
              to="/roles/master-minter"
              class="nav-link"
            >
              Master Minter Controls
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
      chain: '',
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
      switch(this.chain) {
      case 'Algorand':
        return '/algorand/accounts';
      case 'Solana':
        return '/solana/accounts';
      default:
        return '/accounts';
      }
    },
    transactionsLink() {
      switch(this.chain) {
      case 'Algorand':
        return '/algorand/transactions';
      case 'Solana':
        return '/solana/transactions';
      default:
        return '/transactions';
      }
    },
    objectsHeader() {
      switch(this.chain) {
      case '':
        return 'Objects';
      default:
        return this.chain;
      }
    },
  },
  mounted() {
    this.setChain();
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
    hover(chain) {
      this.chain = chain;
    },
    setChain() {
      switch(this.basePath) {
      case '/algorand':
        this.chain = 'Algorand';
        break;
      case '/solana':
        this.chain = 'Solana';
        break;
      default:
        this.chain = 'Ethereum';
      }
    },
  },
};
</script>
