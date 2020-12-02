<template>
  <div>
    <NavBar />

    <!-- TODO: this is not how the `key-field` prop is supposed to be used. This was copied from ethereum pages. -->
    <!-- TODO: it seems like every usage of table uses :total-items="[].length". if the array is already passed-in, is this prop needed? -->
    <!-- TODO: why is the `name` prop empty? This was copied from ethereum pages. -->

    <Table
      ref="table"
      :loading="loading"
      name=""
      :total-items="transactions.length"
      :schema="ALGORAND_TRANSACTION_SCHEMA"
      :content="this.transactions"
      :key-field="'Transaction ID'"
      @page:change="this.pageChange"
    />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import Table from '@/components/Table';
import { fetchAge, fetchAlgorand, fetchAlgorandAPI, getCurrentRound } from '@/utils/algo-utils';
import { pushAll } from '@/utils/utils';
import {
  ALGORAND_USDC_ASSET_ID,
  ALGORAND_TRANSACTION_SCHEMA,
} from '@/utils/constants';

export default {
  components: {
    Table,
    NavBar,
  },
  data() {
    return {
      transactions: [],
      loading: true,
      ALGORAND_TRANSACTION_SCHEMA,
    };
  },
  async mounted() {
    await this.fetchTransactions();

    this.loading = false;
  },
  methods: {
    async fetchTransactions() {
      this.transactions = (await fetchAlgorandAPI({
        api: 'indexer',
        request: 'transactions',
        'asset-id': ALGORAND_USDC_ASSET_ID,
        'min-round': 0,
        'limit': 100000000000, // TODO: we need to override the default of 1000.
        'max-round': await getCurrentRound(),
      })).reverse();
    }
  },
};
</script>
