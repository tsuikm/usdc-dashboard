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
      <md-table-head v-for="{ name } in schema" :key="name">
        {{ name }}
      </md-table-head>
    </md-table-row>

    <md-table-row
      v-for="item in content.slice(page * pageLength, (page + 1) * pageLength)"
      :key="item[keyField]"
    >
      <md-table-cell v-for="{ name, getter, link } in schema" :key="name">
        <a v-if="link" :href="link(item)">
          {{ getter(item) }}
        </a>
        <template v-else>
          {{ getter(item) }}
        </template>
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

    // List of field objects, in the order in which they should be displayed in the table, e.g.
    // Each object must contain `name` and `getter`. `link` is optional.
    // [
    //   {
    //     name: 'Age',
    //     getter(t) { return t.age; }
    //   },
    //   {
    //     name: 'Sender',
    //     getter(t) { return t.from; },
    //     link(t) { return `/address/${t.from}`}
    //   }
    // ]
    schema: {
      type: Array,
      validator: (prop) => {
        // Every field in schema should have a name and getter
        return prop.every(({ name, getter }) => {
          return name && getter;
        });
      },
    },

    // Name of field that should be used as key
    keyField: String,

    // Array of the 'content' in the table. Can dynamically change.
    // For instance: [{age: 100, to: ...}, {age: 0, to: ...}, ...]
    content: Array,
  },
};
</script>
