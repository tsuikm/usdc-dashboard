<template>
  <div class="pauser">
    <div class="header">
      Pause and Unpause Contract
    </div>
    <div class="container">
      <div class="content-header">
        USDC Contract is currently
      </div>
      <div
        v-if="this.contractPaused"
        class="content"
      >
        <md-button
          class="status"
          @click="handleUnpause"
        >
          PAUSED
        </md-button>
        <div class="content">
          <div class="content-text">
            Click to unpause contract.
          </div>
          <div class="content-subtext">
            All transfers, minting, and burning are PAUSED.
          </div>
        </div>
      </div>
      <div
        v-else
        class="content"
      >
        <md-button
          class="status"
          @click="handlePause"
        >
          UNPAUSED
        </md-button>
        <div class="content">
          <div class="content-text">
            Click to pause contract.
          </div>
          <div class="content-subtext">
            All transfers, minting, and burning are ACTIVE.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { USDC_CONTRACT_ADDRESS } from '@/utils/constants';
import Web3 from 'web3';
import { abi } from '@/utils/web3abi';

const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  name: 'Pauser',
  data() {
    return {
      contractPaused: null,
    };
  },
  created: function() {
    this.lookupContractStatus();
  },
  methods: {
    async handleUnpause() {
      this.contractPaused = false;
    },
    async handlePause() {
      await contract.methods.pause().call();

      this.contractPaused = true;
    },
    async lookupContractStatus() {
      this.contractPaused = await contract.methods.paused().call();
    },
  },
};
</script>

<style scoped>
.pauser {
 padding: 30px;
  margin: 40px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  width: 40%;
}

.header {
  font-size: 20px;
  font-weight: 900;
  padding-bottom: 3%;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-header {
  font-weight: 500;
  font-size: 16px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.content-text {
  font-weight: 500;
  font-size: 12px;
  margin-top: 10px;
}

.content-subtext {
  font-size: 12px;
  margin-bottom: 20px;
}
</style>
