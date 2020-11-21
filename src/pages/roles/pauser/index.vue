<template>
  <div>
    <NavBar />
    <div class="header">
        Pauser Controls
    </div>
    <div class="container">
      <div class="container-main">
        <div class="content-header">
          Pause Contract
        </div>
        <md-switch v-model="contractPaused" class="md-primary" @click="handleUnpause"></md-switch>
      </div>
      <div v-if="this.contractPaused">
        <div class="content-subtext">
          All transfers, minting, and burning are PAUSED.
        </div>
      </div>
      <div v-else>
        <div class="content-subtext">
         All transfers, minting, and burning are ACTIVE.
        </div>
      </div>
    </div>
    <div class="pauser">
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
          <div class="content-subtext">
            All transfers, minting, and burning are ACTIVE.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE } from '@/utils/constants';
import { contract } from '@/utils/web3utils';

export default {
  components: {
    NavBar,
  },
  data() {
    return {
      contractPaused: null,
      accounts: [],
    };
  },
  created: function() {
    this.lookupContractStatus();
    this.connectMetamask();
  },
  methods: {
    async connectMetamask() {
      this.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    },
    async subscribeToEvent(event) {
      contract.once(event, async () => {
        this.contractPaused = await contract.methods.paused().call();
      });
    },
    async handleUnpause() {
      await this.unpause();
      this.subscribeToEvent(contract.unpauseEvent);
    },
    async handlePause() {
      await this.pause();
      this.subscribeToEvent(contract.pauseEvent);
    },
    async lookupContractStatus() {
      this.contractPaused = await contract.methods.paused().call();
    },
    async ethReq(data) {
      try {
        await ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: this.accounts[0],
                to: USDC_CONTRACT_ADDRESS,
                data: data,
                gasPrice: DEFAULT_GAS_PRICE,
              },
            ],
          });
      } catch (e) {
        console.error(e);
        //show error
      }
    },
    async pause() {  
      await this.ethReq(contract.methods.pause().encodeABI());
    },
    async unpause() {  
      await this.ethReq(contract.methods.unpause().encodeABI());
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/variables/_colors.scss";

.pauser {
  padding: 30px;
  margin: auto;
  width: 40%;
  display: flex;
}

.container {
  padding: 30px;
  margin: auto;
  width: 35%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container-main {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header {
  font-size: 30px;
  font-weight: 900;
  padding-bottom: 3%;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-header {
  font-weight: 800;
  font-size: 24px;
  margin-right: 30px;
}

.content-subtext {
  font-size: 12px;
  font-weight: 800;
  margin-top: 10px;
  text-align: center;
  color: $circle-dark-grey;
}
</style>

