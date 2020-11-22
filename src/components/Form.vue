<template>
  <div class="container">
    <div class="title">
      {{ title }}
    </div>
    <div class="input-container">
      <div class="label"
        v-for="(object, index) in schema"
        :key="object.label"
      >
        <label>{{ object.label }}</label>

        <md-field class="field">
          <md-input
            v-model="bindings[index]"
            class="input"
            :data-testid="object.label"
          />
        </md-field>
      </div>
      <span class="center-span">
        <md-button
          class="button"
          md-alignment="center"
          @click="this.submit"
        >Submit</md-button>
      </span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Form',
  props: {
    title: String,

    /** 
     * List of objects, in the order in which they should be displayed.
     * Each object must contain `label` field. May contain an
     * optional `defaultValue` field (defaults to '').
     * For instance,
     * [
     *  {
     *    label: 'Wallet Address:',
     *  },
     *  {
     *    label: 'Amount:',
     *    defaultValue: 0
     *  }
     * ]
     */ 
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

      /** 
       * This is an index-aligned mapping of the schema object with an internal binding
       * that is passed as the `v-model` for the `md-model` components.
       *
       * Two-way binding of attributes between child and parent components is now deprecated.
       * See https://stackoverflow.com/questions/40915436/vuejs-update-parent-data-from-child-component
       * To continue this pattern, we create our own bindings for the input components and emit
       * their values when the form is submitted.
       */

      bindings: this.schema.map(obj => obj.defaultValue !== undefined ? obj.defaultValue : ''),
    };
  },
  methods: {
    submit() {
      this.$emit('submit', ...this.bindings);
    },
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
  padding: 0% 0 6% 0;
  width: fit-content;
  font-family: Proxima Nova;
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
  font-family: Proxima Nova;
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
  margin-left: 0;
}

.md-field.md-theme-default::after {
  background-color: rgba(0, 0, 0, 0);
  min-height: 0px;
}


.field {
  border-radius: 5px;
  border: 1px solid #DBDCDC;
  box-sizing: border-box;
  padding-left: 16px;
}

.button {
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
  text-transform: uppercase;
  width:50%;
}

.center-span {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.input-container {
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>
