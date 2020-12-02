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
      ACCOUNTS_SCHEMA: constants.ACCOUNTS_SCHEMA
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
      const accounts = await fetchAlgorand({
        api: 'indexer',
        request: 'accounts',
        limit: constants.ALGORAND_ACCOUNTS_QUERY_LIMIT,
        'asset-id': constants.ALGORAND_USDC_ASSET_ID,
      });
      console.log('herehr', accounts)
      //FIXME
      //decimals
      accounts.sort((a, b) => b.balance - a.balance);
      return accounts;
    },
  },
};
</script>
