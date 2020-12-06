<template>
  <div>
    <NavBar />
    <Table
      :name="'Accounts'"
      :loading="loading"
      :schema="ACCOUNTS_SCHEMA"
      :content="this.accounts"
      :key-field="'address'"
    />
  </div>
</template>

<script>

// modules
import NavBar from '@/components/NavBar';
import Table from '@/components/Table';
import * as constants from '@/utils/constants';
import { fetchAlgorand }from '@/utils/algo-utils';

export default {
  components: {
    Table,
    NavBar,
  },
  data() {
    return {
      accounts: [],
      loading: true,
      ACCOUNTS_SCHEMA: constants.ACCOUNTS_SCHEMA,
    };
  },
  async created() {
    this.accounts = await this.getAccounts();
    this.loading = false;
  },
  methods: {

    /**
     * Gets all accounts (addresses) and their balances/percentages.
     *
     * @return {Object[]}
     */
    async getAccounts() {
      const assets = await fetchAlgorand({
        request: 'assets',
        param: constants.ALGORAND_USDC_ASSET_ID,
      });
      const decimals = assets.asset.params.decimals;
      const totalSupply = assets.asset.params.total / (10 ** decimals);

      const accounts = await fetchAlgorand({
        request: 'accounts',
        limit: constants.ALGORAND_ACCOUNTS_QUERY_LIMIT,
        'asset-id': constants.ALGORAND_USDC_ASSET_ID,
      });

      const sortedAccounts = accounts.accounts.sort((a, b) => b.amount - a.amount);

      for (const account of sortedAccounts) {
        account.balance = account.amount / (10 ** decimals);
        account.percentage = account.balance / totalSupply * 100;
      }

      return sortedAccounts;
    },
  },
};
</script>
