<template>
  <div>
    <md-table>
      <md-table-row>
        <md-table-head md-numeric>Transaction Hash</md-table-head>
        <md-table-head>Sender Address</md-table-head>
        <md-table-head>Receiver Address</md-table-head>
        <md-table-head>How Long Ago</md-table-head>
        <md-table-head>Transaction Amount</md-table-head> </md-table-row
      >]
      <md-table-row v-for="i in transactions" :key="i.transactioHash">
        <md-table-cell></md-table-cell>
        <md-table-cell></md-table-cell>
        <md-table-cell></md-table-cell>
        <md-table-cell></md-table-cell>
        <md-table-cell></md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import Web3 from "web3";
const web3 = new Web3(Web3.givenProvider);

const TRANSACTION_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const DEFAULT_PAGE_LENGTH = 25;

// Ropsten USDC Address
const CONTRACT_ADDRESS = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";

// Mainnet USDC Address
// const CONTRACT_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

const getLogs = async (address, fromBlock) => {
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

    return receiverTxns.concat(
      // Prevent internal transactions from being counted twice
      senderTxns.filter((log) => log.topics[1] !== log.topics[2])
    );
  } catch (e) {
    if (e.code === -32005) {
      // More than 10k results
      return null;
    }
    console.error(e);
  }
};

export default {
  data() {
    return {
      transactions: [],
      loading: false,
    };
  },

  methods: {
    async fetchTransactions(address) {
      this.loading = true;
      address = "0x" + address.slice(2).padStart(64, "0");

      let transactions = await getLogs(address, 0);
      if (transactions !== null) {
        // We have all transactions in history for this address
        this.transactions = transactions.reverse().slice(0, 10000);
        this.loading = false;
        return;
      }

      let range = [0, await web3.eth.getBlockNumber()];
      let fromBlock = Math.floor((range[0] + range[1]) / 2);
      transactions = await getLogs(address, fromBlock);

      // Over 10k transactions; binary search to find block number that gets us just over 10k
      while (transactions === null || transactions.length < 10000) {
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

      // We have the latest 10k transactions
      this.transactions = transactions.reverse().slice(0, 10000);
      this.loading = false;
    },
  },
  async mounted() {
    const { address } = this.$route.params;
    if (!address || address.length === 0) return;

    this.fetchTransactions(address);
  },
};
</script>