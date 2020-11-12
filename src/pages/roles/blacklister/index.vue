<template>
  <div>
    <NavBar />
    <Blacklister />
  </div>
</template>

<script>
import Blacklister from '@/components/BlacklisterControl';
import NavBar from '@/components/NavBar';

export default {
  components: {
    Blacklister,
    NavBar,
  },
};
</script>
