<template>
  <div>
    <Pauser />
    <Owner />
    <Blacklister />
  </div>
</template>

<script>
import Pauser from '@/components/PauserControl';
import Owner from '@/components/OwnerControl';
import Blacklister from '@/components/BlacklisterControl';

export default {
  components: {
    Pauser,
    Owner,
    Blacklister,
  },
};
</script>