<template>
  <div class="page">
    <md-button :disabled="disabled" class="button md-icon-button" @click="changePage(0)">
      First
    </md-button>
    <md-button :disabled="disabled" class="button md-icon-button" @click="changePage(page - 1)">
      <md-icon>navigate_before</md-icon>
    </md-button>
    <p>Page {{ page + 1 }} of {{ totalPages }}</p>
    <md-button :disabled="disabled" class="button md-icon-button" @click="changePage(page + 1)">
      <md-icon>navigate_next</md-icon>
    </md-button>
    <md-button  :disabled="disabled" class="button md-icon-button" @click="changePage(totalPages - 1)">
      Last
    </md-button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    totalPages: Number,
    disabled: Boolean
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
  font-size: 13px;
  align-items: center;
}

.button {
  font-size: 13px;
  text-transform: none;
  align-items: center;
}
</style>
