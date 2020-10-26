<template>
  <div>
    <button
      class="button-colored"
      data-testid="minter"
      @click="clickMinter">
        {{ title }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'RoleButton',
  props: {
    testId: String,
    title: String,
  }
}
</script>

<style scoped>
</style>