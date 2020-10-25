<template>
  <div class="container">
    <div class="title">
      {{ title }}
    </div>
    <md-card class="card">
      <div
        v-for="(object, index) in schema"
        :key="object.label"
      >
        <label>{{ object.label }}</label>

        <md-field class="field">
          <md-input
            v-model="bindings[index]"
            class="input"
          />
        </md-field>
      </div>

      <md-card-actions>
        <span class="center-span">
          <md-button
            class="button"
            md-alignment="center"
            @click="this.submit"
          >Send</md-button>
        </span>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>

export default {
  name: 'Form',
  props: {
    title: String,

    // List of objects, in the order in which they should be displayed.
    // Each object must contain `label` field. May contain an
    // optional `defaultValue` field (defaults to '').
    //
    // For instance,
    // [
    //   {
    //     label: 'Wallet Address:',
    //   },
    //   {
    //     label: 'Amount:',
    //     defaultValue: 0
    //   }
    // ]
    schema: {
      type: Array,
      validator: prop => {

        // Every field in schema should have a label.
        return prop.every(({ label }) => label !== undefined);
      },
    },
  },
  data() {
    return {

      // This is an index-aligned mapping of the schema object with an internal binding
      // that is passed as the `v-model` for the `md-model` components.
      //
      // Two-way binding of attributes between child and parent components is now deprecated.
      // See https://stackoverflow.com/questions/40915436/vuejs-update-parent-data-from-child-component
      // To continue this pattern, we create our own bindings for the input components and emit
      // their values when the form is submitted.
      bindings: this.schema.map(obj => obj.defaultValue !== undefined ? obj.defaultValue : ''),
    };
  },
  methods: {
    submit() {
      this.$emit('submit', ...this.bindings);
    },
  },
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Proxima+Nova&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Poppins&display=swap',
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/variables/_colors.scss";

.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.title {
  padding: 8% 0 0 8%;
  width: fit-content;
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 36px;
  line-height: 54px;
  letter-spacing: 0.03em;
  color: $circle-black;
}

.input {
  border-radius: 5px;
  box-sizing: border-box;
  color: $circle-grey;
  display: block;
  font-family: Roboto Mono;
  font-size: 14px;
  font-style: normal;
  font-weight: bold;
  left: 37.5%;
  letter-spacing: 0.03em;
  line-height: 18px;
  margin-bottom: 14px;
  text-align: left;
  width: 25%;
}

.card {
  background-color: #FFF;
  border-radius: 16px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  left: 15%;
  padding: 5%;
  width: 60%;
}

label {
  color: $circle-black;
  display: block;
  font-family: Proxima Nova;
  font-size: 11px;
  font-style: normal;
  font-weight: normal;
  letter-spacing: 1px;
  line-height: 13px;
  text-transform: uppercase;
}

.field {
  border-radius: 5px;
  border: 1px solid #DBDCDC;
  box-sizing: border-box;
}

.button {
  /** background: #1ED67D; */
  background: $circle-green;
  border-radius: 5px;
  color: #FFFFFF;
  font-family: Proxima Nova;
  font-size: 14px;
  font-style: normal;
  font-weight: bold;
  height: 50px;
  letter-spacing: 1.05px;
  line-height: 17px;
  padding: 17px 50px;
  text-transform: uppercase;
}

.center-span {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>
