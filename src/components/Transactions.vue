<template>
  <div>
    <md-table md-card>
      <md-table-toolbar>
        <h1 class="md-title">Transactions</h1>
      </md-table-toolbar>

      <md-table-row>
        <md-table-head md-numeric>ID</md-table-head>
        <md-table-head>Name</md-table-head>
        <md-table-head>Email</md-table-head>
        <md-table-head>Gender</md-table-head>
        <md-table-head>Job Title</md-table-head>
      </md-table-row>

      <md-table-row v-for="transaction in this.transactions" :key="transaction.id">
        <md-table-cell>{{ transaction.transactionHash }}</md-table-cell>
      </md-table-row>



    </md-table>
  </div>
</template>


<script>
  import { getCurrentBlockNumber, getTransactions } from '../api/infura.js';


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