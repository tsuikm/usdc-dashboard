<template>
  <div>
    <NavBar />
    <AddressPage
      :roles="[]"
      :is-blacklisted="false"
      :balance="this.balance"
      :address="this.address"
    />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import AddressPage from '@/components/AddressDetails';
import { getBalance } from '@/utils/solana';

export default {
  components: {
    NavBar,
    AddressPage,
  },
  data() {
    return {
      balance: null,
      address: null,
    };
  },
  async mounted() {
    this.address = this.$route.params.address;

    await Promise.all([
      this.lookupBalance(),
    ]);
  },
  methods: {
    async lookupBalance() {
      this.balance = (await getBalance(this.address)).result.value;
    },
  },
  head() {
    return {
      title: `Address: ${this.$route.params.address}`,
    };
  },
};
</script>

<style scoped>

</style>
