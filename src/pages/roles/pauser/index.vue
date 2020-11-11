<template>
  <div>
    <NavBar />
    <Pauser />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import Pauser from '@/components/PauserControl';

export default {
  components: {
    NavBar,
    Pauser,
  },
};
</script>
