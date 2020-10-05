<template>
  <div>
    <NavBar />
    <Transactions />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import Transactions from '@/components/Transactions';

export default {
  name: 'Dashboard',
  components: {
    Transactions,
    NavBar
  }
};
</script>