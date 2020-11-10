<template>
  <div>
    <button 
      :class="{'button-colored': roleActive, 'button-gray': !roleActive, 'button': true}" 
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
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/variables/_colors.scss";

.button {
  margin-bottom: 5px;
  margin: 10px;
  padding: 15px;
  color: white;
  font-weight: 700;
  float: left;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  font-family: Proxima Nova;
}

.button:hover {
  background-color: $circle-dark-grey;
}

.button-colored {
  background-color: $circle-blue;
}

.button-gray {
  background-color: $circle-grey;
}
</style>
