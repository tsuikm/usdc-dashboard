<template>
  <div class="owner">
    <div>OWNER CONTROLS: RE-ASSIGN ROLES</div>
    <form @submit="checkRoles">
       <input placeholder="Enter Wallet Address Here" v-model="address" />
       <button type="submit.prevent">CHECK ROLES</button>
     </form>
    <div>Current Roles:</div>
    <div class="role-container">
      <div v-if="this.minter">
        <md-chip class="chip-colored">
          MINTER
        </md-chip>
      </div>
      <div v-else>
        <md-chip class="chip-gray">
          MINTER
        </md-chip>
      </div>
      <div v-if="this.pauser">
        <md-chip class="chip-colored">
          PAUSER
        </md-chip>
      </div>
      <div v-else>
        <md-chip class="chip-gray">
          PAUSER
        </md-chip>
      </div>
      <div v-if="this.owner">
        <md-chip class="chip-colored">
          OWNER
        </md-chip>
      </div>
      <div v-else>
        <md-chip class="chip-gray">
          OWNER
        </md-chip>
      </div>
      <div v-if="this.blacklister">
        <md-chip class="chip">
          BLACKLISTER
        </md-chip>
      </div>
      <div v-else>
        <md-chip class="chip-gray">
          BLACKLISTER
        </md-chip>
      </div>
    </div>
    <div class="update-button">
      <button type="submit.prevent">UPDATE ROLES</button>
    </div>
  </div>
</template>

<script>
import { USDC_CONTRACT_ADDRESS } from '@/utils/constants';
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
    };
  },
  methods: {
    async lookupBlacklisted() {
      if (this.address === '') {
        return;
      }

      this.blacklister = await contract.methods
        .isBlacklisted(
          padHex(this.address, WEB3_BALANCEOF_ADDRESS_LENGTH),
        )
        .call();
    },
    async checkIsMinter() {
      this.minter = await contract.methods.isMinter(this.address).call();
    },
    async checkIsPauser() {
      const pauserAddress = await contract.methods.pauser().call();
      this.pauser = pauserAddress === this.address;
    },
    async checkIsOwner() {
      const owner = await contract.methods.owner().call();
      const ownerAddress = padHex(owner, WEB3_BALANCEOF_ADDRESS_LENGTH);
      this.owner = ownerAddress === this.address;
    },
    checkRoles() {
      //submit is not correctly calling function
      console.log('called');
      this.lookupBlacklisted();
      this.checkIsMinter();
      this.checkIsPauser();
      this.checkIsOwner();
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

.chip-colored {
    background-color: #68d7f3;
    margin: 10px;
    color: white;
    font-weight: 700;
    float: left;
}

.chip-gray {
    background-color: #d1d1d1;
    margin: 10px;
    color: white;
    font-weight: 700;
    float: left;
}
</style>