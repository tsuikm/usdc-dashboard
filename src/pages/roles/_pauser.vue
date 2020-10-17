<template>
  <div class="pauser">
    <div>PAUSER CONTROLS: PAUSE CONTRACT</div>
    <div>Contract is currently</div>
    <div class="container">
      <div v-if="this.contractPaused">
        <button class="status">
          PAUSED
        </button>
        <div> 
          Click to unpause contract.
        </div>
        <div> 
          All transfers, minting, and burning are PAUSED.
        </div>
      </div>
      <div v-else>
        <button class="status">
          UNPAUSED
        </button>
        <div> 
          Click to pause contract.
        </div>
        <div> 
          All transfers, minting, and burning are ACTIVE.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { USDC_CONTRACT_ADDRESS } from '@/utils/constants';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider);

const abi = [];

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
  updated: function() {
    this.changeContractStatus();
  },
  methods: {
    lookupContractStatus() {
      //TODO: check contract status
    },
    changeContractStatus() {
      //TODO: change contract status
    },
  },
};
</script>

<style scoped>
.pauser {
  padding: 30px;
  margin: 40px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
}
</style>