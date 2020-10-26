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
      <div class="role-container">
        <div v-if="this.minter">
          <button
            class="button-colored"
            data-testid="minter"
            @click="clickMinter"
          >
            MINTER
          </button>
        </div>
        <div v-else>
          <button
            class="button-gray"
            @click="clickMinter"
          >
            MINTER
          </button>
        </div>
        <div v-if="this.pauser">
          <button
            class="button-colored"
            data-testid="pauser"
            @click="clickPauser"
          >
            PAUSER
          </button>
        </div>
        <div v-else>
          <button
            class="button-gray"
            @click="clickPauser"
          >
            PAUSER
          </button>
        </div>
        <div v-if="this.owner">
          <button
            class="button-colored"
            data-testid="owner"
            @click="clickOwner"
          >
            OWNER
          </button>
        </div>
        <div v-else>
          <button
            class="button-gray"
            @click="clickOwner"
          >
            OWNER
          </button>
        </div>
        <div v-if="this.blacklister">
          <button
            class="button-colored"
            data-testid="blacklister"
            @click="clickBlacklister"
          >
            BLACKLISTER
          </button>
        </div>
        <div v-else>
          <button
            class="button-gray"
            @click="clickBlacklister"
          >
            BLACKLISTER
          </button>
        </div>
      </div>
      <div class="update-button">
        <md-button @click="updateRoles">
          SAVE
        </md-button>
      </div>
    </div>
  </div>
</template>

<script>
import { USDC_CONTRACT_ADDRESS, WEB3_BALANCEOF_ADDRESS_LENGTH, BLACKLISTER_ADDRESS } from '@/utils/constants';
import Web3 from 'web3';
import { padHex } from '@/utils/utils';
import { abi } from '@/utils/web3abi';

const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  name: 'Owner',
  data() {
    return {
      address: '',
      minter: null,
      pauser: null,
      owner: null,
      blacklister: null,
      newMinter: null,
      newPauser: null,
      newOwner: null,
      newBlacklister: null,
    };
  },
  methods: {
    async lookupBlacklisted() {
      if (this.address === '') {
        return;
      }
      this.blacklister = this.address === BLACKLISTER_ADDRESS;
      this.newBlacklister = this.blacklister;
    },
    async checkIsMinter() {
      this.minter = await contract.methods.isMinter(this.address).call();
      this.newMinter = this.minter;
    },
    async checkIsPauser() {
      const pauserAddress = await contract.methods.pauser().call();
      this.pauser = pauserAddress === this.address;
      this.newPauser = this.pauser;
    },
    async checkIsOwner() {
      const owner = await contract.methods.owner().call();
      const ownerAddress = padHex(owner, WEB3_BALANCEOF_ADDRESS_LENGTH);
      this.owner = ownerAddress === this.address;
      this.newOwner = this.owner;
    },
    checkRoles() {
      this.lookupBlacklisted();
      this.checkIsMinter();
      this.checkIsPauser();
      this.checkIsOwner();
    },
    clickMinter() {
      this.newMinter = !this.newMinter;
    },
    clickPauser() {
      this.newPauser = !this.newPauser;
    },
    clickOwner() {
      this.newOwner = !this.newOwner;
    },
    clickBlacklister() {
      this.newBlacklister = !this.blacklister;
    },
    updateRoles() {
      if (this.minter === true && this.newMinter === false) {
        //unminter the address
      }
      if (this.minter === false && this.newMinter === true) {
        //create minter
      }
      if (this.pauser === true && this.newPauser=== false) {
        //unpauser the address
      }
      if (this.pauser === false && this.newPauser === true) {
        //create pauser 
      }
      if (this.owner === true && this.newOwner=== false) {
        //unowner the address
      }
      if (this.owner === false && this.newOwner === true) {
        //create owner
      }
      if (this.blacklister === true && this.newBlacklister=== false) {
        //unblacklister the address
        this.blacklister = false;
      }
      if (this.blacklister === false && this.newBlacklister === true) {
        //create blacklister
        this.blacklister = true;
      }
    },
  },
};
</script>

<style scoped>
.owner {
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

.role-control {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.role-container {
  display: flex;
}

.button-colored {
  background-color: #68d7f3;
  margin: 10px;
  padding: 15px;
  color: white;
  font-weight: 700;
  float: left;
  border-radius: 25px;
  border: none;
}

.button-gray {
  background-color: #d1d1d1;
  margin: 10px;
  padding: 15px;
  color: white;
  font-weight: 700;
  float: left;
  border-radius: 25px;
  border: none;
}
</style>
