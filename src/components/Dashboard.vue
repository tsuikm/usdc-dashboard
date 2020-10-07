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
    <NavBar />
    <Transactions />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import Transactions from '@/components/Transactions';

export default {
  name: 'Dashboard',
  components: {
    Transactions,
    NavBar
  }
};
</script>