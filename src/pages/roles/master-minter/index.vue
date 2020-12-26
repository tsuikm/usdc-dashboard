<template>
  <div>
    <div
      class="header"
      data-testid="header"
    >
      Check and Configure Minters
    </div>
    <div class="master-minter">
      <form
        class="minter-form"
        @submit.prevent="lookupMinterStatus"
      >
        <CustomInput
          v-model="address"
          :placeholder="'Enter address here'"
        />
        <ActionButton
          :label="'CHECK STATUS'"
          :on-click="lookupMinterStatus"
        />
      </form>
      <div
        v-if="this.isMinter && this.minterAllowance !== null"
        class="minter-clause"
      > 
        <div class="status-message"> 
          This address is currently a minter with allowance {{ this.minterAllowance }}. 
        </div>
        <div
          class="minter-form"
        >
          <CustomInput
            v-model="allowance"
            :placeholder="'Allowance: i.e. 0'"
          />
          <ActionButton
            :label="'INCREASE ALLOWANCE'"
            :on-click="configureMinter"
          />
        </div>
        <div class="button">
          <ActionButton
            :label="'REMOVE MINTER'"
            :on-click="removeMinter"
          />
        </div>
      </div>
      <div
        v-else-if="this.isMinter === false && !this.showAddressWarning"
        class="minter-clause"
      > 
        <div class="status-message">
          This address is not currently a minter.
        </div>
        <div
          class="minter-form"
        >
          <CustomInput
            v-model="allowance"
            :placeholder="'Allowance: i.e. 0'"
          />
          <ActionButton
            :label="'CONFIGURE MINTER'"
            :on-click="configureMinter"
          />
        </div>
      </div>
      <div class="error">
        <span v-if="showConnectToMetamaskWarning">
          <md-icon>error</md-icon>Please connect your account to Metamask before proceeding.
        </span>
        <span v-if="showMasterMinterWarning">
          <md-icon>error</md-icon> Error: You are not signed in as the master minter of this contract.
        </span>
        <span v-if="showAddressWarning">
          <md-icon>error</md-icon> Error: Please input a valid address.
        </span>
        <span v-if="showAmountWarning">
          <md-icon>error</md-icon> Error: Please input a valid amount.
        </span>
      </div>
      <ConnectToMetamask ref="connectToMetamaskButton" />
    </div>
  </div>
</template>

<script>
import ActionButton from '@/components/ActionButton';
import CustomInput from '@/components/CustomInput';
import ConnectToMetamask from '@/components/ConnectToMetamask';
import {
  USDC_CONTRACT_ADDRESS,
  WEB3_BALANCEOF_ADDRESS_LENGTH,
  WEB3_PROVIDER,
} from '@/utils/constants';
import Web3 from 'web3';
import { padHex } from '@/utils/utils';
import { abi, ethReq } from '@/utils/web3utils';

const web3 = new Web3(WEB3_PROVIDER || Web3.givenProvider);
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  name: 'MasterMinterControl',
  components: {
    ActionButton,
    CustomInput,
    ConnectToMetamask,
  },
  data() {
    return {
      address: '',
      allowance: 0,
      isMinter: null,
      minterAllowance: null,
      accounts: [],
      showMasterMinterWarning: false,
      showConnectToMetamaskWarning: false,
      showAddressWarning: false,
      showAmountWarning: false,
    };
  },
  methods: {
    async subscribeToEvent(event) {
      contract.once(event, async () => {
        try {
          this.isMinter = await contract.methods
            .isMinter(this.address)
            .call();
          if (this.isMinter) {
            this.minterAllowance = await contract.methods
              .minterAllowance(this.address)
              .call();
          }
        } catch (e) {
          console.error(e);
          this.isMinter = null;
        }
      } );


    },
    async checkMasterMinter() {
      const masterMinterAccount = (await contract.methods.masterMinter().call()).toLowerCase();
      this.showMasterMinterWarning = this.$refs.connectToMetamaskButton.selectedAddress.toLowerCase() !== masterMinterAccount; 
    },
    checkConnectedToMetamask() {
      this.showConnectToMetamaskWarning = !this.$refs.connectToMetamaskButton.selectedAddress;
    },
    async removeMinter() {
      this.checkConnectedToMetamask();

      if (this.showConnectToMetamaskWarning) {
        return;
      }

      await this.checkMasterMinter();

      if (this.showMasterMinterWarning) {
        return;
      }

      await ethReq(this.$refs.connectToMetamaskButton.selectedAddress, contract.methods.removeMinter(this.address).encodeABI());
      this.subscribeToEvent(contract.removeMinterEvent);
    },
    async configureMinter() {
      this.checkConnectedToMetamask();

      if (this.showConnectToMetamaskWarning) {
        return;
      }

      await this.checkMasterMinter();

      if (this.showMasterMinterWarning) {
        return;
      }

      if (isNaN(this.allowance)) {
        this.showAmountWarning = true;
        return;
      }
      this.showAmountWarning = false;
      await ethReq(this.$refs.connectToMetamaskButton.selectedAddress, contract.methods.configureMinter(this.address, this.allowance).encodeABI());
      this.subscribeToEvent(contract.configureMinterEvent);
    },
    async lookupMinterStatus() {
      this.showConnectToMetamaskWarning = false;
      this.showMasterMinterWarning = false;
      if (this.address === '') {
        this.isMinter = null;
        this.showAddressWarning = true;
        return;
      }
      this.showAddressWarning = false;
      this.address = padHex(this.address, WEB3_BALANCEOF_ADDRESS_LENGTH);
      if (!web3.utils.isAddress(this.address)) {
        this.showAddressWarning = true;
        return;
      }
      try {
        this.isMinter = await contract.methods
          .isMinter(this.address)
          .call();
        if (this.isMinter) {
          this.minterAllowance = await contract.methods
            .minterAllowance(this.address)
            .call();
        }
      } catch (e) {
        console.error(e);
        this.isMinter = null;
      }
    },
  },
  head() {
    return {
      title: 'Master Minter',
    };
  },
};
</script>

<style scoped>
.master-minter {
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

.minter-clause {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.minter-form {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button {
  margin-top: 20px;
}

.status-message {
  margin-top: 20px;
  margin-bottom: 20px;
}

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2%;
}

</style>
