export default {
  template: '<a @click="_click"><slot></slot></a>',
  props: {

    /**
     * This is a partially complete mock-implementation of NuxtLink that we use in our test files.
     *
     * For the usages of our app, we currently only used the 'to' prop.
     */
    to: {
      type: [String, Object],
      required: true,
    },
  },
  methods: {
    _click() {
      this.$router.push({path: this.to });
    },
  },
};
