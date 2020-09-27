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

const DEFAULT_PAGE_LENGTH = 25;
const INITIAL_BLOCK_LOOKBACK = 80000;

const getLogs = async (address, currentBlock, lookback) => {
  // Txns where wallet is receiver
  const receiverTxns = await web3.eth.getPastLogs({
    fromBlock: "0x" + Math.max(0, currentBlock - lookback).toString(16),
    toBlock: "latest",
    address: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    topics: [
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      null,
      address,
    ],
  });

  // Txns where wallet is sender
  const senderTxns = await web3.eth.getPastLogs({
    fromBlock: "0x" + Math.max(0, currentBlock - lookback).toString(16),
    toBlock: "latest",
    address: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    topics: [
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      address,
      null,
    ],
  });

  return receiverTxns.concat(
    // Prevent internal transactions from being counted twice
    senderTxns.filter((log) => log.topics[1] !== log.topics[2])
  );
};

export default {
  data() {
    return {
      transactions: [],
    };
  },

  methods: {
    async fetchTransactions(address, pageLength = DEFAULT_PAGE_LENGTH) {
      address = "0x" + address.slice(2).padStart(64, "0");

      const currentBlock = await web3.eth.getBlockNumber();
      let lookback = INITIAL_BLOCK_LOOKBACK;

      let transactions = await getLogs(address, currentBlock, lookback);

      while (transactions.length < pageLength && currentBlock - lookback >= 0) {
        lookback *= 2;
        transactions = await getLogs(address, currentBlock, lookback);
      }

      // Put most recent transactions first, take the first pageLength
      this.transactions = transactions.reverse().slice(0, pageLength);
    },
  },
  async mounted() {
    const { address } = this.$route.params;
    if (!address || address.length === 0) return;

    this.fetchTransactions(address);
  },
};
</script>