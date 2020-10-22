<template>
  <div>
    <NavBar />
    <TransactionDetails :hash="this.$route.params.transaction" />
  </div>
</template>

<script>

// modules
import NavBar from '@/components/NavBar';
import TransactionDetails from '@/components/TransactionDetails';

export default {
  components: {
    NavBar,
    TransactionDetails,
  },
};
</script>
