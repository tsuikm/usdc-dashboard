<template>
  <div>
    <md-toolbar>
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <img id="logo" src="../assets/usdc-logo.png" />
        </div>
        <div class="md-toolbar-section-end">
          <form @submit.prevent="submitAddress">
            <md-field>
              <label>Wallet Address</label>
              <md-input type="text" v-model="walletAddress"></md-input>
              <md-icon>search</md-icon>
            </md-field>
          </form>
        </div>
      </div>
    </md-toolbar>
    <Overview v-if="addressSubmitted" :walletAddress="walletAddress" />
    <Transactions :address="null" />
  </div>
</template>

<script>
import Overview from "./Overview";
import Transactions from "./Transactions";

export default {
  name: "Dashboard",
  components: {
    Overview,
    Transactions,
  },
  data() {
    return {
      walletAddress: "",
      addressSubmitted: false,
    };
  },
  methods: {
    submitAddress() {
      this.addressSubmitted = true;
    },
  },
};
</script>

<style scoped>
.md-toolbar {
  padding-top: 8px;
}
#logo {
  height: 40px;
}
</style>
