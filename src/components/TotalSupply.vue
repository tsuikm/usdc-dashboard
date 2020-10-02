<template>
  <div>
    <md-card class="container">
      <div class="card-header">
        <div class="heading">TOTAL SUPPLY</div>
      </div>
      <div class="card-content">
        <div>PERCENTAGE OF USDC HELD</div>
        <div>{{ this.usdcPercent }}</div>
        <div>TOTAL SUPPLY: {{ totalSupply }}</div>
      </div>
    </md-card>
  </div>
</template>

<script>
import Web3 from "web3";
const web3 = new Web3(Web3.givenProvider);

export default {
  name: "TotalSupply",
  props: {
    usdcBalance: Number,
    totalSupply: String,
  },
  data() {
    return {
      usdcPercent: null,
    }
  },
  methods: {
    async calculatePercentage() {
      await this.usdcBalance;
      console.log("balance in method", this.usdcBalance);
      this.usdcPercent = (this.usdcBalance / parseInt(this.totalSupply)) * 100;
    },
  },
  updated: function () {
    // await this.usdcBalance;
    console.log("balance", this.usdcBalance);
    console.log("not parsed", this.totalSupply);
    console.log("parsed", parseInt(this.totalSupply));
    // this.$nextTick();
    // this.$forceUpdate();
    // await this.usdcBalance;
    this.calculatePercentage();
    // this.$nextTick(this.calculatePercentage());
  },
};
</script>