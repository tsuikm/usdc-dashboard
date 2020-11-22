<template>
  <div class="content">
    <h1> USDC Dashboard </h1>

    <!-- roles -->
    <div
      v-for="(role, roleIndex) in roles"
      :key="roleIndex"
      class="role"
    >
      <img :src="require(`@/assets/${role.icon}`)">
      <h2> {{ role.name }} </h2>
      <div>
        <nuxt-link
          v-for="(address, addressIndex) in role.addresses"
          :key="addressIndex"
          :to="`${basePath}/address/${address}`"
        >
          {{ address }}
        </nuxt-link>
      </div>
    </div>


    <!-- blocks -->
    <div id="blocks">
      <h2> Latest Blocks </h2>
      <nuxt-link :to="`${basePath}/blocks`">
        See all blocks
      </nuxt-link>
      <div>
        <nuxt-link
          v-for="(block, index) in blocks"
          :key="index"
          :to="`${basePath}/block/${block}`"
        >
          {{ block }} / {{ toHex(block) }}
        </nuxt-link>
      </div>
    </div>

    <!-- transactions -->
    <div id="transactions">
      <h2> Recent Transactions </h2>
      <nuxt-link :to="`${basePath}/transactions`">
        See all transactions
      </nuxt-link>
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
     *   icon: {String} - the file of the icon displayed for the role, relative to the @/assets directory.
     * }
     */
    roles: {
      type: Array,
      validator: roles => Array.isArray(roles) &&
                          roles.every(role => role instanceof Object &&
                                              typeof role.name === 'string' &&
                                              typeof role.icon === 'string' &&
                                              Array.isArray(role.addresses) &&
                                              role.addresses.every(address => typeof address === 'string' && address.length)),
    },

    /**
     * @param {String[]} - the transactions to display.
     */
    transactions: {
      type: Array,
      validator: transactions => Array.isArray(transactions) &&
                                 transactions.every(hash => typeof hash === 'string' && hash.length),
    },

    /**
     * @param {number[]} - the blocks to display, as an array of base-10 numbers.
     */
    blocks: {
      type: Array,
      validator: blocks => Array.isArray(blocks) && blocks.every(block => typeof block === 'number'),
    },
  },
  computed: {
    basePath() {
      return this.$route ? basePathFromPath(this.$route.path) : '';
    },
  },
  methods: {
    toHex,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables/_colors.scss";

.content {
  padding-left: 1rem;
  padding-right: 1rem;
  display: grid;
  grid-column-gap: 2%;
  grid-row-gap: 2rem;
}

.content > * {
  min-width: 0;
  a {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    color: $circle-blue;
    width: 100%;
  }
}

h1, h2 {
  margin-bottom: 1rem;
}

h2 {
  font-size: 18px;
}

h1 {
  grid-row: 1;
}

.role {
  grid-row: 2;
  min-width: 0;
}

#transactions, #blocks {
  grid-row: 3;
  background-color: #F8F8FA;
  padding: 1rem;
  border-radius: 10px;
}

#transactions {
  min-width: none;
  grid-column-start: 2;
  grid-column-end: 5;
}

</style>
