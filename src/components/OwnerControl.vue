<template>
  <div class="owner">
    <div>OWNER CONTROLS: RE-ASSIGN ROLES</div>
    <form @submit.prevent="checkRoles">
       <input placeholder="Enter Wallet Address Here" v-model="address" />
       <button>CHECK ROLES</button>
     </form>
    <div>Current Roles:</div>
    <div class="role-container">
      <div v-if="this.minter">
        <button v-on:click="clickMinter" class="button-colored">
          MINTER
        </button>
      </div>
      <div v-else>
        <button v-on:click="clickMinter" class="button-gray">
          MINTER
        </button>
      </div>
      <div v-if="this.pauser">
        <button v-on:click="clickPauser" class="button-colored">
          PAUSER
        </button>
      </div>
      <div v-else>
        <button v-on:click="clickPauser" class="button-gray">
          PAUSER
        </button>
      </div>
      <div v-if="this.owner">
        <button v-on:click="clickOwner" class="button-colored">
          OWNER
        </button>
      </div>
      <div v-else>
        <button v-on:click="clickOwner" class="button-gray">
          OWNER
        </button>
      </div>
      <div v-if="this.blacklister">
        <button v-on:click="clickBlacklister" class="button-colored">
          BLACKLISTER
        </button>
      </div>
      <div v-else>
        <button v-on:click="clickBlacklister" class="button-gray">
          BLACKLISTER
        </button>
      </div>
    </div>
    <div class="update-button">
      <button v-on:click="updateRoles">SAVE</button>
    </div>
  </div>
</template>

<script>
import { USDC_CONTRACT_ADDRESS, WEB3_BALANCEOF_ADDRESS_LENGTH, BLACKLISTER_ADDRESS } from '@/utils/constants';
import Web3 from 'web3';
import { padHex } from '@/utils/utils';

const web3 = new Web3(Web3.givenProvider);

const abi = [
  {
    constant: true,
    inputs: [{ name: 'account', type: 'address' }],
    name: 'isMinter',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'pauser',
    outputs: [{ name: '', type: 'address' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    type: 'function',
  },
  {
    inputs: [{ name: '_account', type: 'address' }],
    name: 'isBlacklisted',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
];

const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  name: 'Owner',
  data() {
    return {
      address: "",
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
}

.button-colored {
    background-color: #68d7f3;
    margin: 10px;
    color: white;
    font-weight: 700;
    float: left;
}

.button-gray {
    background-color: #d1d1d1;
    margin: 10px;
    color: white;
    font-weight: 700;
    float: left;
}
</style>