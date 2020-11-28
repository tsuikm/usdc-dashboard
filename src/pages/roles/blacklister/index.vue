<template>
  <div>
    <NavBar />
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
          class="blacklist-message"
        >
          Address is currently blacklisted.
        </div>
        <div
          v-else
          class="blacklist-message"
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
      <ConnectToMetamask ref="connectToMetamaskButton" />
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import ActionButton from '@/components/ActionButton';
import CustomInput from '@/components/CustomInput';
import ConnectToMetamask from '@/components/ConnectToMetamask';
import {
  USDC_CONTRACT_ADDRESS,
  WEB3_BALANCEOF_ADDRESS_LENGTH,
  DEFAULT_GAS_PRICE, 
} from '@/utils/constants';
import { padHex } from '@/utils/utils';
import { contract } from '@/utils/web3utils';

export default {
  name: 'Blacklister',
  components: {
    NavBar,
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
    };
  },
  created: function() {
    this.connectMetamask();
  },
  methods: {
    async connectMetamask() {
      this.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    },
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
      await this.blacklist(this.address);
      this.subscribeToEvent(contract.blacklistEvent);
    },
    async handleUnblacklist() {
      await this.unBlacklist(this.address);
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
    async blacklist(address) {  
      await this.ethReq(contract.methods.blacklist(address).encodeABI());
    },

    async unBlacklist(address) { 
      await this.ethReq(contract.methods.unBlacklist(address).encodeABI());
    },
    async save() {
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

.blacklist-message {
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
