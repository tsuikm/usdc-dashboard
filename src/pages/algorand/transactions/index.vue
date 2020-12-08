<template>
  <div>
    <NavBar />
    <Table
      ref="table"
      :loading="loading"
      name=""
      :total-items="transactions.length"
      :schema="ALGORAND_TRANSACTION_SCHEMA"
      :content="this.transactions"
      :key-field="'Transaction ID'"
    />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import Table from '@/components/Table';
import { fetchAlgorand, getCurrentRound } from '@/utils/algo-utils';
import {
  ALGORAND_USDC_ASSET_ID,
  ALGORAND_TRANSACTION_SCHEMA,
  ALGORAND_TXNS_QUERY_LIMIT,
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
      this.transactions = (await fetchAlgorand({
        request: 'transactions',
        'asset-id': ALGORAND_USDC_ASSET_ID,
        'min-round': 0,
        'limit': ALGORAND_TXNS_QUERY_LIMIT,
        'max-round': await getCurrentRound(),
      })).transactions.reverse();
    },
  },
};
</script>
