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
      @page:change="this.pageChange"
    />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import Table from '@/components/Table';
import { fetchAlgorand, getCurrentRound, fetchAge } from '@/utils/algoUtils';
import { pushAll } from '@/utils/utils';
import {
  ALGORAND_USDC_ASSET_ID,
  API_BASE_URL,
  RECENT_COUNT,
  ALGORAND_TXNS_LOOKBACK,
  ALGORAND_TRANSACTION_SCHEMA
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
      ALGORAND_TRANSACTION_SCHEMA
    };
  },
  async mounted() {
    await this.fetchTransactions();
    await this.fetchAdditionalInfo(this.$refs.table.page);

    this.loading = false;
  },
  methods: {
    async fetchTransactions() {
      const latestBlock = await getCurrentRound();
      
      let currentMaxBlock = latestBlock;
      let currentMinBlock = latestBlock - 5000;

      while (this.transactions.length < 10) {
        const transactions = await fetchAlgorand(`/idx2/v2/assets/${ALGORAND_USDC_ASSET_ID}/transactions`, {
          'min-round': currentMinBlock,
          'max-round': currentMaxBlock
        });
      
        pushAll(this.transactions, transactions.transactions.reverse());

        currentMaxBlock = currentMinBlock;
        currentMinBlock -= 5000;
      }
    },
    async fetchAdditionalInfo(page) {
      console.log("fetch addition");

      const pageLength = this.$refs.table.pageLength;
      const upperBound = Math.min((page + 1) * pageLength, this.transactions.length);

      for (let i = page * pageLength; i < upperBound; i++) {
        console.log("in loop");

        this.transactions[i].age = fetchAge(this.transactions[i]);
        console.log("after age");

        const transaction = await fetchAlgorand(`/ps1/v1/transaction/${this.transactions[i].id}`);
        console.log("after fetch algo for receiver, amt", transaction);
        this.transactions[i].receiver = transaction.curxfer.rcv;
        this.transactions[i].amount = transaction.curxfer.amt;
        console.log(this.transactions[i]);
      }
    },  
    async pageChange(page) {
      this.loading = true;
      await this.fetchAdditionalInfo(page);
      this.loading = false;
    },
  },
};
</script>
