<template>
  <div class="owner">
    <div class="header">
      Check and Assign Roles
    </div>
    <form @submit.prevent="checkRoles">
      <md-field class="input-form">
        <md-input
          v-model="address"
          placeholder="Enter Wallet Address Here"
        />
        <md-button @click="checkRoles">
          CHECK ROLES
        </md-button>
      </md-field>
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
      <span v-if="hasRenouncedRoles">
        <md-icon>warning</md-icon>Warning: Cannot renounce roles. Please assign role to another address.
      </span>
      <span v-if="showOwnerWarning">
        <md-icon>warning</md-icon> Warning: You are not the owner of this contract.
      </span>
      <div class="update-button">
        <md-button @click="this.save">
          SAVE
        </md-button>
      </div>
    </div>
  </div>
</template>

<script>
import { USDC_CONTRACT_ADDRESS, WEB3_BALANCEOF_ADDRESS_LENGTH, DEFAULT_GAS_PRICE } from '@/utils/constants';
import Web3 from 'web3';
import { padHex } from '@/utils/utils';
import { abi } from '@/utils/web3abi';
import RoleButton from '@/components/RoleButton';

const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

/*----------------------------------------------------------------------------*
 * Helpers
 *----------------------------------------------------------------------------*/

/**
 * Getters for the addresses of each role (ie. master minter, pauser, owner, blacklister).
 *
 * @returns {String} - as a lowercase hex string.
 */
async function getOwner() { return contract.methods.owner().call(); }
async function getPauser() { return contract.methods.pauser().call(); }
async function getBlacklister() { return contract.methods.blacklister().call(); }
async function getMasterMinter() { return contract.methods.masterMinter().call(); }

/**
 * Changes the owner/pauser/blacklister/master minter.
 *
 * @param {String} ownerAccount - the owner's account.
 * @param {String} contractMethod - the abi method that changes the role.
 * @param {String} address - the address to assign the role to.
 */
async function changeRole(ownerAccount, contractMethod, address) {
  await ethereum.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: ownerAccount,
        to: USDC_CONTRACT_ADDRESS,
        data: contractMethod(address).encodeABI(),
        gasPrice: DEFAULT_GAS_PRICE
      },
    ],
  });
}

//----------------------------------------------------------------------------------------

export default {
  name: 'Owner',
  components: {
    RoleButton,
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
    };
  },
  methods: {
    checkRoles() {
      this.blacklisterActive = this.address === await contract.methods.blacklister().call()
      this.masterMinterActive = this.address === await contract.methods.masterMinter().call();
      this.pauserActive = this.pauserAddress === await contract.methods.pauser().call();
      this.ownerActive = this.ownerAddress === await contract.methods.owner().call();
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
    async changeRole(ownerAccount, method) {
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: ownerAccount,
            to: USDC_CONTRACT_ADDRESS,
            data: method(this.address).encodeABI(),
            gasPrice: DEFAULT_GAS_PRICE
          },
        ],
      });
    },
    async save() {
      const accounts = (await ethereum.request({ method: 'eth_requestAccounts' })).map(string => string.toLowerCase());
      const ownerAccount = await contract.methods.owner().call();

      this.showOwnerWarning = !accounts.includes(ownerAccount.toLowerCase())

      if (this.showOwnerWarning) {
        return;
      }

      this.hasRenouncedRoles = (!this.pauserActive && await contract.methods.pauser().call() === this.address) ||
        (!this.masterMinterActive && await contract.methods.masterMinter().call() === this.address) ||
        (!this.blacklisterActive && await contract.methods.blacklister().call() === this.address) ||
        (!this.ownerActive && await contract.methods.owner().call() === this.address);

      if (this.hasRenouncedRoles) {
        return;
      }


      if (this.pauserActive && await contract.methods.pauser().call() !== this.address) {
        await this.changeRole(ownerAccount, contract.methods.updatePauser);
      }
      if (this.masterMinterActive && await contract.methods.masterMinter().call() !== this.address) {
        await this.changeRole(ownerAccount, contract.methods.updateMasterMinter);
      }
      if (this.blacklisterActive && await contract.methods.blacklister().call() !== this.address) {
        await this.changeRole(ownerAccount, contract.methods.updateBlacklister);
      }
      if (this.ownerActive && await contract.methods.owner().call() !== this.address) {
        await this.changeRole(ownerAccount, contract.methods.transferOwnership);
      }

    }
  },
};
</script>

<style scoped>
.owner {
  padding: 30px;
  margin: 40px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  width: 60%;
}

.header {
  font-size: 20px;
  font-weight: 900;
  padding-bottom: 3%;
}

.input-form {
  align-items: center;
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
</style>
