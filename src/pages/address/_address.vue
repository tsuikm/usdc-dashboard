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
import { getWalletTransactions, fetchAge } from '@/utils/web3utils';

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
    await this.fetchAges(0);
    this.loading = false;
  },
  methods: {
    async fetchTransactions() {
      this.transactions = await getWalletTransactions(padHex(this.$route.params.address, WEB3_GET_LOGS_ADDRESS_LENGTH));
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
    pageChange() {},
  },
};
</script>
