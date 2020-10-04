<template>
  <div>
    <md-card class="container">
      <div class="card-header">
        <div class="card-subheader">
          <div class="heading">SUMMARY</div>
          <RoleDisplay :minter="this.minter" :pauser="this.pauser" :owner="this.owner" />
        </div>
        <div>
          <img src="../assets/gray-bar.svg" alt="gray-bar" class="gray-bar" />
        </div>
      </div>
      <div class="card-content">
        <ValueDisplay :usdcBalance="this.usdcBalance" :usdValue="this.usdValue" />
      </div>
      <div class="card-footer">
        <ConversionDisplay :conversionRate="this.conversionRate" />
      </div>
    </md-card>
  </div>
</template>

<script>
import ValueDisplay from "@/components/ValueDisplay";
import ConversionDisplay from "@/components/ConversionDisplay";
import RoleDisplay from "@/components/RoleDisplay";
export default {
  name: "BalanceCard",
  components: {
    ValueDisplay,
    ConversionDisplay,
    RoleDisplay
  },
  props: {
    usdcBalance: Number,
    usdValue: Number,
    conversionRate: String,
    minter: Boolean,
    pauser: Boolean,
    owner: Boolean
  }
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
  display: flex;
  flex-direction: column;
}
.card-subheader {
  display: flex;
  align-items: center;
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
