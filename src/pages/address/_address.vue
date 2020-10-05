<template>
  <div>
    <NavBar />
    <Overview :walletAddress="this.$route.params.address" />
    <Transactions :address="this.$route.params.address" />
  </div>
</template>

<script>
import Overview from "@/components/Overview";
import Transactions from "@/components/Transactions";
import NavBar from '@/components/NavBar';

export default {
  components: {
    Overview,
    Transactions,
    NavBar
  },
};
</script>
