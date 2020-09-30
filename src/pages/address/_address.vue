<template>
  <div>
    <Overview :walletAddress="this.$route.params.address" />
    <TransactionTable v-bind:walletAddress="this.$route.params.address" />
  </div>
</template>

<script>
import Overview from "@/components/Overview";
import TransactionTable from "@/components/TransactionTable";
export default {
  components: {
    Overview,
    TransactionTable,
  }
};
</script>
