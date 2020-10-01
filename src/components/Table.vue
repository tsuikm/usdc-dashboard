<template>
  <md-table md-card>
    <md-table-toolbar>
      <h1 class="md-title">{{ name }}</h1>
      <Pagination v-bind:totalPages="{{ totalPages }}" @page:change="this.pageChange"/>
    </md-table-toolbar>

    <md-table-row>
      <md-table-head v-for="title in schema">{{title}}</md-table-head>
    </md-table-row>

    <md-table-row v-for="item in content" :key="item.id">
      <md-table-head v-for="title in schema">{{schema[title](item)}}</md-table-head>
    </md-table-row>

  </md-table>
</template>

<script>
import Pagination from "./Pagination";

export default {
  name: 'Table',
  components: {
    Pagination
  },
  props: {
    name: String,

    // This number can change. Passed directly to Pagination.
    totalPages: Number,

    // Maps column name to a getter function of each item of the row.
    // For instance: schema {
    //    age: function(transaction) { return transaction.age; }
    //
    // }
    schema: Object,

    // Array of the 'content' in the table. Can dynamically change.
    // For instance: [{age: 100, to: ...}, {age: 0, to: ...}, ...]
    content: Array
  }
};
</script>
