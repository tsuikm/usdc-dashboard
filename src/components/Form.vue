<template>
  <div>
    <md-card class="card">
      <md-card-header class="header">
        <div class="md-title">
          {{ title }}
        </div>
      </md-card-header>

      <div
        v-for="(object, index) in schema"
        :key="object.label"
      >
        <label>{{ object.label }}</label>

        <md-field class="field">
          <md-input
            v-model="attributes[index].binding"
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
      attributes: this.schema.map(object => {
        return {
          binding: object.defaultValue !== undefined ? object.defaultValue : '',
        };
      }),
    };
  },
  methods: {
    submit() {
      this.$emit('submit', ...this.attributes.map(object => object.binding));
    },
  },
};
</script>

<style scoped>
.input {
  border-radius: 5px;
  box-sizing: border-box;
  color: #717171;
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
  left: 25%;
  padding: 5%;
  width: 50%;
}

label {
  color: #3D3652;
  display: block;
  font-family: Proxima Nova;
  font-size: 11px;
  font-style: normal;
  font-weight: normal;
  letter-spacing: 1px;
  line-height: 13px;
  text-transform: uppercase;
}

.header {
  color: white;
}

.field {
  border-radius: 5px;
  border: 1px solid #DBDCDC;
  box-sizing: border-box;
}

.button {
  background: #1ED67D;
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
