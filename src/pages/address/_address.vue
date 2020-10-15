<template>
  <div>
    <NavBar />
    <Overview :wallet-address="this.$route.params.address" />
    <Transactions :address="this.$route.params.address" />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import Overview from '@/components/Overview';
import Transactions from '@/components/Transactions';

export default {
  components: {
    Overview,
    Transactions,
    NavBar,
  },
};
</script>
