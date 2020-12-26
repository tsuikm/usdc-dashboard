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
        v-if="this.statusChecked && !this.showAddressWarning"
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
        <div class="container-save">
          <ActionButton
            :label="'SAVE'"
            :on-click="save"
          />
        </div>
      </div>
    </div> 
    <div class="error"> 
      <span v-if="showConnectToMetamaskWarning">
        <md-icon>error</md-icon>Please connect your account to Metamask before proceeding.
      </span>
      <span v-if="showBlacklisterWarning">
      <md-icon>error</md-icon> Error: You are not signed in as the blacklister of this contract.
    </span>
      <span v-if="showAddressWarning">
        <md-icon>error</md-icon> Error: Please input a valid address.
      </span>
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
import { web3, contract, ethReq } from '@/utils/web3utils';

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
      showAddressWarning: false,
    };
  },
  methods: {
    async subscribeToEvent(event) {
      contract.once(event, async () => {
        try {
          this.isBlacklisted = await contract.methods
            .isBlacklisted(this.address)
            .call();
          this.originalStatus = this.isBlacklisted;
        } catch (e) {
          console.error(e);
          this.isBlacklisted = null;
        }
      } );


    },
    async handleBlacklist() {
      await this.blacklist(this.address);
      this.subscribeToEvent(contract.blacklistEvent);
    },
    async handleUnblacklist() {
      await this.unBlacklist(this.address);
      this.subscribeToEvent(contract.unBlacklistEvent);
    },
    async lookupBlacklistStatus() {
      this.showConnectToMetamaskWarning = false;
      this.showBlacklisterWarning = false;
      if (this.address === '') {
        this.isBlacklisted = null;
        this.showAddressWarning = true;
        return;
      }
      this.showAddressWarning = false;
      this.address = padHex(this.address, WEB3_BALANCEOF_ADDRESS_LENGTH);
      if (!web3.utils.isAddress(this.address)) {
        this.showAddressWarning = true;
        this.isBlacklisted = null;

      } else {
        try {
          this.isBlacklisted = await contract.methods
            .isBlacklisted(this.address)
            .call();
          this.statusChecked = true;
          this.originalStatus = this.isBlacklisted;
        } catch (e) {
          console.error(e);
          this.isBlacklisted = null;
        }
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
        .isBlacklisted(this.address)
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

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2%;
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
