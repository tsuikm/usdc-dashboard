<template>
  <p @click="method">test</p>
</template>


<script>

  import Web3 from 'web3';
  const url = "https://eth-ropsten.alchemyapi.io/v2/IRO8mAYvfw93Ff64Tuj5LWCXXwnp20FO";
  const web3 = new Web3(url);


  export default {
    name: 'Transactions',

    methods: {
      async method() {
        // https://ethereum.stackexchange.com/questions/1587/how-can-i-get-the-data-of-the-latest-10-blocks-via-web3-js
        // const latest = await web3.eth.getBlockNumber();
        // const batch = new web3.eth.BatchRequest()

        // for (let i = latest - 10; i < latest + 1; i += 1 ) {
        //   batch.add(web3.eth.getBlock.request(i, console.log));
        // }

        // batch.execute();

        // web3.eth.getPastLogs({
        // })
        // .then(console.log);


        // var subscription = web3.eth.subscribe('logs', {
        // }, function(error, result){
        //     if (!error)
        //         console.log(result);
        // })
        // .on("connected", function(subscriptionId){
        //     console.log(subscriptionId);
        // })
        // .on("data", function(log){
        //     console.log(log);
        // })
        // .on("changed", function(log){
        // });



        // const requestData = JSON.stringify({
        //   jsonrpc: "2.0",
        //   method: "eth_getLogs",
        //   params: [
        //     {
        //       topics: []
        //     }
        //   ],
        //   limit: 10,
        //   id: 0
        // });

        // fetch(url, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: requestData
        // }).then(response => response.json())
        //   .then(data => {
        //     console.log(data)
        //   });


      }
    }
  }




</script>