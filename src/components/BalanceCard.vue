<template>
  <div>
    <md-card class="container">
      <div class="card-header">
        <div class="card-subheader">
          <div class="heading">SUMMARY</div>
          <RoleDisplay :minter="minter" :pauser="pauser" :owner="owner" />
        </div>
        <div>
          <img src="@/assets/gray-bar.svg" alt="gray-bar" class="gray-bar" />
        </div>
      </div>
      <div class="card-content">
        <ValueDisplay :usdcBalance="usdcBalance"/>
      </div>
    </md-card>
  </div>
</template>

<script>
import RoleDisplay from '@/components/RoleDisplay';
import ValueDisplay from '@/components/ValueDisplay';
export default {
  name: 'BalanceCard',
  components: {
    ValueDisplay,
    RoleDisplay,
  },
  props: {
    usdcBalance: Number,
    minter: Boolean,
    pauser: Boolean,
    owner: Boolean,
  },
};
</script>

<style scoped>
.container {
  width: 700px;
  height: 250px;
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
  height: 140px;
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
