<template>
  <div>
    <md-table md-card>
      <md-table-toolbar>
        <h1 class="md-title">Transactions</h1>
        <Pagination v-bind:totalPages="this.totalPages" @page:change="this.pageChange"/>
      </md-table-toolbar>
      <md-table-row>
        <md-table-head>TXN HASH</md-table-head>
        <md-table-head>Age</md-table-head>
        <md-table-head>Quantity</md-table-head>
        <md-table-head>Sender</md-table-head>
        <md-table-head>Receiver</md-table-head>
      </md-table-row>
      <md-table-row v-for="transaction in this.transactions" :key="transaction.transactionHash">
        <md-table-cell>{{ transaction.transactionHash }}</md-table-cell>
        <md-table-cell>{{ transaction.age }}</md-table-cell>
        <md-table-cell>{{ transaction.data }}</md-table-cell>
        <md-table-cell><a v-bind:href='`address/${transaction.from}`'>{{ transaction.from }}</a></md-table-cell>
        <md-table-cell><a v-bind:href='`address/${transaction.to}`'>{{ transaction.to }}</a></md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
  import Web3 from 'web3';
  import moment from 'moment';
  import Pagination from './Pagination';
  import { fromHex, toHex, removeLeadingZeros, removeDuplicates } from '../utils/utils';

  const web3 = new Web3(Web3.givenProvider);
  const USDC_ADDRESS = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F';

  export default {
    name: 'Transactions',
    components: {
      Pagination,
    },
    data() {
      return {
        transactions: [],
        totalPages: 300, // TODO: this number is hard-coded. We need to calculate the total number of transactions (not done yet) to compute how many total pages.
        page: 0,
      }
    },
    methods: {
      async getTransactions() {
        const latest = await web3.eth.getBlockNumber();
        let transactions = []
        let blocks = 0
        const count = 1000;

        // Loop to find enough transactions to display on the selected page.
        while (transactions.length <= 50 * (this.page + 1)) {
          const from = Math.max(latest - count * blocks, 0);
          transactions = await web3.eth.getPastLogs({
            fromBlock: toHex(from),
            toBlock: toHex(latest),
            address: USDC_ADDRESS
          });
          transactions = removeDuplicates(transactions, transaction => transaction.transactionHash);

          // If its the last page, we don't have to display 50.
          if (from === 0) {
            break;
          }
          blocks += 1;
        }

        // Select the correct 50 transactions to display on the page.
        const upper = Math.min(transactions.length, transactions.length-50*(this.page));
        transactions = transactions.slice(transactions.length-50*(this.page + 1), upper).reverse();

        transactions.forEach((transaction) => {
          transaction.data = fromHex(transaction.data)/10**6;
          transaction.from = removeLeadingZeros(transaction.topics[1]);
          transaction.to = removeLeadingZeros(transaction.topics[2]);
        });

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
            }
            else if (days == 0 && hours == 0) {
              blockNumberToAge.set(transaction.blockNumber, `${minutes} mins ${seconds} s ago`);
            }
            else if (days == 0) {
              blockNumberToAge.set(transaction.blockNumber, `${hours} hrs ${minutes} mins ago`);
            }
            else {
              blockNumberToAge.set(transaction.blockNumber, `${days} days ${hours} hrs ago`);
            }
          }

          transaction.age = blockNumberToAge.get(transaction.blockNumber);
        }

        return transactions;
      },
      async getTransactionCount() {
        // TODO: need to fix since this is from sender address so just returning 1
      },
      async pageChange (page) {
        this.page = page;
        this.transactions = await this.getTransactions();
      }
    },
    created() {
      this.getTransactions().then(transactions => {
        this.transactions = transactions;
      });
    }
  }
</script>
