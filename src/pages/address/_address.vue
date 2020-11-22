<template>
  <div>
    <NavBar />
    <Overview :wallet-address="this.$route.params.address" />
    <Table
      ref="table"
      :loading="loading"
      name=""
      :total-items="transactions.length"
      :schema="this.tableSchema"
      :content="transactions"
      :key-field="'Transaction Hash'"
      @page:change="this.pageChange"
    />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import Overview from '@/components/Overview';
import Table from '@/components/Table';
import { TRANSACTION_SCHEMA, WEB3_GET_LOGS_ADDRESS_LENGTH } from '@/utils/constants';
import { padHex } from '@/utils/utils';
import { getWalletTransactions } from '@/utils/web3utils';

export default {
  components: {
    Overview,
    Table,
    NavBar,
  },
  data() {
    return {
      transactions: [],
      address: null,
      loading: true,
    };
  },
  computed: {
    tableSchema() {
      return TRANSACTION_SCHEMA;
    },
  },
  async mounted() {
    await this.fetchTransactions();
    this.loading = false;
  },
  methods: {
    async fetchTransactions() {
      this.transactions = await getWalletTransactions(padHex(this.$route.params.address, WEB3_GET_LOGS_ADDRESS_LENGTH));
    },
  },
};
</script>
