<template>
  <div>
    <NavBar />
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
    </div>
    <ConnectToMetamask />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import ActionButton from '@/components/ActionButton';
import ConnectToMetamask from '@/components/ConnectToMetamask';
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE } from '@/utils/constants';
import { contract } from '@/utils/web3utils';

export default {
  components: {
    NavBar,
    ActionButton,
    ConnectToMetamask,
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
      console.log('unpauses');
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
    async save() {
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
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/variables/_colors.scss";

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
  margin-bottom: 20px;
  text-align: center;
  color: $circle-dark-grey;
}

</style>

