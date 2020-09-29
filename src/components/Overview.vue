<template>
  <div>
    <div>Address: {{ walletAddress }}</div>
    <div>Balance: {{ this.balance }}</div>
  </div>
</template>

<script>
import Web3 from "web3";
const web3 = new Web3(Web3.givenProvider);
const tokenAddress = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
const abi = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function"
  }
];
const contract = new web3.eth.Contract(abi, tokenAddress);

export default {
  data() {
    return {
      balance: null
    }
  },
  props: {
    walletAddress: String
  },
  created: function() {
    this.lookupBalance();
  },
  methods: {
    lookupBalance() {
      if (this.walletAddress === "") {
        return;
      }

      contract.methods.balanceOf(this.walletAddress).call((error, balance) => {
        contract.methods.decimals().call((error, decimals) => {
          this.balance = balance / 10 ** decimals;
        });
      });
    }
  }
}
</script>

<style scoped>

</style>