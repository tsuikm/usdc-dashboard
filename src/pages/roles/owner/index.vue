<template>
  <div>
    <NavBar />
    <Owner />
  </div>
</template>

<script>
import Owner from '@/components/OwnerControl';
import NavBar from '@/components/NavBar';

export default {
  components: {
    Owner,
    NavBar,
  },
};
</script>
