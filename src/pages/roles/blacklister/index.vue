<template>
  <div>
    <NavBar />
    <div class="blacklister">
      <div
        class="header"
        data-testid="header"
      >
        Check and Blacklist Addresses
      </div>
      <form @submit.prevent="lookupBlacklistStatus">
        <md-field class="input-form">
          <md-input
            v-model="address"
            class="input"
            placeholder="Enter address here"
          />
          <md-button
            class="button"
            @click="lookupBlacklistStatus"
          >
            CHECK STATUS
          </md-button>
        </md-field>
      </form>
      <div
        v-if="this.isBlacklisted"
        class="blacklist-clause"
      > 
        <div> This address is currently blacklisted. </div>
        <md-button @click="handleUnblacklist">
          UNBLACKLIST
        </md-button>
        <div> Click to unblacklist. </div>
      </div>
      <div
        v-else-if="this.isBlacklisted === false"
        class="blacklist-clause"
      > 
        <div> This address is not currently blacklisted. </div>
        <md-button @click="handleBlacklist">
          BLACKLIST
        </md-button>
        <div> Click to blacklist. </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import ActionButton from '@/components/ActionButton';
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
  },
  data() {
    return {
      address: '',
      isBlacklisted: null,
      accounts: [],
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
  },
};
</script>

<style scoped>
.blacklister {
  padding: 30px;
  margin: 40px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  width: 50%;
}

.header {
  font-size: 20px;
  font-weight: 900;
  padding-bottom: 3%;
}

.button {
  margin-bottom: 5px;
}

.input-form {
  align-items: center;
}

.blacklist-clause {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
