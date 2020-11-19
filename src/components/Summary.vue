<template>

</template>

<script>

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
