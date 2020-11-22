<template>
  <div>
    <button class="button" @click="onClick">{{ label }}</button>
  </div>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    label: String,
    onClick: Function,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/variables/_colors.scss";

.button {
  height: 50px;
  padding-left: 40px;
  padding-right: 40px;
  border-radius: 5px;
  background-color: $circle-green;
  border: none;
  color: #ffffff;
  font-weight: 900;
  cursor: pointer;
}

</style>
