<template>
  <div>
    <NavBar />
    <Summary
      :roles="this.roles"
      :blocks="this.blocks"
      :transactions="this.transactions"
      :lookback="ALGORAND_TXNS_LOOKBACK"
      :limit="RECENT_COUNT"
      :loading="loading"
    />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import Summary from '@/components/Summary';
import {
  ALGORAND_USDC_ASSET_ID,
  RECENT_COUNT,
  ALGORAND_TXNS_LOOKBACK,
} from '@/utils/constants';
import { fetchAlgorand, getCurrentRound } from '@/utils/algo-utils';

export default {
  components: {
    NavBar,
    Summary,
  },
  data() {
    return {
      roles: [
        {
          name: 'Creator',
          addresses: [],
          icon: 'owner-icon.svg',
        },
        {
          name: 'Freeze',
          addresses: [],
          icon: 'pauser-icon.svg',
        },
        {
          name: 'Reserve',
          addresses: [],
          icon: 'minter-icon.svg',
        },
        {
          name: 'Clawback',
          addresses: [],
          icon: 'blacklister-icon.svg',
        },
        {
          name: 'Manager',
          addresses: [],
          icon: 'logo.svg', // TODO: we need an icon for the manager role.
        },
      ],
      blocks: [],
      transactions: [],
      loading: true,
      ALGORAND_TXNS_LOOKBACK,
      RECENT_COUNT,
    };
  },
  async created() {
    await Promise.all([this.lookupRoles(), this.lookupBlocks(), this.lookupTransactions()]);
    this.loading = false;
  },
  methods: {
    setAddresses(roleName, addresses) {
      const role = this.roles.find(role => role.name === roleName);

      for (const address of addresses) {
        role.addresses.push(address);
      }
    },
    async lookupRoles() {
      const roles = await fetchAlgorand({
        api: 'indexer',
        request: 'assets',
        param: ALGORAND_USDC_ASSET_ID
      });
      this.setAddresses('Creator', [roles.asset.params.creator]);
      this.setAddresses('Freeze', [roles.asset.params.freeze]);
      this.setAddresses('Reserve', [roles.asset.params.reserve]);
      this.setAddresses('Clawback', [roles.asset.params.clawback]);
      this.setAddresses('Manager', [roles.asset.params.manager]);
    },
    async lookupBlocks() {
      const currentBlock = await getCurrentRound();
      for (let i = 0; i < RECENT_COUNT; i++) {
        this.blocks.push(currentBlock - i);
      }
    },
    async lookupTransactions() {
      const currentBlock = await getCurrentRound();
      const transactions = await fetchAlgorand({
        api: 'indexer',
        request: 'transactions',
        'min-round': currentBlock - ALGORAND_TXNS_LOOKBACK
      });

      const length = transactions.transactions.length;
      this.transactions = transactions.transactions
        .slice(length - RECENT_COUNT, length)
        .reverse()
        .map(transaction => transaction.id);
    },
  },
};
</script>
