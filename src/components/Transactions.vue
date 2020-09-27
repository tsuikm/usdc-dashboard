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
        <md-table-cell>hi</md-table-cell>
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

        let transactions = []
        let blocks = 0
        const count = 1000;
        while (transactions.length <= 50) { //*page

          transactions = await web3.eth.getPastLogs({
            fromBlock: toHex(latest - count * blocks),
            toBlock: toHex(latest),
            address: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'
          } );

          blocks += 1;
        }

        transactions = transactions.slice(0, 50);
        transactions.forEach((transaction, index) => {
          transaction.id = index;
          transaction.data = fromHex(transaction.data)/10**6;
          transaction.from = transaction.topics[1]
          transaction.to = transaction.topics[2]
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