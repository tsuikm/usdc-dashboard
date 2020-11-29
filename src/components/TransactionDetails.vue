<template>
  <div>
    <h1>
      Transaction Details
    </h1>

    <div class="transaction-info">
      <h2> {{ hash.label }} </h2>
      <p> {{ hash.value }} </p>
    </div>

    <div class="transaction-info">
      <h2> {{ blockNumber.label }} </h2>
      <p> {{ blockNumber.value }} </p>
    </div>

    <div id="sender-receiver-section">
      <div class="transaction-info">
        <h2> Sender </h2>
        <nuxt-link :to="senderLink">
          {{ sender }}
        </nuxt-link>
      </div>
      <div class="transaction-info">
        <h2> Receiver </h2>
        <nuxt-link :to="receiverLink">
          {{ receiver }}
        </nuxt-link>
      </div>
    </div>

    <div class="transaction-info">
      <h2> {{ gas.label }} </h2>
      <p> {{ gas.value }} </p>
    </div>
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

<style lang="scss" scoped>
@import "@/assets/styles/variables/_colors.scss";
@import "@/assets/styles/variables/constants.scss";

.transaction-info {
  margin-bottom: 1.5rem;

  p, a {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

#sender-receiver-section {
  display: flex;
  justify-content: space-between;

  @media only screen and (max-width: $mobile-threshold) {
    flex-direction: column;
    justify-content: flex-start;
  }
}
</style>
