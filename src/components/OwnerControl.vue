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
      <!-- <CustomButton 
        :minter="this.minter"
        :pauser="this.pauser"
        :owner="this.owner"
        :blacklister="this.blacklister"
        @update-role="update"
      /> -->
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
// import CustomButton from '@/components/CustomButton';
import RoleButton from '@/components/RoleButton';

const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  name: 'Owner',
  components: {
    // CustomButton,
    RoleButton,
  },
  data() {
    return {
      address: '',
      minter: null,
      pauser: null,
      owner: null,
      blacklister: null,
      updatedMinter: null,
      updatedPauser: null,
      updatedOwner: null,
      updatedBlacklister: null,
      minterTitle: 'MINTER',
      pauserTitle: 'PAUSER',
      ownerTitle: 'OWNER',
      blacklisterTitle: 'BLACKLISTER',
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
      this.updatedMinter = !this.minter;
      console.log('clickMinter');
    },
    clickPauser() {
      this.updatedPauser = !this.pauser;
    },
    clickOwner() {
      this.updatedOwner = !this.owner;
    },
    clickBlacklister() {
      this.updatedBlacklister= !this.blacklister;
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

.role-button-row {
  display: flex;
}

.role-container {
  display: flex;
}
</style>
