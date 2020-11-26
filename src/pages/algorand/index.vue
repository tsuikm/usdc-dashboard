<template>
  <div>
    <NavBar />
    <Summary
      :roles="this.roles"
      :blocks="this.blocks"
      :transactions="this.transactions"
      :lookback="10"
      :limit="10"
      :loading="loading"
    />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import Summary from '@/components/Summary';
import { ALGORAND_BASE_SERVER, ALGORAND_USDC_ASSET_ID, PURESTAKE_API_KEY } from '@/utils/constants';

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
    async fetchAlgorand(url) {
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
      const roles = await this.fetchAlgorand(`${ALGORAND_BASE_SERVER}/assets/${ALGORAND_USDC_ASSET_ID}`);

      this.setAddresses('Creator', [roles.asset.params.creator]);
      this.setAddresses('Freeze', [roles.asset.params.freeze]);
      this.setAddresses('Reserve', [roles.asset.params.reserve]);
      this.setAddresses('Clawback', [roles.asset.params.clawback]);
      this.setAddresses('Manager', [roles.asset.params.manager]);
    },
    async lookupBlocks() {
    },
    async lookupTransactions() {
      const transactions = await this.fetchAlgorand(`${ALGORAND_BASE_SERVER}/assets/${ALGORAND_USDC_ASSET_ID}/transactions?limit=${10}`);
      console.log(transactions.transactions)
      this.transactions = transactions.transactions.map(transaction => transaction.id);      
    },
  },
};
</script>




