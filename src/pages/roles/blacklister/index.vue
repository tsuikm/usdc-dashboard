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
      <form class="blacklist-form" @submit.prevent="lookupBlacklistStatus">
        <input class="input" v-model="address" placeholder="Enter address here">
        <button class="button" @click="lookupBlacklistStatus">CHECK STATUS</button>
      </form>
      <div class="container-main">
        <div class="content-header">Blacklisted</div>
        <md-switch v-model="isBlacklisted" class="md-primary" @click="handleUnpause"></md-switch>
      </div>
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
      <div class="container-save">
        <button class="button">SAVE</button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
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
  width: 60%;
  margin: auto;
}

.header {
  font-size: 30px;
  font-weight: 900;
  padding-bottom: 3%;
}

.blacklist-form {
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-header {
  font-weight: 800;
  font-size: 24px;
  margin-right: 30px;
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

.input {
  width: 400px;
  height: 50px;
  border-color: #1AA3FF;
  border-style: solid;
  border-radius: 5px;
  border-width: 1px;
  padding: 5px;
  color: #6B6580;
}

.button {
  height: 50px;
  padding-left: 40px;
  padding-right: 40px;
  border-radius: 5px;
  background-color: #1ED67D;
  border: none;
  color: #ffffff;
  font-weight: 900;
  cursor: pointer;
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
