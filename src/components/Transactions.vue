<template>
  <div>
    <md-table md-card>
      <md-table-toolbar>
        <h1 class="md-title">Transactions</h1>
        <pagination v-bind:totalPages="this.totalPages" @page:change="this.pageChange"/>
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
        <md-table-cell>{{ transaction.age }}</md-table-cell>
        <md-table-cell>{{ transaction.data }}</md-table-cell>
        <md-table-cell><a v-bind:href='`address/${transaction.from}`'>{{ transaction.from }}</a></md-table-cell>
        <md-table-cell><a v-bind:href='`address/${transaction.to}`'>{{ transaction.to }}</a></md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>


<script>
  import Pagination from './Pagination';

  import Web3 from 'web3';
  const web3 = new Web3(Web3.givenProvider);
  const usdcAddress = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F';

  const toHex = num => '0x' + (num).toString(16);
  const fromHex = num => parseInt(num, 16);

  export default {
    name: 'Transactions',
    components: {
      Pagination,
    },
    data() {
      return {
        transactions: [],
        totalPages: 300, //fix this
        page: 0,
      }
    },
    methods: {
      async getTransactions() {
        const latest = await web3.eth.getBlockNumber();
        //console.log(await this.getTransactionCount());

        let transactions = []
        let blocks = 0
        const count = 1000;
        while (transactions.length <= 50 * (this.page + 1)) {
          const from = Math.max(latest - count * blocks, 0);
          transactions = await web3.eth.getPastLogs({
            fromBlock: toHex(from),
            toBlock: toHex(latest),
            address: usdcAddress
          });

          // If its the last page, we don't have to display 50.
          if (from === 0) {
            break;
          }
          blocks += 1;
        }

        const upper = Math.min(transactions.length, transactions.length-50*(this.page));
        transactions = transactions.slice(transactions.length-50*(this.page + 1), upper);
        transactions = transactions.reverse();

        transactions.forEach((transaction, index) => {
          transaction.id = index + 50*(this.page);
          transaction.data = fromHex(transaction.data)/10**6;
          transaction.from = transaction.topics[1]
          transaction.to = transaction.topics[2]
        });


        // Since some of the transactions have the same block number, use a
        // dictionary to keep track of the age of the block for performance.
        const blockNumberToAge = new Map();
        const now = Date.now();

        for (const transaction of transactions) {

          if (!blockNumberToAge.has(transaction.blockNumber)) {
            const block = await web3.eth.getBlock(transaction.blockNumber);
            const blockTime = new Date(block.timestamp * 1000);
            const age = now - blockTime.getTime(); // in ms.

            // https://stackoverflow.com/questions/10874048/from-milliseconds-to-hour-minutes-seconds-and-milliseconds
            const seconds = Math.floor((age / 1000) % 60);
            const minutes = Math.floor((age / (1000 * 60)) % 60);
            const hours = Math.floor((age / (1000 * 60 * 60)) % 24);
            const days = Math.floor((age / (1000 * 60 * 60 * 24)) % 365.25)

            if (hours == 0 && minutes == 0) {
              blockNumberToAge.set(transaction.blockNumber, `${seconds} s ago`);
            }
            else if (hours == 0) {
              blockNumberToAge.set(transaction.blockNumber, `${minutes} mins ${seconds} s ago`);
            }
            else if (days == 0) {
              blockNumberToAge.set(transaction.blockNumber, `${hours} hrs ${minutes} mins ago`);
            } else {
              blockNumberToAge.set(transaction.blockNumber, `${days} days ${hours} hrs ago`);
            }
          }

          transaction.age = blockNumberToAge.get(transaction.blockNumber);
        }


        return transactions;
      },
      async getTransactionCount() {
        //TODO:need to fix since this is from sender address so just returning 1
        const transactionCount = await web3.eth.getTransactionCount(usdcAddress);
        return transactionCount;
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