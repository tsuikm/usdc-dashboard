<template>
  <div>
    <NavBar />
    <h1>USDC Transactions</h1>
    <Table
      ref="table"
      :loading="loading"
      name=""
      :total-items="transactions.length"
      :schema="this.tableSchema"
      :content="this.transactions"
      :key-field="'Transaction Hash'"
      @page:change="this.pageChange"
    />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import Table from '@/components/Table';
import { TRANSACTION_SCHEMA } from '@/utils/constants';
import { fetchAge, getAllTransactions } from '@/utils/web3utils';

export default {
  components: {
    Table,
    NavBar,
  },
  data() {
    return {
      transactions: [],
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
    await this.fetchAges(0);
    this.loading = false;
  },
  methods: {
    async fetchTransactions() {
      this.transactions = await getAllTransactions();
    },
    async fetchAges(page) {
      const pageLength = this.$refs.table.pageLength;
      const upperBound = Math.min((page + 1) * pageLength, this.transactions.length);
      const promises = [];

      for (let i = page * pageLength; i < upperBound; i++) {
        promises.push(fetchAge(this.transactions[i]));
      }

      const ages = await Promise.all(promises);

      for (let i = page * pageLength; i < upperBound; i++) {
        this.transactions[i].age = ages[i - page * pageLength];
      }
    },
    async pageChange(page) {
      this.loading = true;
      await this.fetchAges(page);
      this.loading = false;
    },
  },
  head() {
    return {
      title: 'Transactions',
    };
  },
};
</script>
