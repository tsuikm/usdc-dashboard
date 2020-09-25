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
import { getTransactionsForAddress, getCurrentBlockNumber } from "@/api/infura";

const DEFAULT_PAGE_LENGTH = 25;
const INITIAL_BLOCK_LOOKBACK = 80000;

export default {
  data() {
    return {
      transactions: [],
    };
  },

  methods: {
    async fetchTransactions(address, pageLength = DEFAULT_PAGE_LENGTH) {
      address = "0x" + address.slice(2).padStart(64, "0");

      const currentBlock = await getCurrentBlockNumber();
      let lookback = INITIAL_BLOCK_LOOKBACK;

      let transactions = await getTransactionsForAddress(
        address,
        "0x" + Math.max(0, currentBlock - lookback).toString(16),
        "latest"
      );

      while (
        transactions.receiverTxns.length + transactions.senderTxns.length <
          pageLength &&
        currentBlock - lookback >= 0
      ) {
        lookback *= 2;
        transactions = await getTransactionsForAddress(
          address,
          "0x" + Math.max(0, currentBlock - lookback).toString(16),
          "latest"
        );
      }

      this.transactions = transactions.receiverTxns.concat(
        transactions.senderTxns
      );
    },
  },
  async mounted() {
    const { address } = this.$route.params;
    if (!address || address.length === 0) return;

    this.fetchTransactions(address);
  },
};
</script>