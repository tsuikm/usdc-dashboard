<template>
  <div>
    <md-card class="container">
      <div class="card-header">
        <div class="heading">SUMMARY</div>
        <div>
          <img src="../assets/gray-bar.svg" alt="gray-bar" class="gray-bar" />
        </div>
      </div>
      <div class="card-content">
        <ValueDisplay
          :usdcBalance="this.usdcBalance"
          :usdValue="this.usdValue"
        />
      </div>
      <div class="card-footer">
        <ConversionDisplay :conversionRate="this.conversionRate" />
      </div>
    </md-card>
  </div>
</template>

<script>
import ValueDisplay from "./ValueDisplay";
import ConversionDisplay from "./ConversionDisplay";
export default {
  name: "BalanceCard",
  components: {
    ValueDisplay,
    ConversionDisplay,
  },
  props: {
    usdcBalance: Number,
    usdValue: Number,
    conversionRate: String,
  },
};
</script>

<style scoped>
.container {
  width: 750px;
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
.heading {
  font-weight: 800;
  font-size: 24px;
  color: #a3a3a3;
}
.gray-bar {
  width: 800px;
  padding-top: 5px;
}
</style>
