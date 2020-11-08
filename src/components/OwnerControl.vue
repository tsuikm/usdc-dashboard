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
      <div v-if="!hasRoles && address !== ''">
        Address has no roles.
      </div>
      <div class="role-button-row">
        <RoleButton
          :title="this.minterTitle"
          :role-active="this.minter"
          :on-click="clickMinter"
        />
        <RoleButton
          :title="this.pauserTitle"
          :role-active="this.pauser"
          :on-click="clickPauser"
        />
        <RoleButton
          :title="this.ownerTitle"
          :role-active="this.owner"
          :on-click="clickOwner"
        />
        <RoleButton
          :title="this.blacklisterTitle"
          :role-active="this.blacklister"
          :on-click="clickBlacklister"
        />
      </div>
      <div v-if="hasRenouncedRoles">
        ⚠️ Warning: Cannot renounce roles. Please assign role to another address.
      </div>
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
 * [changeRole description]
 * @param {[type]} ownerAccount [description]
 * @param {[type]} contractMethod [description]
 * @param {[type]} address [description]
 * @returns {[type]} [description]
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
      minter: null,
      pauser: null,
      owner: null,
      blacklister: null,
      minterTitle: 'MASTER MINTER',
      pauserTitle: 'PAUSER',
      ownerTitle: 'OWNER',
      blacklisterTitle: 'BLACKLISTER',
      hasRenouncedRoles: null,


      blacklisterAddress: null,
      ownerAddress: null,
      masterMinterAddress: null,
      pauserAddress: null
    };
  },
  computed: {
    hasRoles() {
      // const array = [
      //   this.blacklisterAddress,
      //   this.masterMinterAddress,
      //   this.ownerAddress,
      //   this.pauserAddress
      // ].map(string => string.toLowerCase());
      // console.log(array, this.address.toLowerCase())

      // const hasRoles = array.includes(this.address.toLowerCase());
      // console.log(hasRoles)
      // return hasRoles;
      return true;
    }
  },
  methods: {
    async lookupBlacklisted() {
      this.blacklisterAddress = await contract.methods.blacklister().call();
      this.blacklister = this.address === this.blacklisterAddress;
    },
    async checkIsMinter() {
      this.minterAddress = await contract.methods.masterMinter().call()
      this.minter = this.address === this.minterAddress;
    },
    async checkIsPauser() {
      this.pauserAddress = await contract.methods.pauser().call();
      this.pauser = this.pauserAddress === this.address;
    },
    async checkIsOwner() {
      this.ownerAddress = await contract.methods.owner().call();
      this.owner = this.ownerAddress === this.address;
    },
    checkRoles() {
      this.lookupBlacklisted();
      this.checkIsMinter();
      this.checkIsPauser();
      this.checkIsOwner();
    },
    clickMinter() {
      this.minter = !this.minter;
    },
    clickPauser() {
      this.pauser = !this.pauser;
    },
    clickOwner() {
      this.owner = !this.owner;
    },
    clickBlacklister() {
      this.blacklister= !this.blacklister;
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
      this.checkRoles();
      const accounts = (await ethereum.request({ method: 'eth_requestAccounts' })).map(string => string.toLowerCase());
      const ownerAccount = await contract.methods.owner().call();

      if (!accounts.includes(ownerAccount.toLowerCase())) {
        console.log('You are not the owner');
        return;
      }

      this.hasRenouncedRoles = (!this.pauser && await contract.methods.pauser().call() === this.address) ||
        (!this.minter && await contract.methods.masterMinter().call() === this.address) ||
        (!this.blacklister && await contract.methods.blacklister().call() === this.address) ||
        (!this.owner && await contract.methods.owner().call() === this.address);

      if (this.hasRenouncedRoles) {
        return;
      }


      if (this.pauser && await contract.methods.pauser().call() !== this.address) {
        await this.changeRole(ownerAccount, contract.methods.updatePauser);
      }
      if (this.minter && await contract.methods.masterMinter().call() !== this.address) {
        await this.changeRole(ownerAccount, contract.methods.updateMasterMinter);
      }
      if (this.blacklister && await contract.methods.blacklister().call() !== this.address) {
        await this.changeRole(ownerAccount, contract.methods.updateBlacklister);
      }
      if (this.owner && await contract.methods.owner().call() !== this.address) {
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
