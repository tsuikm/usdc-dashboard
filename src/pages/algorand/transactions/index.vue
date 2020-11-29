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
    // await this.fetchAdditionalInfo(this.$refs.table.page);

    this.loading = false;
  },
  methods: {
    async fetchTransactions() {
      const latestBlock = await getCurrentRound();
      
      let currentMaxBlock = latestBlock;
      let currentMinBlock = latestBlock - 30000;

      while (this.transactions.length < 5000 && currentMinBlock > 0) {
        const transactions = await fetchAlgorand('/idx2/v2/transactions', {
          'asset-id': ALGORAND_USDC_ASSET_ID,
          'min-round': currentMinBlock,
          'max-round': currentMaxBlock
        });
        console.log(transactions)
      
        pushAll(this.transactions, transactions.transactions.reverse());

        currentMaxBlock = currentMinBlock;
        currentMinBlock -= 30000;
      }
    },
    // async fetchAdditionalInfo(page) {
    //   const pageLength = this.$refs.table.pageLength;
    //   const upperBound = Math.min((page + 1) * pageLength, this.transactions.length);

    //   for (let i = page * pageLength; i < upperBound; i++) {
    //   this.transactions[i].age = await fetchAge(this.transactions[i]);
    //     const transaction = await fetchAlgorand(`/v2/transactions/${this.transactions[i].id}`, {
    //       'asset-id': ALGORAND_USDC_ASdSET_ID 
    //     });
    //     console.log(transaction);
    //     this.transactions[i].receiver = transaction.curxfer.rcv;
    //     this.transactions[i].amount = transaction.curxfer.amt;
    //     console.log(this.transactions[i]);
    //   }
    // },  
    async pageChange(page) {
      // this.loading = true;
      // await this.fetchAdditionalInfo(page);
      // this.loading = false;
    },
  },
};
</script>
