<template>
  <div class="page">
    <md-button @click="changePage(0)">First</md-button>
    <md-icon class="clickable" @click="changePage(page - 1)"
      >navigate_before</md-icon
    >
    <p>Page {{ page }} of {{ totalPages }}</p>
    <md-icon class="clickable" @click="changePage(page + 1)"
      >navigate_next</md-icon
    >
    <md-button @click="changePage(totalPages)">Last</md-button>
  </div>
</template>

<script>
export default {
  name: "pagination",
  props: {
    totalPages: Number,
  },
  data() {
    return {
      page: 0,
    };
  },
  methods: {
    changePage(page) {
      page = Math.min(this.totalPages, Math.max(page, 0));
      this.page = page;
      this.$emit("page:change", page);
    },
  },
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
}

.page {
  display: flex;
  flex-direction: row;
}
</style>