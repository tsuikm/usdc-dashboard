<template>
  <div>
    <NavBar />
  </div>
</template>

<script>

// modules
import NavBar from '@/components/NavBar';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider);

export default {
  components: {
    NavBar
  },
  data() {
    return {
    };
  },
  async created() {
  },
  methods: {
  }
  };
</script>
