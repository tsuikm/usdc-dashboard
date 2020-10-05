<template>
  <div>
    <NavBar />
    <Transactions />
  </div>
</template>

<script>
import Web3 from 'web3';
import NavBar from '@/components/NavBar';
import Transactions from '@/components/Transactions';

const web3 = new Web3(Web3.givenProvider);

export default {
  name: 'Dashboard',
  components: {
    Transactions,
    NavBar
  }
};
</script>