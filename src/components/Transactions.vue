<template>
  <p @click="method">test</p>
</template>


<script>
  import { getCurrentBlockNumber, getTransactions } from '../api/infura.js';


  export default {
    name: 'Transactions',

    methods: {
      async method() {
        let blockNum = await getCurrentBlockNumber();
        let transactions = []
        let blocks = 0
        let count = 1000;
        while (transactions.length <= 50) { //*page
          transactions = transactions.concat(await getTransactions('0x' + (blockNum - count + 1).toString(16), '0x' + (blockNum).toString(16)));
          blockNum -= count;
        }

        console.log(transactions);

      }
    }
  }




</script>