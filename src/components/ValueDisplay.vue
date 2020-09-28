<template>
  <div class="md-layout">
    <div class="md-layout-items left">
      <div>
        <div class="subheading">BALANCE (USDC)</div>
        <div class="value">{{ this.usdcBalance }}</div>
      </div>
    </div>
    <div class="md-layout-items mid">
      <img
        src="../assets/purple-arrows.svg"
        alt="purple-arrows"
        class="purple-arrow"
      />
    </div>
    <div class="md-layout-items right">
      <div>
        <div class="subheading">BALANCE (USD $)</div>
        <div class="value">{{ this.usdValue }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ValueDisplay",
  props: {
    usdcBalance: Number,
    usdValue: Number,
  },
};
</script>

<style scoped>
.purple-arrow {
  width: 45px;
}
.md-layout-items {
  height: 130px;
  padding-top: 10px;
}
.md-layout-items.left {
  width: 44%;
  display: flex;
  flex-direction: column;
}
.md-layout-items.mid {
  width: 12%;
  display: flex;
  align-items: center;
  padding-left: 5px;
}
.md-layout-items.right {
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
  font-size: 70px;
  color: #717171;
}
</style>
