<template>
  <div>
    <h1> USDC Dashboard </h1>
    <div>

      <!-- roles -->
      <div id="roles">
        <div v-for="(role, index) in roles" :key="index">
          <h2> role.name </h2>
          <div>
            <nuxt-link
              v-for="(address, index) in role.addresses"
              :key="index"
              :to="`${this.basePath}/address/${address}`"
            >
              {{ address }}
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- blocks -->
      <div>
        <h2> Latest Blocks </h2>
        <nuxt-link :to="`${this.basePath}/blocks`"> See all blocks </nuxt-link>
        <div>
          <nuxt-link
            v-for="(block, index) in blocks"
            :key="block.index"
            :to="`${this.basePath}/block/${block}`"
          >
            {{ block }} / {{ toHex(block) }}
          </nuxt-link>
        </div>
      </div>

      <!-- transactions -->
      <div>
        <h2> Recent Transactions </h2>
        <nuxt-link :to="`${this.basePath}/transactions`"> See all transactions </nuxt-link>
        <div>
          <nuxt-link
            v-for="(transaction, index) in transactions"
            :key="index"
            :to="`${this.basePath}/transaction/${transaction.transactionHash}`"
          >
            {{ transaction.transactionHash }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toHex } from '@/utils/utils';

export default {
  name: 'Summary',
  props: {

    /**
     * @param {Role[]} - the roles to display.
     * @typedef {Role} {
     *   name: {String} - the name of the Role (eg. 'Pauser').
     *   addresses: {String[]} - the addresses that have this particular role.
     * }
     */
    roles: {
      type: Array,
      validator: role => role instanceof Object &&
                         typeof role.name === 'string' &&
                         Array.isArray(role.addresses) &&
                         role.addresses.every(address => typeof address === 'string' && address.length)
    },

    /**
     * @param {String[]} - the transactions to display.
     */
    transactions: {
      type: Array,
      validator: transactions => Array.isArray(transaction) &&
                                 transactions.every(hash => typeof hash === 'string' && address.length)
    },

    /**
     * @param {number[]} - the blocks to display, as an array of base-10 numbers.
     */
    blocks: {
      type: Array,
      validator: blocks => Array.isArray(blokcs) && blocks.every(block => typeof block === 'number')
    },
  },
};
</script>
