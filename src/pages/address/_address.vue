<template>
  <div>
    <md-table>
      <md-table-row>
        <md-table-head md-numeric>Transaction Hash</md-table-head>
        <md-table-head>Sender Address</md-table-head>
        <md-table-head>Receiver Address</md-table-head>
        <md-table-head>How Long Ago</md-table-head>
        <md-table-head>Transaction Amount</md-table-head>
      </md-table-row>

      <md-table-row>
        <md-table-cell md-numeric>1</md-table-cell>
        <md-table-cell>Shawna Dubbin</md-table-cell>
        <md-table-cell>sdubbin0@geocities.com</md-table-cell>
        <md-table-cell>Male</md-table-cell>
        <md-table-cell>Assistant Media Planner</md-table-cell>
      </md-table-row>

      <md-table-row>
        <md-table-cell md-numeric>2</md-table-cell>
        <md-table-cell>Odette Demageard</md-table-cell>
        <md-table-cell>odemageard1@spotify.com</md-table-cell>
        <md-table-cell>Female</md-table-cell>
        <md-table-cell>Account Coordinator</md-table-cell>
      </md-table-row>

      <md-table-row>
        <md-table-cell md-numeric>3</md-table-cell>
        <md-table-cell>Vera Taleworth</md-table-cell>
        <md-table-cell>vtaleworth2@google.ca</md-table-cell>
        <md-table-cell>Male</md-table-cell>
        <md-table-cell>Community Outreach Specialist</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import Web3 from "web3";
const web3 = new Web3(Web3.givenProvider);

export default {
  data() {
    return {
      transactions: [],
    };
  },
  methods: {
    async fetchTransactions(address) {
      let n = await web3.eth.getBlockNumber();
      let numTransactions = await web3.eth.getTransactionCount(address, n);

      for (let i = n; i >= 0 && numTransactions > 0; i--) {
        try {
          let block = await web3.eth.getBlock(i, true);
          if (block && block.transactions) {
            for (const transaction of block.transactions) {
              if (address === transaction.from) {
                this.transactions.push(transaction);
                numTransactions--;
              } else if (address === transaction.to) {
                this.transactions.push(transaction);
              }
            }
          }
        } catch (e) {
          console.error(`Error in block ${i}`, e);
        }
      }
    },
  },
  async mounted() {
    const { address } = this.$route.params;
    if (!address || address.length === 0) return;

    this.fetchTransactions(address);
  },
};
</script>