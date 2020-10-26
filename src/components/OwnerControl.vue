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
      <CustomButton 
        :minter="this.minter"
        :pauser="this.pauser"
        :owner="this.owner"
        :blacklister="this.blacklister"
        @update-role="update"
      />
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
import CustomButton from '@/components/CustomButton';

const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  name: 'Owner',
  components: {
    CustomButton,
  },
  data() {
    return {
      address: '',
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
    update(minter, pauser, owner, blacklister) {
      this.minter = minter;
      this.pauser = pauser;
      this.owner = owner;
      this.blacklister = blacklister;
    },
    updateRoles() {
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

.role-container {
  display: flex;
}
</style>
