<template>
  <div>
    <div
      class="header"
      data-testid="header"
    >
      Check and Blacklist Addresses
    </div>
    <div class="blacklister">
      <form
        class="blacklist-form"
        @submit.prevent="lookupBlacklistStatus"
      >
        <CustomInput
          v-model="address"
          :placeholder="'Enter address here'"
        />
        <ActionButton
          :label="'CHECK STATUS'"
          :on-click="lookupBlacklistStatus"
        />
      </form>
      <div
        v-if="this.statusChecked"
        class="blacklist-clause"
      > 
        <div
          v-if="this.originalStatus"
          class="status-message"
        >
          Address is currently blacklisted.
        </div>
        <div
          v-else
          class="status-message"
        >
          Address is not currently blacklisted.
        </div>

        <div class="container-main">
          <div class="content-header">
            Blacklist Address
          </div>
          <md-switch
            v-model="isBlacklisted"
            class="md-primary"
            data-testid="toggle"
          />
        </div>
        <div
          v-if="showConnectToMetamaskWarning"
        >
          <md-icon>error</md-icon>Please connect your account to Metamask before proceeding.
        </div>
        <span v-if="showBlacklisterWarning">
          <md-icon>error</md-icon> Error: You are not signed in as the blacklister of this contract.
        </span>
        <div class="container-save">
          <ActionButton
            :label="'SAVE'"
            :on-click="save"
          />
        </div>
      </div>
    </div> 
    <ConnectToMetamask ref="connectToMetamaskButton" />
  </div>
</template>

<script>
import ActionButton from '@/components/ActionButton';
import CustomInput from '@/components/CustomInput';
import ConnectToMetamask from '@/components/ConnectToMetamask';
import {
  WEB3_BALANCEOF_ADDRESS_LENGTH,
} from '@/utils/constants';
import { padHex } from '@/utils/utils';
import { contract, ethReq } from '@/utils/web3utils';

export default {
  name: 'Blacklister',
  components: {
    ActionButton,
    CustomInput,
    ConnectToMetamask,
  },
  data() {
    return {
      address: '',
      isBlacklisted: null,
      accounts: [],
      statusChecked: false,
      originalStatus: false,
      showBlacklisterWarning: false,
      showConnectToMetamaskWarning: false,
    };
  },
  methods: {
    async subscribeToEvent(event) {
      contract.once(event, async () => {
        if (this.address === '') {
          this.isBlacklisted = null;
          return;
        }
        try {
          this.isBlacklisted = await contract.methods
            .isBlacklisted(padHex(this.address, WEB3_BALANCEOF_ADDRESS_LENGTH))
            .call();
        } catch (e) {
          console.error(e);
          this.isBlacklisted = null;
        }
      } );


    },
    async handleBlacklist() {
      await this.blacklist(padHex(this.address, WEB3_BALANCEOF_ADDRESS_LENGTH));
      this.subscribeToEvent(contract.blacklistEvent);
    },
    async handleUnblacklist() {
      await this.unBlacklist(padHex(this.address, WEB3_BALANCEOF_ADDRESS_LENGTH));
      this.subscribeToEvent(contract.unBlacklistEvent);
    },
    async lookupBlacklistStatus() {
      if (this.address === '') {
        this.isBlacklisted = null;
        return;
      }
      try {
        this.isBlacklisted = await contract.methods
          .isBlacklisted(padHex(this.address, WEB3_BALANCEOF_ADDRESS_LENGTH))
          .call();
        this.statusChecked = true;
        this.originalStatus = this.isBlacklisted;
      } catch (e) {
        console.error(e);
        this.isBlacklisted = null;
      }
    },
    async blacklist(address) {  
      await ethReq(this.$refs.connectToMetamaskButton.selectedAddress, contract.methods.blacklist(address).encodeABI());
    },

    async unBlacklist(address) { 
      await ethReq(this.$refs.connectToMetamaskButton.selectedAddress, contract.methods.unBlacklist(address).encodeABI());
    },
    async save() {
      this.showConnectToMetamaskWarning = !this.$refs.connectToMetamaskButton.selectedAddress;
      if (this.showConnectToMetamaskWarning) {
        return;
      }

      const blacklisterAccount = (await contract.methods.blacklister().call()).toLowerCase();
      this.showBlacklisterWarning = this.$refs.connectToMetamaskButton.selectedAddress.toLowerCase() !== blacklisterAccount;

      if (this.showBlacklisterWarning) {
        return;
      }
      const currentStatus = await contract.methods
        .isBlacklisted(padHex(this.address, WEB3_BALANCEOF_ADDRESS_LENGTH))
        .call();
      const localStatus = this.isBlacklisted;

      if (localStatus && currentStatus !== localStatus) { 
        await this.handleBlacklist();
      }
      if (!localStatus && currentStatus !== localStatus) {
        await this.handleUnblacklist();
      }
    },
  },
  head() {
    return {
      title: 'Blacklister',
    };
  },
};
</script>

<style scoped>
.blacklister {
  padding: 30px;
  width: 60%;
  margin: auto;
}

.header {
  font-size: 30px;
  font-weight: 900;
  padding-bottom: 3%;
  line-height: 44px;
}

.blacklist-form {
  display: flex;
  justify-content: center;
  align-items: center;
}

.status-message {
  margin-top: 20px;
}

.content-header {
  font-weight: 800;
  font-size: 20px;
  margin-right: 50px;
}

.container-main {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.container-save {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.blacklist-clause {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
