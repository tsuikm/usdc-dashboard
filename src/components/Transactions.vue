<template>
  <div>
    <Table
      :loading="loading"
      :name="this.tableName"
      :totalItems="this.totalItems"
      :schema="this.tableSchema"
      :content="this.transactions"
      :keyField="'Transaction Hash'"
      @page:change="this.pageChange"
      ref="table"
    />
  </div>
</template>

<script>
import Web3 from "web3";
import moment from "moment";
import Table from "./Table";
import {
  fromHex,
  removeLeadingZeros,
  removeDuplicates,
  toHex,
  padHex,
} from "@/utils/utils";

import {
  USDC_CONTRACT_ADDRESS,
  TRANSACTION_TOPIC,
  WEB3_RESULT_TOO_LARGE_ERROR_CODE,
  WEB3_MAX_TRANSACTIONS,
  WEB3_GET_LOGS_ADDRESS_LENGTH,
} from "@/utils/constants";

const web3 = new Web3(Web3.givenProvider);
console.log(web3);

/**
 * Gets transaction logs for a wallet starting from fromBlock until latest.
 * Gets all transactions if address is null.
 */
export const getLogs = async (address, fromBlock) => {
  try {
    // Txns where wallet is receiver
    const receiverTxns = await web3.eth.getPastLogs({
      fromBlock: toHex(fromBlock),
      toBlock: "latest",
      address: USDC_CONTRACT_ADDRESS,
      topics: [TRANSACTION_TOPIC, null, address],
    });

    receiverTxns.forEach((t) => {
      t.from = removeLeadingZeros(t.topics[1]);
      t.to = removeLeadingZeros(t.topics[2]);
      t.data = fromHex(t.data) / 10 ** 6;
    });

    // Querying for all transactions; receiverTxns should include all
    if (address === null) {
      return removeDuplicates(
        receiverTxns.sort((a, b) => a.blockNumber - b.blockNumber),
        (t) => t.transactionHash
      );
    }

    // Txns where wallet is sender
    const senderTxns = await web3.eth.getPastLogs({
      fromBlock: toHex(fromBlock),
      toBlock: "latest",
      address: USDC_CONTRACT_ADDRESS,
      topics: [TRANSACTION_TOPIC, address, null],
    });

    senderTxns.forEach((t) => {
      t.from = removeLeadingZeros(t.topics[1]);
      t.to = removeLeadingZeros(t.topics[2]);
      t.data = fromHex(t.data) / 10 ** 6;
    });

    return removeDuplicates(
      receiverTxns
        .concat(
          // Prevent internal transactions from being counted twice
          senderTxns.filter((log) => log.topics[1] !== log.topics[2])
        )
        .sort((a, b) => a.blockNumber - b.blockNumber),
      (t) => t.transactionHash
    );
  } catch (e) {
    if (e.code === WEB3_RESULT_TOO_LARGE_ERROR_CODE) {
      // More than MAX_TRANSACTIONS results
      return null;
    }
    console.error(e);
  }
};

export default {
  name: "Transactions",
  components: {
    // Pagination,
    Table,
  },
  props: ["address"],
  computed: {
    totalItems() {
      // TODO: this number is hard-coded. We need to calculate the total number of transactions
      if (!this.address) return 7500;

      return this.transactions.length;
    },
    tableName() {
      if (!this.address) return "All Transactions";
      return `Transactions for Wallet ${this.address}`;
    },
    tableSchema() {
      const transactionSchema = [
        {
          name: "Transaction Hash",
          getter(t) {
            return t.transactionHash;
          },
          link(t) {
            return `/transaction/${t.transactionHash}`;
          }
        },
        {
          name: "Quantity",
          getter(t) {
            return t.data;
          },
        },
        {
          name: "Sender",
          getter(t) {
            return t.from;
          },
          link(t) {
            return `/address/${t.from}`;
          },
        },
        {
          name: "Receiver",
          getter(t) {
            return t.to;
          },
          link(t) {
            return `/address/${t.to}`;
          },
        },
      ];

      if (!this.address) {
        transactionSchema.push({
          name: "Age",
          getter(t) {
            return t.age;
          },
        });
      }

      return transactionSchema;
    },
    pageLength() {
      return this.$refs.table.pageLength;
    },
  },
  data() {
    return {
      transactions: [],
      page: 0,
      loading: true,
    };
  },
  methods: {
    async getAllTransactions() {
      const latest = await web3.eth.getBlockNumber();
      let transactions = [];
      let blocks = 0;
      const count = 1000;

      // Loop to find enough transactions to display on the selected page.
      while (transactions.length <= this.pageLength * (this.page + 2)) {
        const from = Math.max(latest - count * blocks, 0);
        transactions = await getLogs(null, from);

        // If its the last page, we don't have to display 50.
        if (from === 0) {
          break;
        }

        blocks += 1;
      }

      // Since some of the transactions have the same block number, use a
      // dictionary to keep track of the age of the block for performance.
      const blockNumberToAge = new Map();
      const now = moment();

      for (const transaction of transactions) {
        if (!blockNumberToAge.has(transaction.blockNumber)) {
          const block = await web3.eth.getBlock(transaction.blockNumber);
          const blockTime = moment.unix(block.timestamp);
          const age = moment.duration(now.diff(blockTime));

          const seconds = age.seconds();
          const minutes = age.minutes();
          const hours = age.hours();
          const days = age.days();

          // TODO: Factor this out to a separate util function? Also consider when minutes/hours/days is singular!
          if (days == 0 && hours == 0 && minutes == 0) {
            blockNumberToAge.set(transaction.blockNumber, `${seconds} s ago`);
          } else if (days == 0 && hours == 0) {
            blockNumberToAge.set(
              transaction.blockNumber,
              `${minutes} mins ${seconds} s ago`
            );
          } else if (days == 0) {
            blockNumberToAge.set(
              transaction.blockNumber,
              `${hours} hrs ${minutes} mins ago`
            );
          } else {
            blockNumberToAge.set(
              transaction.blockNumber,
              `${days} days ${hours} hrs ago`
            );
          }
        }

        transaction.age = blockNumberToAge.get(transaction.blockNumber);
      }

      this.transactions = transactions
        .reverse()
        .slice(0, WEB3_MAX_TRANSACTIONS);
      this.loading = false;
    },
    async getWalletTransactions() {
      let address = this.address;
      if (!address || address.length === 0) return;

      address = padHex(address, WEB3_GET_LOGS_ADDRESS_LENGTH);

      let transactions = await getLogs(address, 0);
      if (transactions !== null) {
        // We have all transactions in history for this address
        this.transactions = transactions
          .reverse()
          .slice(0, WEB3_MAX_TRANSACTIONS);
        this.loading = false;
        return;
      }

      let range = [0, await web3.eth.getBlockNumber()];
      let fromBlock = Math.floor((range[0] + range[1]) / 2);
      transactions = await getLogs(address, fromBlock);

      // Over MAX_TRANSACTIONS transactions; binary search to find block number that gets us just over MAX_TRANSACTIONS
      while (
        transactions === null ||
        transactions.length < WEB3_MAX_TRANSACTIONS
      ) {
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
      this.transactions = transactions
        .reverse()
        .slice(0, WEB3_MAX_TRANSACTIONS);
    },
    async pageChange(page) {
      this.page = page;

      if (!this.address) {
        this.getAllTransactions();
      }
    },
  },
  created() {
    if (this.address) {
      this.getWalletTransactions();
    } else {
      this.getAllTransactions();
    }
  },
};
</script>

