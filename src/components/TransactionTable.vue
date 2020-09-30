<template>
  <div>
    <Pagination
      v-bind:totalPages="this.totalPages"
      @page:change="this.pageChange"
    />
    <md-table>
      <md-table-row>
        <md-table-head>Transaction Hash</md-table-head>
        <md-table-head>Sender Address</md-table-head>
        <md-table-head>Receiver Address</md-table-head>
        <md-table-head>Transaction Amount</md-table-head>
      </md-table-row>
      <md-table-row
        v-for="t in transactions.slice(page * 25, (page + 1) * 25)"
        :key="t.transactionHash"
      >
        <md-table-cell>{{ t["transactionHash"] }}</md-table-cell>
        <md-table-cell>{{ t["topics"][1] }}</md-table-cell>
        <md-table-cell>{{ t["topics"][2] }}</md-table-cell>
        <md-table-cell>{{ parseInt(t["data"], 16) / 10 ** 6 }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import Web3 from "web3";
import Pagination from "@/components/Pagination";
const web3 = new Web3(Web3.givenProvider);
export const TRANSACTION_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const DEFAULT_PAGE_LENGTH = 25;
const MAX_TRANSACTIONS = 10000;
const WEB3_RESULT_TOO_LARGE_ERROR_CODE = -32005;

// Ropsten USDC Address
const CONTRACT_ADDRESS = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";

// Mainnet USDC Address
// const CONTRACT_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

export const getLogs = async (address, fromBlock) => {
  try {
    // Txns where wallet is receiver
    const receiverTxns = await web3.eth.getPastLogs({
      fromBlock: "0x" + fromBlock.toString(16),
      toBlock: "latest",
      address: CONTRACT_ADDRESS,
      topics: [TRANSACTION_TOPIC, null, address],
    });

    // Txns where wallet is sender
    const senderTxns = await web3.eth.getPastLogs({
      fromBlock: "0x" + fromBlock.toString(16),
      toBlock: "latest",
      address: CONTRACT_ADDRESS,
      topics: [TRANSACTION_TOPIC, address, null],
    });

    receiverTxns.forEach((t) => {
      t.topics[1] = "0x" + parseInt(t.topics[1]).toString(16);
      t.topics[2] = "0x" + parseInt(t.topics[2]).toString(16);
    });

    senderTxns.forEach((t) => {
      t.topics[1] = "0x" + parseInt(t.topics[1]).toString(16);
      t.topics[2] = "0x" + parseInt(t.topics[2]).toString(16);
    });

    return receiverTxns
      .concat(
        // Prevent internal transactions from being counted twice
        senderTxns.filter((log) => log.topics[1] !== log.topics[2])
      )
      .sort((a, b) => a.blockNumber - b.blockNumber);
  } catch (e) {
    if (e.code === WEB3_RESULT_TOO_LARGE_ERROR_CODE) {
      // More than MAX_TRANSACTIONS results
      return null;
    }
    console.error(e);
  }
};

export default {
  name: "Address",
  components: {
    Pagination,
  },
  data() {
    return {
      transactions: [],
      loading: false,
      page: 0,
    };
  },
  props: ["walletAddress"],
  computed: {
    totalPages() {
      return Math.ceil(this.transactions.length / DEFAULT_PAGE_LENGTH);
    },
  },
  methods: {
    async fetchTransactions() {
        console.log("walletAddress", this.$props.walletAddress);
      let address = this.$props.walletAddress;
      if (!address || address.length === 0) return;

      this.loading = true;
      address = "0x" + address.slice(2).padStart(64, "0");

      let transactions = await getLogs(address, 0);
      if (transactions !== null) {
        // We have all transactions in history for this address
        this.transactions = transactions.reverse().slice(0, MAX_TRANSACTIONS);
        this.loading = false;
        return;
      }

      let range = [0, await web3.eth.getBlockNumber()];
      let fromBlock = Math.floor((range[0] + range[1]) / 2);
      transactions = await getLogs(address, fromBlock);

      // Over MAX_TRANSACTIONS transactions; binary search to find block number that gets us just over MAX_TRANSACTIONS
      while (transactions === null || transactions.length < MAX_TRANSACTIONS) {
        if (transactions === null) {
          // Still too many transactions
          range[0] = fromBlock;
        } else {
          // Not enough transactions
          range[1] = fromBlock;
        }

        fromBlock = Math.floor((range[0] + range[1]) / 2);
        transactions = await getLogs(address, fromBlock);
      }

      // We have the latest MAX_TRANSACTIONS transactions
      this.transactions = transactions.reverse().slice(0, MAX_TRANSACTIONS);
      this.loading = false;
    },
    async pageChange(page) {
      this.page = page;
    },
  },
  async mounted() {
    await this.fetchTransactions();
  },
};
</script>
