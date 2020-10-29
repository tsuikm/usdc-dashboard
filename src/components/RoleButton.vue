<template>
  <div>
    <button 
      :class="{'button-colored': roleActive, 'button-gray': !roleActive}" 
      @click="onClick"
      >
      {{ title }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'RoleButton',
  props: {
    title: String,
    roleActive: Boolean,
    onClick: {
      type: Function,
    }
  },
}
</script>

<style scoped>
.button {
  margin-bottom: 5px;
}

.button-colored {
  background-color: #68d7f3;
  margin: 10px;
  padding: 15px;
  color: white;
  font-weight: 700;
  float: left;
  border-radius: 25px;
  /* border: none; */
}

.button-gray {
  background-color: #d1d1d1;
  margin: 10px;
  padding: 15px;
  color: white;
  font-weight: 700;
  float: left;
  border-radius: 25px;
  /* border: none; */
}
</style>