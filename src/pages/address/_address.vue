<template>
  <div>
    <NavBar />
    <AddressPage 
      :roles="this.roles" 
      :isBlacklisted="this.isBlacklisted"
      :balance="this.balance"
    />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import AddressPage from '@/components/AddressPage';
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import { padHex } from '@/utils/utils';
import { contract, getBalance } from '@/utils/web3utils';

export default {
  components: {
    NavBar,
    AddressPage,
  },
  data() {
    return {
      balance: null,
      isBlacklisted: false,
      roles: [],
      transactions: [],
    };
  },
  created: function () {
    this.lookupBalance();
    this.lookupBlacklisted();
    this.checkRoles();
  },
  methods: {
    async lookupBalance() {
      if (this.$route.params.address === '') {
        return;
      }

      this.balance = await getBalance(this.$route.params.address);
    },
    async lookupBlacklisted() {
      if (this.$route.params.address === '') {
        return;
      }

      this.isBlacklisted = await contract.methods
        .isBlacklisted(
          padHex(this.$route.params.address, WEB3_BALANCEOF_ADDRESS_LENGTH),
        )
        .call();
    },
    async checkRoles() {
      if (await contract.methods.isMinter(this.$route.params.address).call()) {
        this.roles.push('minter');
      };
      const pauserAddress = await contract.methods.pauser().call();
      if (pauserAddress === this.$route.params.address) {
        this.roles.push('pauser');
      };
      const owner = await contract.methods.owner().call();
      const ownerAddress = padHex(owner, WEB3_BALANCEOF_ADDRESS_LENGTH);
      if (ownerAddress === this.$route.params.address) {
        this.roles.push('owner');
      };
    },
  },
};
</script>
