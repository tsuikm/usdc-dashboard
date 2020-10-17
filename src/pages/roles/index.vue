<template>
  <div>
    <Pauser />
    <Owner />
    <Blacklister />
  </div>
</template>

<script>
import Pauser from '@/pages/roles/_pauser';
import Owner from '@/pages/roles/_owner';
import Blacklister from '@/pages/roles/_blacklister';

export default {
  components: {
    Pauser,
    Owner,
    Blacklister,
  },
};
</script>