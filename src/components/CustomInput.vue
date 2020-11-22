<template>
  <div>
    <input 
      class="input" 
      :placeholder="placeholder" 
      :value="input"
      @input="updateInput($event.target.value)">
  </div>
</template>

<script>
export default {
  name: 'CustomInput',
  props: {
    placeholder: String,
    input: String,
    onClick: Function,
  },
  methods: {
    updateInput(input) {
      this.$emit('input', input);
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/variables/_colors.scss";

.input {
  width: 400px;
  height: 50px;
  border-color: $circle-blue;
  border-style: solid;
  border-radius: 5px;
  border-width: 1px;
  padding: 5px;
  margin-left: 10px;
  margin-right: 10px;
  color: $circle-dark-grey;
}

</style>
