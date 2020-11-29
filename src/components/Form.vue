<template>
  <div class="container">
    <div class="title">
      {{ title }}
    </div>
    <div class="input-container">
      <div
        v-for="(object, index) in schema"
        :key="object.label"
        class="input"
      >
        <CustomInput
          v-model="bindings[index]"
          :placeholder="object.placeholder"
          :data-testid="object.label"
        />
      </div>
      <div class="button-container">
        <ActionButton
          class="button"
          :label="'SUBMIT'"
          :on-click="this.submit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ActionButton from '@/components/ActionButton';
import CustomInput from '@/components/CustomInput';
export default {
  name: 'Form',
  components: {
    ActionButton,
    CustomInput,
  },
  props: {
    title: String,

    /** 
     * List of objects, in the order in which they should be displayed.
     * Each object must contain `label` field. May contain an
     * optional `placeholder` field (defaults to '').
     * For instance,
     * [
     *  {
     *    label: 'Wallet Address:',
     *  },
     *  {
     *    label: 'Amount:',
     *    placeholder: 0
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

      bindings: this.schema.map(obj => obj.placeholder !== undefined ? obj.placeholder : ''),
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
  line-height: 44px;
  letter-spacing: 0.03em;
  color: $circle-black;
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
  text-align: left;
}

.button-container {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  width: 30%;
}

.input {
  padding-bottom: 20px;
}

.input-container {
  width: 70%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  padding-bottom: 10px;
}
</style>
