<template>
  <div>
    <md-table md-card>
      <md-table-toolbar>
        <h1 class="md-title">Transactions</h1>
      </md-table-toolbar>

      <md-table-row>
        <md-table-head md-numeric>ID</md-table-head>
        <md-table-head>TXN HASH</md-table-head>
        <md-table-head>Age</md-table-head>
        <md-table-head>Quantity</md-table-head>
        <md-table-head>Sender</md-table-head>
        <md-table-head>Receiver</md-table-head>
      </md-table-row>

      <md-table-row v-for="transaction in this.transactions" :key="transaction.id">
        <md-table-cell md-numeric>{{ transaction.id + 1 }}</md-table-cell>
        <md-table-cell>{{ transaction.transactionHash }}</md-table-cell>
        <md-table-cell>hi</md-table-cell>
        <md-table-cell>hello</md-table-cell>
        <md-table-cell>something</md-table-cell>
        <md-table-cell>no</md-table-cell>


      </md-table-row>



    </md-table>
  </div>
</template>


<script>
  import { getCurrentBlockNumber, getTransactions } from '../api/infura.js';

  //timestamp blockbynumber
  //from/to/value getTransactionByHash

  export default {
    name: 'Transactions',
    data() {
      return {
        transactions: []
      }
    },
    methods: {
      async getTransactions() {
        let blockNum = await getCurrentBlockNumber();
        let transactions = []
        let blocks = 0
        const count = 1000;
        while (transactions.length <= 50) { //*page
          transactions = await getTransactions('0x' + (blockNum - count*blocks).toString(16), '0x' + (blockNum).toString(16));
          blocks += 1;
        }
        transactions = transactions.slice(0, 50);
        transactions.forEach((transaction, index) => {
          transaction.id = index;
        });
        return transactions;
      }
    },
    created() {
      this.getTransactions().then(transactions => {
        this.transactions = transactions;
      });
    }
  }





</script>