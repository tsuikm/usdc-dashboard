<template>
  <div class="page">
    <md-button @click="changePage(0)">First</md-button>
    <md-button @click="changePage(page - 1)">
      <md-icon>navigate_before</md-icon>
    </md-button>
    <p>Page {{ page + 1 }} of {{ totalPages }}</p>
    <md-button @click="changePage(page + 1)">
      <md-icon>navigate_next</md-icon>
    </md-button>
    <md-button @click="changePage(totalPages - 1)">Last</md-button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
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
      page = Math.min(this.totalPages - 1, Math.max(page, 0));
      this.page = page;
      this.$emit('page:change', page);
    },
  },
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: row;
}
</style>
