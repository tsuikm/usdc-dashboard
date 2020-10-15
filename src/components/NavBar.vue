<template>
  <md-toolbar>
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <img
          id="logo"
          src="@/assets/usdc-logo.png"
        >
      </div>
      <div class="md-toolbar-section-end">
        <form @submit.prevent="submitAddress">
          <md-field>
            <label>Wallet Address</label>
            <md-input
              v-model="walletAddress"
              type="text"
              class="input"
            />
            <button @click="submitAddress">
              <md-icon>search</md-icon>
            </button>
          </md-field>
        </form>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import Web3 from 'web3';
import { padHex } from '@/utils/utils';

const web3 = new Web3(Web3.givenProvider);

export default {
  name: 'NavBar',
  data() {
    return {
      walletAddress: '',
    };
  },
  methods: {
    submitAddress() {
      this.walletAddress = padHex(this.walletAddress.trim(), WEB3_BALANCEOF_ADDRESS_LENGTH);

      if (web3.utils.isAddress(this.walletAddress)) {
        window.location.href = `/address/${this.walletAddress}`;
      }
      else {
        window.location.href = '/404';
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

button {
  background-color: transparent;
  border: none;
}
button:hover {
  cursor: pointer;
  opacity: 0.7;
}

.input {
  width: 400px;
}

</style>
