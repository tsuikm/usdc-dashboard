<template>
  <div>
    <h1> USDC Dashboard </h1>
    <div id="content">
      <!-- roles -->
      <div
        id="content-roles"
        class="card"
      >
        <div
          v-for="(role, roleIndex) in roles"
          :key="roleIndex"
        >
          <h2> {{ role.name }} </h2>
          <div class="list">
            <nuxt-link
              v-for="(address, addressIndex) in role.addresses"
              :key="addressIndex"
              :to="`${basePath}/address/${address}`"
              class="mono"
            >
              {{ address }}
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- blocks -->
      <div
        id="content-blocks"
        class="card"
      >
        <h2> Latest Blocks </h2>
        <nuxt-link :to="`${basePath}/blocks`">
          See all blocks
        </nuxt-link>
        <div class="list">
          <nuxt-link
            v-for="(block, index) in blocks"
            :key="index"
            :to="`${basePath}/block/${block}`"
            class="mono"
          >
            {{ block }} / {{ toHex(block) }}
          </nuxt-link>
        </div>
      </div>

      <!-- transactions -->
      <div
        id="content-transactions"
        class="card"
      >
        <h2> Recent Transactions </h2>
        <nuxt-link :to="`${basePath}/transactions`">
          See all transactions
        </nuxt-link>
        <div class="list">
          <nuxt-link
            v-for="(transaction, index) in transactions"
            :key="index"
            :to="`${basePath}/transaction/${transaction}`"
            class="mono"
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
#content {
  display: flex;
  height: calc(100% - 10.25rem);
  padding: 10px;
  overflow-y: scroll;

  @media only screen and (max-width: 800px) {
    height: calc(100% - 126px);
  }

  .card {
    margin-left: 1rem;
    margin-right: 1rem;
    min-width: 240px;
    flex: 1;

    h2 {
      margin-bottom: 1rem;
      &:not(:first-of-type) {
        margin-top: 2rem;
      }
    }

    a {
      display: inline-block;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mono {
      margin-bottom: 0.25rem;
    }

    .list {
      @media screen and (min-width: 800px) {
        height: calc(100% - 4rem);
        overflow-y: scroll;
      }
    }
  }

  #content-blocks {
    flex: 0;
  }

  #content-roles {
    .list {
      height: 100%;
    }
  }

  @media only screen and (max-width: 800px) {
    flex-direction: column;

    .card {
      margin: 1rem 0;
    }
  }
}
</style>
