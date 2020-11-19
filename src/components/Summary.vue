<template>
  <div>
    <h1> USDC Dashboard </h1>
    <div>

      <!-- roles -->
      <div id="roles">
        <h2> Roles </h2>
        <div v-for="(role, index) in roles" :key="index">
          <h2> {{ role.name }} </h2>
          <div>
            <nuxt-link
              v-for="(address, index) in role.addresses"
              :key="index"
              :to="`${basePath}/address/${address}`"
            >
              {{ address }}
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- blocks -->
      <div>
        <h2> Latest Blocks </h2>
        <nuxt-link :to="`${basePath}/blocks`"> See all blocks </nuxt-link>
        <div>
          <nuxt-link
            v-for="(block, index) in blocks"
            :key="block.index"
            :to="`${basePath}/block/${block}`"
          >
            {{ block }} / {{ toHex(block) }}
          </nuxt-link>
        </div>
      </div>

      <!-- transactions -->
      <div>
        <h2> Recent Transactions </h2>
        <nuxt-link :to="`${basePath}/transactions`"> See all transactions </nuxt-link>
        <div>
          <nuxt-link
            v-for="(transaction, index) in transactions"
            :key="index"
            :to="`${basePath}/transaction/${transaction}`"
          >
            {{ transaction }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toHex, basePathFromPath } from '@/utils/utils';

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
      validator: roles => Array.isArray(roles) &&
                          roles.every(role => role instanceof Object &&
                                              typeof role.name === 'string' &&
                                              Array.isArray(role.addresses) &&
                                              role.addresses.every(address => typeof address === 'string' && address.length))
    },

    /**
     * @param {String[]} - the transactions to display.
     */
    transactions: {
      type: Array,
      validator: transactions => Array.isArray(transactions) &&
                                 transactions.every(hash => typeof hash === 'string' && hash.length)
    },

    /**
     * @param {number[]} - the blocks to display, as an array of base-10 numbers.
     */
    blocks: {
      type: Array,
      validator: blocks => Array.isArray(blocks) && blocks.every(block => typeof block === 'number')
    },
  },
  computed: {
    basePath() {
      return this.$route ? basePathFromPath(this.$route.path) : '';
    },
  },
  methods: {
    toHex
  }
};
</script>
