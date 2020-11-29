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
  API_BASE_URL,
  RECENT_COUNT,
  ALGORAND_TXNS_LOOKBACK 
} from '@/utils/constants';
import { fetchAlgorand } from '@/utils/utils';

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
          icon: 'logo.svg',
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
    await this.lookupRoles();
    await this.lookupBlocks()
    await this.lookupTransactions();
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
      const roles = await fetchAlgorand(`/idx2/v2/assets/${ALGORAND_USDC_ASSET_ID}`);

      this.setAddresses('Creator', [roles.asset.params.creator]);
      this.setAddresses('Freeze', [roles.asset.params.freeze]);
      this.setAddresses('Reserve', [roles.asset.params.reserve]);
      this.setAddresses('Clawback', [roles.asset.params.clawback]);
      this.setAddresses('Manager', [roles.asset.params.manager]);
    },
    async lookupBlocks() {
      const currentBlock = await this.getCurrentRound();
      for (let i = 0; i < RECENT_COUNT; i++) {
        this.blocks.push(currentBlock - i);
      }
    },
    async lookupTransactions() {
      const currentBlock = await this.getCurrentRound();
      const transactions = await fetchAlgorand(`/idx2/v2/assets/${ALGORAND_USDC_ASSET_ID}/transactions`, {
        'min-round': currentBlock - ALGORAND_TXNS_LOOKBACK
      });

      const length = transactions.transactions.length;
      this.transactions = transactions.transactions
                                      .slice(length - RECENT_COUNT, length)
                                      .reverse()
                                      .map(transaction => transaction.id);
    },
    async getCurrentRound() {
      const response = await fetchAlgorand(`/ps2/v2/ledger/supply`);
      return response.current_round;
    }
  },
};
</script>
