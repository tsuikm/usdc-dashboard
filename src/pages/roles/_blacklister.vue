<template>
  <div class="blacklister">
    <div>BLACKLISTER CONTROLS: BLACKLIST ADDRESS</div>
    <form @submit="blacklist">
       <input placeholder="Enter Wallet Address Here" v-model="address" />
       <button type="submit.prevent">BLACKLIST</button>
     </form>
  </div>
</template>

<script>

export default {
  name: 'Blacklister',
  data() {
    return {
      address: "",
    };
  },
  methods: {
    blacklist() {
      //TODO: change blacklist status
    },
  },
};
</script>

<style scoped>
.blacklister {
  padding: 30px;
  margin: 40px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
}
</style>