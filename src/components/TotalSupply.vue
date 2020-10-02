<template>
  <div>
    <md-card class="container">
      <div class="card-header">
        <div class="heading">TOTAL SUPPLY</div>
        <div>
          <img src="../assets/gray-bar.svg" alt="gray-bar" class="gray-bar" />
        </div>
      </div>
      <div class="card-content">
        <div class="subheading">PERCENTAGE OF USDC HELD</div>
        <div class="value">{{ this.usdcPercent }} %</div>
      </div>
      <div class="card-footer">
        <div class="subheading">TOTAL SUPPLY:</div>
        <div class="content">{{ totalSupply }} USDC</div>
      </div>
    </md-card>
  </div>
</template>

<script>
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
      var percentage = (this.usdcBalance / parseInt(this.totalSupply)) * 100;
      // var percentage = (10000000000000 / parseInt(this.totalSupply)) * 100;
      if (percentage < 0.001) {
          this.usdcPercent = "<.001"
      } else {
        this.usdcPercent = Number.parseFloat(percentage).toPrecision(3);
      }
    },
  },
  updated: function () {
    this.calculatePercentage();
  },
};
</script>

<style scoped>
.container {
  width: 500px;
  height: 300px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  padding: 30px;
}
.card-header {
  height: 60px;
  letter-spacing: 1px;
}
.card-content {
  height: 145px;
}
.card-footer {
  height: 30px;
  display: flex;
}
.value {
  font-weight: 900;
  font-size: 65px;
  color: #717171;
}
.heading {
  font-weight: 800;
  font-size: 24px;
  color: #a3a3a3;
}
.subheading {
  font-weight: 800;
  font-size: 20px;
  color: #a3a3a3;
  height: 50px;
  letter-spacing: 1px;
}
.gray-bar {
  width: 800px;
  padding-top: 5px;
}
.content {
  font-weight: 200;
  font-size: 20px;
  color: #a3a3a3;
}
</style>