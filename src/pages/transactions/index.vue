<template>
  <div>
    <NavBar />
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
import moment from 'moment';
import NavBar from '@/components/NavBar';
import Table from '@/components/Table';
import { TRANSACTION_SCHEMA } from '@/utils/constants';
import { web3, getAllTransactions } from '@/utils/web3utils';

export default {
  components: {
    Table,
    NavBar,
  },
  data() {
    return {
      transactions: [],
      loading: true,
      blockAge: new Map(),
      now: moment(),
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
    async fetchAge(transaction) {
      if (!this.blockAge.has(transaction.blockNumber)) {
        const block = await web3.eth.getBlock(transaction.blockNumber);
        const blockTime = moment.unix(block.timestamp);
        const age = moment.duration(this.now.diff(blockTime));

        const seconds = age.seconds();
        const minutes = age.minutes();
        const hours = age.hours();
        const days = age.days();

        if (days == 0 && hours == 0 && minutes == 0) {
          this.blockAge.set(transaction.blockNumber, `${seconds} s ago`);
        } else if (days == 0 && hours == 0) {
          this.blockAge.set(
            transaction.blockNumber,
            `${minutes} mins ${seconds} s ago`,
          );
        } else if (days == 0) {
          this.blockAge.set(
            transaction.blockNumber,
            `${hours} hrs ${minutes} mins ago`,
          );
        } else {
          this.blockAge.set(
            transaction.blockNumber,
            `${days} days ${hours} hrs ago`,
          );
        }
      }

      return this.blockAge.get(transaction.blockNumber);
    },
    async fetchTransactions() {
      this.transactions = await getAllTransactions();
    },
    async fetchAges(page) {
      const pageLength = this.$refs.table.pageLength;
      const upperBound = Math.min((page + 1) * pageLength, this.transactions.length);
      const promises = [];

      for (let i = page * pageLength; i < upperBound; i++) {
        promises.push(this.fetchAge(this.transactions[i]));
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
};
</script>
