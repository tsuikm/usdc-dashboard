<template>
  <div>
    <NavBar />
    <h1>Solana USDC Transactions</h1>
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
import { getRecentTransactions, getTransactionInfo, getBlockTime, SOLANA_TRANSACTION_SCHEMA } from '@/utils/solana';
import moment from 'moment';
import { ageText } from '@/utils/web3utils';

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
      return SOLANA_TRANSACTION_SCHEMA;
    },
  },
  async mounted() {
    await this.fetchTransactions();
    await this.fetchInfos(this.$refs.table.page);
    this.loading = false;
  },
  methods: {
    async fetchTransactions() {
      this.transactions = (await getRecentTransactions(1000)).result;
    },
    async fetchInfos(page) {
      const pageLength = this.$refs.table.pageLength;
      const upperBound = Math.min((page + 1) * pageLength, this.transactions.length);
      const promises = [];

      for (let i = page * pageLength; i < upperBound; i++) {
        promises.push(getBlockTime(this.transactions[i].slot));
        promises.push(getTransactionInfo(this.transactions[i]));
      }

      const infos = await Promise.all(promises);
      for (let i = page * pageLength; i < upperBound; i++) {
        const age = moment.duration(moment().diff(moment.unix(infos[2 * (i - page * pageLength)].result)));
        this.transactions[i].age = ageText(age);
        this.transactions[i].fee = infos[2 * (i - page * pageLength) + 1].result.meta.fee / (10 ** 9);
      }
    },
    async pageChange(page) {
      this.loading = true;
      await this.fetchInfos(page);
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
