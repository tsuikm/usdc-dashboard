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
        <md-table-cell>{{ transaction.age }}</md-table-cell>
        <md-table-cell>{{ transaction.data }}</md-table-cell>
        <md-table-cell>{{ transaction.from }}</md-table-cell>
        <md-table-cell>{{ transaction.to }}</md-table-cell>


      </md-table-row>



    </md-table>
  </div>
</template>


<script>
  import Web3 from 'web3';
  const web3 = new Web3(Web3.givenProvider);
  const usdcAddress = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F';

  const toHex = num => '0x' + (num).toString(16);
  const fromHex = num => parseInt(num, 16);
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
        const latest = await web3.eth.getBlockNumber();
        console.log(await this.getTransactionCount());

        let transactions = []
        let blocks = 0
        const count = 1000;
        while (transactions.length <= 50) { //*page

          transactions = await web3.eth.getPastLogs({
            fromBlock: toHex(latest - count * blocks),
            toBlock: toHex(latest),
            address: usdcAddress
          } );

          blocks += 1;
        }

        transactions = transactions.reverse();
        transactions = transactions.slice(0, 50);

        transactions.forEach((transaction, index) => {
          transaction.id = index;
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

            if (hours == 0 && minutes == 0) {
              blockNumberToAge.set(transaction.blockNumber, `${seconds} s ago`);
            }
            else if (hours == 0) {
              blockNumberToAge.set(transaction.blockNumber, `${minutes} mins ${seconds} s ago`);
            }
            else {
              blockNumberToAge.set(transaction.blockNumber, `${hours} hrs ${minutes} mins ago`);
            }
          }

          transaction.age = blockNumberToAge.get(transaction.blockNumber);
        }


        return transactions;
      },
      async getTransactionCount() {
        //need to fix since this is from sender address so just returning 1
        const transactionCount = web3.eth.getTransactionCount(usdcAddress);
        console.log(transactionCount);
        return transactionCount;
      }
    },
    created() {
      this.getTransactions().then(transactions => {
        this.transactions = transactions;
      });
    }
  }

</script>