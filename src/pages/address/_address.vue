<template>
  <div>
    <Overview :walletAddress="this.$route.params.address" />
    <Transactions :address="this.$route.params.address" />
  </div>
</template>

<script>
import Overview from "@/components/Overview";
import Transactions from "@/components/Transactions";
export default {
  components: {
    Overview,
    Transactions,
  },
};
</script>
