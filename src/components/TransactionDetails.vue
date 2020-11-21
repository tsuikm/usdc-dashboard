<template>
  <div>
    <md-table md-card>
      <md-table-toolbar>
        <h1 class="md-title">
          Transaction Details
        </h1>
      </md-table-toolbar>

      <md-table-row>
        <md-table-cell> {{ hash.label }}: </md-table-cell>
        <md-table-cell> {{ hash.value }} </md-table-cell>
      </md-table-row>

      <md-table-row>
        <md-table-cell> {{ blockNumber.label }}: </md-table-cell>
        <md-table-cell> {{ blockNumber.value }} </md-table-cell>
      </md-table-row>

      <md-table-row>
        <md-table-cell> Sender: </md-table-cell>
        <md-table-cell>
          <nuxt-link :to="senderLink">
            {{ sender }}
          </nuxt-link>
        </md-table-cell>
      </md-table-row>

      <md-table-row>
        <md-table-cell> Receiver: </md-table-cell>
        <md-table-cell>
          <nuxt-link :to="receiverLink">
            {{ receiver }}
          </nuxt-link>
        </md-table-cell>
      </md-table-row>

      <md-table-row>
        <md-table-cell> {{ gas.label }}: </md-table-cell>
        <md-table-cell> {{ gas.value }} </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import { basePathFromPath } from '@/utils/utils';

/**
 * Props: {
 *    hash: { label: String, value: String }, // known as "signature" in Solana, etc.
 *    sender: String,
 *    receiver: String,
 *    blockNumber: { label: String, value: String }, // known as "slot" in Solana, etc.
 *    gas: { label: String, value: String } // known as "fee" in Solana, etc.
 * }
 */
const labelValueValidator = prop => {
  return prop.label !== undefined && prop.value !== undefined;
};

export default {
  name: 'TransactionDetails',
  props: {
    hash: {
      type: Object,
      validator: labelValueValidator,
    },
    sender: String,
    receiver: String,
    blockNumber: {
      type: Object,
      validator: labelValueValidator,
    },
    gas: {
      type: Object,
      validator: labelValueValidator,
    },
  },
  computed: {
    basePath() {
      if (this.$route) {
        return basePathFromPath(this.$route.path);
      }
      
      return '';
    },
    senderLink() {
      return `${this.basePath}/address/${this.sender}`;
    },
    receiverLink() {
      return `${this.basePath}/address/${this.receiver}`;
    },
  },
};
</script>
