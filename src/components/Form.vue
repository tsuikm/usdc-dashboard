<template>
  <div>
    <md-card class="card">
      <md-card-header class="header">
        <div class="md-title">{{title}}</div>
      </md-card-header>

      <div v-for="(object, index) in schema" :key="object.label">
        <label>{{ object.label }}</label>

        <md-field class="field">
          <md-input class="input" v-model="attributes[index].binding"></md-input>
        </md-field>
      </div>

      <md-card-actions>
        <span class="center-span">
          <md-button class="button" md-alignment="center" @click="this.submit">Send</md-button>
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
        return prop.every(({ label, field }) => label !== undefined);
      },
    }
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
      attributes: this.schema.map((object, index) => {
        return {
          binding: object.defaultValue !== undefined ? object.defaultValue : ''
        }
      })
    }
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
  width: 25%;
  left: 37.5%;
  box-sizing: border-box;
  border-radius: 5px;
  display: block;
  text-align: left;
  margin-bottom: 14px;
  font-family: Roboto Mono;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.03em;
  color: #717171;
}

.card {
  width: 50%;
  left: 25%;
  padding: 5%;
  background-color: #FFF;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
}

label {
  font-family: Proxima Nova;
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  line-height: 13px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #3D3652;
  display: block;
}

.header {
  color: white;
}

.field {
  border: 1px solid #DBDCDC;
  box-sizing: border-box;
  border-radius: 5px;
}

.button {
  font-family: Proxima Nova;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 1.05px;
  text-transform: uppercase;
  color: #FFFFFF;
  background: #1ED67D;
  border-radius: 5px;
  padding: 17px 50px;
  height: 50px;
  color: #FFFFFF;
}

.center-span {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
</style>
