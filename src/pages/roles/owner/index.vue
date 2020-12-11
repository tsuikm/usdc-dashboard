<template>
  <div>
    <div class="header">
      Check and Assign Roles
    </div>
    <div class="owner">
      <form
        class="input-form"
        @submit.prevent="checkRoles"
      >
        <CustomInput
          v-model="address"
          :placeholder="'Enter Wallet Address Here'"
        />
        <ActionButton
          :label="'CHECK ROLES'"
          :on-click="checkRoles"
        />
      </form>
      <div class="role-control">
        <div class="role-button-row">
          <RoleButton
            :title="'MASTER MINTER'"
            :role-active="this.masterMinterActive"
            :on-click="toggleMasterMinter"
          />
          <RoleButton
            :title="'PAUSER'"
            :role-active="this.pauserActive"
            :on-click="togglePauser"
          />
          <RoleButton
            :title="'OWNER'"
            :role-active="this.ownerActive"
            :on-click="toggleOwner"
          />
          <RoleButton
            :title="'BLACKLISTER'"
            :role-active="this.blacklisterActive"
            :on-click="toggleBlacklister"
          />
        </div>
        <div class="update-button">
          <ActionButton
            :label="'SAVE'"
            :on-click="this.save"
          />
        </div>
        <div class="error">
          <span v-if="showConnectToMetamaskWarning">
            <md-icon>error</md-icon>Please connect your account to Metamask before proceeding.
          </span>
          <span v-if="noRoles">
            <md-icon>error</md-icon> No roles 
          </span>
          <span v-if="hasRenouncedRoles">
            <md-icon>error</md-icon> Error: Cannot renounce roles. Please assign role to another address.
          </span>
          <span v-if="showOwnerWarning">
            <md-icon>error</md-icon> Error: You are not signed in as the owner of this contract and cannot reassign roles.
          </span>
        </div>
        <ConnectToMetamask ref="connectToMetamaskButton" />
      </div>
    </div>
  </div>
</template>

<script>
import RoleButton from '@/components/RoleButton';
import ActionButton from '@/components/ActionButton';
import CustomInput from '@/components/CustomInput';
import ConnectToMetamask from '@/components/ConnectToMetamask';
import { contract, ethReq } from '@/utils/web3utils';

/*----------------------------------------------------------------------------*
 * Helpers
 *----------------------------------------------------------------------------*/

/**
 * Getters for the addresses of each role (ie. master minter, pauser, owner, blacklister).
 *
 * @returns {String} - as a lowercase hex string.
 */
const getOwner = async () => (await contract.methods.owner().call()).toLowerCase();
const getPauser = async () => (await contract.methods.pauser().call()).toLowerCase();
const getBlacklister = async () => (await contract.methods.blacklister().call()).toLowerCase();
const getMasterMinter = async () => (await contract.methods.masterMinter().call()).toLowerCase();

export default {
  components: {
    RoleButton,
    ConnectToMetamask,
    ActionButton,
    CustomInput,
  },
  data() {
    return {
      address: '',
      masterMinterActive: false,
      pauserActive: false,
      ownerActive: false,
      blacklisterActive: false,
      hasRenouncedRoles: false,
      showOwnerWarning: false,
      noRoles: false,
      showConnectToMetamaskWarning: false,
    };
  },
  methods: {
    async checkRoles() {
      this.hasRenouncedRoles = false;
      this.showOwnerWarning = false;
      this.address = this.address.trim().toLowerCase();

      this.blacklisterActive = this.address === await getBlacklister();
      this.masterMinterActive = this.address === await getMasterMinter();
      this.pauserActive = this.address === await getPauser();
      this.ownerActive = this.address === await getOwner();

      if (!this.blacklisterActive && !this.masterMinterActive && !this.pauserActive && !this.ownerActive) {
        this.noRoles = true;
      }
    },
    toggleMasterMinter() {
      this.masterMinterActive = !this.masterMinterActive;
    },
    togglePauser() {
      this.pauserActive = !this.pauserActive;
    },
    toggleOwner() {
      this.ownerActive = !this.ownerActive;
    },
    toggleBlacklister() {
      this.blacklisterActive = !this.blacklisterActive;
    },
    async save() {
      this.showConnectToMetamaskWarning = !this.$refs.connectToMetamaskButton.selectedAddress;
      if (this.showConnectToMetamaskWarning) {
        return;
      }

      this.address = this.address.trim().toLowerCase();

      const ownerAccount = await getOwner();

      this.showOwnerWarning = this.$refs.connectToMetamaskButton.selectedAddress !== ownerAccount;

      this.hasRenouncedRoles = (!this.pauserActive && await getPauser() === this.address) ||
        (!this.masterMinterActive && await getMasterMinter() === this.address) ||
        (!this.blacklisterActive && await getBlacklister() === this.address) ||
        (!this.ownerActive && await getOwner() === this.address);

      if (this.hasRenouncedRoles || this.showOwnerWarning) {
        return;
      }

      if (this.pauserActive && await getPauser() !== this.address) {
        await ethReq(ownerAccount, contract.methods.updatePauser(this.address).encodeABI());
      }
      if (this.masterMinterActive && await getMasterMinter() !== this.address) {
        await ethReq(ownerAccount, contract.methods.updateMasterMinter(this.address).encodeABI());
      }
      if (this.blacklisterActive && await getBlacklister() !== this.address) {
        await ethReq(ownerAccount, contract.methods.updateBlacklister(this.address).encodeABI());
      }
      if (this.ownerActive && await getOwner() !== this.address) {
        await ethReq(ownerAccount, contract.methods.transferOwnership(this.address).encodeABI());
      }
    },
  },
  head() {
    return {
      title: 'Owner',
    };
  },
};
</script>

<style scoped>
.owner {
  padding: 30px;
  border-radius: 10px;
  width: 60%;
  margin: auto;
}

.header {
  font-size: 30px;
  font-weight: 900;
  padding-bottom: 3%;
  font-family: Proxima Nova;
  line-height: 44px;
}

.input-form {
  font-family: Proxima Nova;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.role-control {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.role-button-row {
  display: flex;
}

.role-container {
  display: flex;
}

.update-button {
  margin-top: 20px;
}

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2%;
}

</style>
