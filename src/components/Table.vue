<template>
  <div id="table-and-loading-container">
    <h1 class="md-title">
      {{ name }}
    </h1>
    <md-toolbar
      md-elevation="0"
      class="md-transparent"
    >
      <div class="subtitle">
        Showing {{ page * pageLength + 1 }}-{{ Math.min((page + 1) * pageLength, this.content.length) }} of {{ this.content.length }} results
      </div>
      <Pagination
        ref="pagination"
        class="pagination"
        :total-pages="Math.ceil(this.content.length / pageLength)"
        :disabled="loading"
        @page:change="this.pageChange"
      />
    </md-toolbar>
    <md-progress-bar
      v-if="loading"
      data-testid="progress-bar-test-id"
      md-mode="indeterminate"
    />
    <md-table
      data-testid="md-table"
    >
      <md-table-row class="headers">
        <md-table-head
          v-for="field in schema"
          :key="field.name"
        >
          {{ field.name }}
        </md-table-head>
      </md-table-row>

      <md-table-row
        v-for="item in content.slice(
          page * pageLength,
          (page + 1) * pageLength
        )"
        :key="item[keyField]"
      >
        <md-table-cell
          v-for="field in schema"
          :key="field.name"
        >
          <span>
            <!-- Internal links start with "/"; e.g. "/pages" -->
            <nuxt-link
              v-if="field.link && field.link(item).startsWith('/')"
              :to="field.link(item)"
            >
              {{ field.getter(item) }}
            </nuxt-link>
            <!-- All other links are external; e.g. "https://..." -->
            <a
              v-else-if="field.link"
              :href="field.link(item)"
            >
              {{ field.getter(item) }}
            </a>
            <!-- Not a link if field.link doesn't exist -->
            <template v-else>
              {{ field.getter(item) }}
            </template>
          </span>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import Pagination from './Pagination';

export default {
  name: 'Table',
  components: {
    Pagination,
  },
  props: {
    name: String,
    loading: Boolean,

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
  data() {
    return {
      page: 0,
      pageLength: 25,
    };
  },
  mounted() {
    if (this.$route && this.$route.query.page) {
      this.page = parseInt(this.$route.query.page) - 1; // subtract 1 since pages are 0-indexed.
      this.$refs.pagination.page = this.page;
    }
  },
  methods: {
    pageChange(page) {
      this.page = page;

      // Change the ?page query parameter to match the page. We add 1 since pages are 0-indexed internally.
      this.$router && this.$router.push({query: { page: page + 1 }});
      this.$emit('page:change', page);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/variables/_colors.scss";

#table-and-loading-container {
  font-family: Proxima Nova;
  margin: auto;
}

span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  display: inline-block;
}

.md-toolbar {
  padding-left: 24px;

  .subtitle {
    flex: 1;
    color: $circle-grey;
  }
}

.md-title {
  font-weight: bold;
  font-size: 36px;
  line-height: 44px;
  letter-spacing: 0.03em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
  padding-left: 24px;
}
tbody .md-table-row td {
  border-top: 0;
}

.headers {
  border-bottom: 1px solid $circle-grey;
  color: $circle-grey;
}

.md-theme-default a:not(.md-button) {
   color: $circle-blue;
}
</style>
