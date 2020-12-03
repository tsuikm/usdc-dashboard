<template>
  <div>
    <NavBar />
    <Summary
      :roles="this.roles"
      :blocks="this.blocks"
      :transactions="this.transactions"
      :lookback="RECENT_TXNS_LOOKBACK"
      :limit="RECENT_COUNT"
      :loading="loading"
    />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import Summary from '@/components/Summary';
import { API_BASE_URL } from '@/utils/constants';
import { toHex } from '@/utils/utils';
import { web3, contract, getTransactions } from '@/utils/web3utils';

// Number of blocks to lookback when searching for the 20 latest transactions
const RECENT_TXNS_LOOKBACK = 10;

// Number of recent txns/blocks to display
const RECENT_COUNT = 20;

export default {
  name: 'SummaryPage',
  head() {
    return {
      title: "USDC Dashboard"
    };
  },
  components: {
    NavBar,
    Summary,
  },
  data() {
    return {
      roles: [
        {
          name: 'Owner',
          addresses: [],
          icon: 'owner-icon.svg',
        },
        {
          name: 'Pauser',
          addresses: [],
          icon: 'pauser-icon.svg',
        },
        {
          name: 'Minters',
          addresses: [],
          icon: 'minter-icon.svg',
        },
        {
          name: 'Blacklister',
          addresses: [],
          icon: 'blacklister-icon.svg',
        },
      ],
      blocks: [],
      transactions: [],
      loading: true,
      RECENT_TXNS_LOOKBACK,
      RECENT_COUNT,
    };
  },
  async created() {
    await Promise.all([this.lookupRoles(), this.lookupBlocks(), this.lookupTransactions()]);
    this.loading = false;
  },
  methods: {
    async fetch(request) {
      const response = await fetch(request);
      return await response.json();
    },
    setAddresses(roleName, addresses) {
      const role = this.roles.find(role => role.name === roleName);

      for (const address of addresses) {
        role.addresses.push(address);
      }
    },
    async lookupRoles() {
      this.setAddresses('Owner', [await contract.methods.owner().call()]);
      this.setAddresses('Pauser', [await contract.methods.pauser().call()]);
      this.setAddresses('Minters', await this.fetch(`${API_BASE_URL}/api/minters`));
      this.setAddresses('Blacklister', [await contract.methods.blacklister().call()]);
    },
    async lookupBlocks() {
      const currentBlock = await web3.eth.getBlockNumber();
      for (let i = 0; i < RECENT_COUNT; i++) {
        this.blocks.push(currentBlock - i);
      }
    },
    async lookupTransactions() {
      const currentBlock = await web3.eth.getBlockNumber();

      // Gets recent txns in latest 10 blocks, gets the 20 latest txns, and maps to the hash
      this.transactions = (await getTransactions(toHex(currentBlock - RECENT_TXNS_LOOKBACK))).slice(0, RECENT_COUNT).map(transaction => transaction.transactionHash);
    },
  },
};
</script>
