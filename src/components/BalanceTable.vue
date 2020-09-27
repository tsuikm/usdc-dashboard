<template>
  <div>
    <md-card class="summary-card">
      <md-card-header>
        <md-card-header-text>
          <div class="card-title">SUMMARY</div>
        </md-card-header-text>
      </md-card-header>
      <md-card-header class="balances">
        <md-card-header class="value-display">
          <md-card-header-text class="value-header">
            BALANCE (USDC)
          </md-card-header-text>
          <md-card-header-text class="value-value">
            {{ this.usdcBalance }}
          </md-card-header-text>
        </md-card-header>
        <img
          src="../assets/purple-arrows.svg"
          alt="purple-arrows"
          class="purple-arrows"
          md-medium="true"
        />
        <md-card-header class="value-display">
          <md-card-header-text class="value-header">
            VALUE (USD$)
          </md-card-header-text>
          <md-card-header-text class="value-value">
            {{ this.usdValue }}
          </md-card-header-text>
        </md-card-header>
      </md-card-header>
      <md-card-header class="converstion-rate">
        <md-card-header-text class="conv-rate-bold">
          Conversion Rate:
        </md-card-header-text>
        <md-card-header-text class="conv-rate">
          1 USD//Coin to {{ this.conversionRate }} US Dollar
        </md-card-header-text>
      </md-card-header>
    </md-card>
  </div>
</template>

<script>
export default {
  name: "BalanceTable",
  props: {
    usdcBalance: Number,
    usdValue: Number,
    conversionRate: Number,
  },
};
</script>

<style scoped>
.summary-card {
  width: 50%;
  height: 300px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
}
.card-title {
  font-weight: 800;
  font-size: 20px;
  color: #a3a3a3;
}
.balances {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.value-display {
  display: flex;
  flex-direction: column;
  height: 150px;
}
.value-header {
  font-weight: 800;
  font-size: 20px;
  color: #a3a3a3;
  height: 50px;
}
.value-value {
  font-weight: 900;
  font-size: 75px;
  color: #717171;
}
.conversion-rate {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.conv-rate-bold {
  font-weight: 800;
  font-size: 20px;
  color: #a3a3a3;
}
.conv-rate {
  font-weight: 200;
  font-size: 20px;
  color: #a3a3a3;
}
.purple-arrows {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 80px;
}
.md-card-header {
  margin-left: 0px;
  align-items: center;
}
.md-card-media {
  margin-left: 0px;
}
.md-card-header:last-child {
  margin-bottom: 0px;
}
.md-card-header > img {
  border-radius: 0px;
}
</style>
