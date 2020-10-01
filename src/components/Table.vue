<template>
  <md-table md-card>
    <md-table-toolbar>
      <h1 class="md-title">{{ name }}</h1>
      <Pagination
        :totalPages="Math.ceil(this.totalItems / pageLength)"
        @page:change="this.pageChange"
      />
    </md-table-toolbar>

    <md-table-row>
      <md-table-head v-for="(_, field) in schema" :key="field">{{
        field
      }}</md-table-head>
    </md-table-row>

    <md-table-row
      v-for="item in content.slice(page * 25, (page + 1) * 25)"
      :key="item[keyField]"
    >
      <md-table-cell v-for="(_, field) in schema" :key="field">
        {{ schema[field](item) }}
      </md-table-cell>
    </md-table-row>
  </md-table>
</template>

<script>
import Pagination from "./Pagination";

export default {
  name: "Table",
  components: {
    Pagination,
  },
  data() {
    return {
      page: 0,
      pageLength: 25,
    };
  },
  methods: {
    pageChange(page) {
      this.page = page;
      this.$emit("page:change", page);
    },
  },
  props: {
    name: String,

    // This number can change. Passed directly to Pagination.
    totalItems: Number,

    // Maps column name to a getter function of each item of the row.
    // For instance: schema {
    //    age: function(transaction) { return transaction.age; }
    //
    // }
    schema: Object,

    // Name of field that should be used as key
    keyField: String,

    // Array of the 'content' in the table. Can dynamically change.
    // For instance: [{age: 100, to: ...}, {age: 0, to: ...}, ...]
    content: Array,
  },
};
</script>
