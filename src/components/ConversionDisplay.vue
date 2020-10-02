<template>
  <div class="conv-container">
    <div class="subheading">CONVERSION RATE:</div>
    <div class="content">
      1 USD//Coin to {{ this.conversionRate }} US Dollar
    </div>
  </div>
</template>

<script>
export default {
  name: "ConversionDisplay",
  props: {
    conversionRate: String,
  },
};
</script>

<style scoped>
.conv-container {
  display: flex;
}
.subheading {
  font-weight: 800;
  font-size: 20px;
  color: #a3a3a3;
  height: 50px;
  letter-spacing: 1px;
}
.content {
  font-weight: 200;
  font-size: 20px;
  color: #a3a3a3;
  padding-left: 10px;
}
</style>
