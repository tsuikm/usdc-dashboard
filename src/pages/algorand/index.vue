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
import { ALGORAND_BASE_SERVER, ALGORAND_USDC_ASSET_ID, PURESTAKE_API_KEY, API_BASE_URL, RECENT_COUNT } from '@/utils/constants';

// Number of blocks to lookback when searching for the 20 latest transactions
const RECENT_TXNS_LOOKBACK = 10000;

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
      RECENT_TXNS_LOOKBACK,
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

    /**
     * TODO: move this to utils.
     * @param {String}
     */
    async fetchAlgorand(url, query) {
      const request = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'x-api-key': PURESTAKE_API_KEY,
        },
      });
      const reader = await request.body.getReader();
      const value = (await reader.read()).value;
      const decoder = new TextDecoder('utf8');

      return JSON.parse(decoder.decode(value));
    },

    async lookupRoles() {
      const roles = await this.fetchAlgorand(`${ALGORAND_BASE_SERVER}/idx2/v2/assets/${ALGORAND_USDC_ASSET_ID}`);

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
      const transactions = await this.fetchAlgorand(`${ALGORAND_BASE_SERVER}/idx2/v2/assets/${ALGORAND_USDC_ASSET_ID}/transactions?min-round=${currentBlock - RECENT_TXNS_LOOKBACK}`);

      const length = transactions.transactions.length;
      this.transactions = transactions.transactions
                                      .slice(length - RECENT_COUNT, length)
                                      .reverse()
                                      .map(transaction => transaction.id);
    },
    async getCurrentRound() {
      const response = await this.fetchAlgorand(`${ALGORAND_BASE_SERVER}/ps2/v2/ledger/supply`);
      console.log(response)
      return response.current_round;
    }
  },
};
</script>




