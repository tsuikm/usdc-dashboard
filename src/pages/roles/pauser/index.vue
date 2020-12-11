<template>
  <div>
    <div class="header">
      Pause and Unpause Contract
    </div>
    <div class="container">
      <div class="container-main">
        <div class="content-header">
          Pause Contract
        </div>
        <md-switch 
          v-model="contractPaused"
          class="md-primary"
          data-testid="toggle"
        />
      </div>
      <div class="content-subtext">
        Pausing prevents transfers, minting, and burning.
      </div>
      <ActionButton
        :label="'SAVE'"
        :on-click="save"
      />
      <span
        v-if="showConnectToMetamaskWarning"
        class="error-msg"
      >
        <md-icon>error</md-icon> Please connect your account to Metamask before proceeding.
      </span>
      <span
        v-if="showPauserWarning"
        class="error-msg"
      >
        <md-icon>error</md-icon> Error: You are not signed in as the pauser of this contract.
      </span>
    </div>
    <ConnectToMetamask ref="connectToMetamaskButton" />
  </div>
</template>

<script>
import ActionButton from '@/components/ActionButton';
import ConnectToMetamask from '@/components/ConnectToMetamask';
import { contract, ethReq } from '@/utils/web3utils';

export default {
  components: {
    ActionButton,
    ConnectToMetamask,
  },
  data() {
    return {
      contractPaused: null,
      accounts: [],
      showPauserWarning: false,
      showConnectToMetamaskWarning: false,
    };
  },
  created: function() {
    this.lookupContractStatus();
  },
  methods: {
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
    async pause() {  
      await ethReq(this.$refs.connectToMetamaskButton.selectedAddress, contract.methods.unpause().encodeABI());
    },
    async unpause() {  
      await ethReq(this.$refs.connectToMetamaskButton.selectedAddress, contract.methods.pause().encodeABI());
    },
    async save() {
      this.showConnectToMetamaskWarning = !this.$refs.connectToMetamaskButton.selectedAddress;
      if (this.showConnectToMetamaskWarning) {
        return;
      }

      const pauserAccount = (await contract.methods.pauser().call()).toLowerCase();
      this.showPauserWarning = this.$refs.connectToMetamaskButton.selectedAddress !== pauserAccount;

      if (this.showPauserWarning) {
        return;
      }

      const currentStatus = await contract.methods.paused().call();
      const localStatus = this.contractPaused;

      if (localStatus && currentStatus !== localStatus) {
        await this.handlePause();
      }
      if (!localStatus && currentStatus !== localStatus) {
        await this.handleUnpause();
      }
    },
  },
  head() {
    return {
      title: 'Pauser',
    };
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/variables/_colors.scss";

.container {
  padding: 30px;
  margin: auto;
  width: 50%;
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
  line-height: 44px;
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
  margin-bottom: 20px;
  text-align: center;
  color: $circle-dark-grey;
}

.error-msg {
  margin-bottom: 25px;
}

</style>

