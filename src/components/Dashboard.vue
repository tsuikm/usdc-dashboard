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
              <md-icon @click="submitAddress">search</md-icon>
            </md-field>
          </form>
        </div>
      </div>
    </md-toolbar>
    <Overview v-if="addressSubmitted" :walletAddress="walletAddress" />
    <Transactions />
  </div>
</template>

<script>
import Web3 from 'web3';
import Overview from "./Overview";
import Transactions from "./Transactions";

const web3 = new Web3(Web3.givenProvider);

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

      if (web3.utils.isAddress(this.walletAddress)) {
        window.location.href = `/address/${this.walletAddress}`;
      }
      else {
        window.location.href = `/404`;
      }
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
