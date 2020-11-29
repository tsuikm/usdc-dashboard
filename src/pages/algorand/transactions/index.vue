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
import { fetchAlgorand, getCurrentRound } from '@/utils/algoUtils';
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
    // await this.fetchAdditionalInfo(this.$refs.table.page);

    this.loading = false;
  },
  methods: {
    async fetchTransactions() {
      const latestBlock = await getCurrentRound();

      // TODO: currently the numbers 30000 and 5000 are hard-coded for convenience.
      //       Factor this out into constants when the constants are tuned.
      let currentMaxBlock = latestBlock;
      let currentMinBlock = latestBlock - 30000;

      while (this.transactions.length < 5000 && currentMinBlock > 0) {
        const transactions = await fetchAlgorand('/idx2/v2/transactions', {
          'asset-id': ALGORAND_USDC_ASSET_ID,
          'min-round': currentMinBlock,
          'max-round': currentMaxBlock,
        });

        pushAll(this.transactions, transactions.transactions.reverse());

        currentMaxBlock = currentMinBlock;
        currentMinBlock -= 30000;
      }
    },

    // TODO: the current api calls don't give us the age. Use this method to get the ages of the transactions currently displayed.
    //
    // async fetchAdditionalInfo(page) {
    //   const pageLength = this.$refs.table.pageLength;
    //   const upperBound = Math.min((page + 1) * pageLength, this.transactions.length);

    //   for (let i = page * pageLength; i < upperBound; i++) {
    //   this.transactions[i].age = await fetchAge(this.transactions[i]);
    //     const transaction = await fetchAlgorand(`/v2/transactions/${this.transactions[i].id}`, {
    //       'asset-id': ALGORAND_USDC_ASdSET_ID
    //     });
    //     this.transactions[i].receiver = transaction.curxfer.rcv;
    //     this.transactions[i].amount = transaction.curxfer.amt;
    //   }
    // },
    async pageChange() {
      // this.loading = true;
      // await this.fetchAdditionalInfo(page);
      // this.loading = false;
    },
  },
};
</script>
