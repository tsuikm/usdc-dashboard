<template>
  <div class="md-layout">
    <div class="md-layout-items left">
        <div class="subheading">USDC BALANCE ($)</div>
        <div class="value">{{ usdcBalance }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ValueDisplay",
  props: {
    usdcBalance: Number,
  },
};
</script>

<style scoped>
.md-layout-items {
  height: 130px;
  padding-top: 10px;
}
.md-layout-items.left {
  width: 44%;
  display: flex;
  flex-direction: column;
}
.subheading {
  font-weight: 800;
  font-size: 20px;
  color: #a3a3a3;
  height: 50px;
  letter-spacing: 1px;
}
.value {
  font-weight: 900;
  font-size: 65px;
  color: #717171;
}
</style>
