<template>
  <div class="content">
    <h1> Address Details </h1>

    <!-- wallet address -->
    <div class="wallet-address">
      <h2> Wallet Address </h2>
      <div> {{ this.$route.params.address }} </div>
    </div>

    <!-- roles -->
    <div class="roles">
      <h2> Roles </h2>
      <div
        v-for="(role, roleIndex) in roles"
        :key="roleIndex"
        class="role"
      >
        <div> {{ role }} </div>
      </div>
    </div>

    <!-- balance -->
    <div class="balance">
      <h2> Balance </h2>
      <div> ${{ this.balance }} </div>
    </div>

    <!-- blacklisted -->
    <div class="blacklisted">
      <h2> Blacklisted? </h2>
      <div v-if="this.isBlacklisted">
        Yes
      </div>
      <div v-else>
        No
      </div>
    </div>

    <!-- transactions -->
    <div class="transactions">
      <h2> Address Transactions </h2>
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
import { basePathFromPath } from '@/utils/utils';

export default {
  name: 'AddressPage',
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
                           roles.every(role => typeof role === 'string'),
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
      * @param {IsBlacklisted} - whether the address is blacklisted.
      */
    isBlacklisted: {
      type: Boolean,
      validator: isBlacklisted => typeof isBlacklisted === 'boolean',
    },

    /**
      * @param {Balance} - the balance of the address.
      */
    balance: {
      type: Number,
      validator: balance => typeof balance === 'number',
    },
  },
  computed: {
    basePath() {
      return this.$route ? basePathFromPath(this.$route.path) : '';
    },
  },
};
</script>
<style scoped>
.wallet-address {
  width: 100%
}
</style>

