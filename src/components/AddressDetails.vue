<template>
  <div class="content">
    <h1> Address Details </h1>
    <div class="address-page-container">
      <!-- wallet address -->
      <div class="wallet-address">
        <h2> Wallet Address </h2>
        <div class="page-wallet-address">
          {{ this.address }}
        </div>
      </div>

      <!-- roles -->
      <div
        v-if="roles.length !== 0"
        class="roles"
      >
        <h2> Roles </h2>
        <div
          v-for="(role, roleIndex) in roles"
          :key="roleIndex"
          class="role"
        >
          <div
            class="role-container"
            data-testid="role-container"
          >
            <md-chip
              class="chip"
              :style="{'background-color': role.color}"
            >
              {{ role.name }}
            </md-chip>
          </div>
        </div>
      </div>

      <!-- balance -->
      <div class="balance">
        <h2> Balance </h2>
        <div class="page-balance">
          ${{ this.balance }}
        </div>
      </div>

      <!-- Any additional content needed -->
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddressDetails',
  props: {

    /**
     * @param {Role[]} - the role(s) the wallet address has.
     * @typedef {Role} {
     *   name: {String} - the name of the Role (eg. 'Pauser').
     *   color: {String[]} - the color of the chip.
     * }
     */
    roles: {
      type: Array,
      validator: roles => Array.isArray(roles) &&
                          roles.every(role => role instanceof Object &&
                                              typeof role.name === 'string' &&
                                              typeof role.color === 'string'),
    },

    /**
     * @param {number} - the balance of the address.
     * @param {string} - the address
     */
    balance: Number,
    address: String,
  },
};
</script>

<style scoped>
.address-page-container {
  display:grid;
  grid-template-columns: 400px 400px;
  grid-column-gap: 500px;
  grid-row-gap: 40px;
  padding-bottom: 10%;
  padding-top: 3%;
}
.page-wallet-address {
  padding-top: 5%;
}
.page-balance {
  padding-top: 5%;
}

.list-of-roles {
  background-color: #68d7f3;
  color: white;
  font-weight: 700;
}
.chip {
  color: white;
  font-weight: 700;
  width: 25%;
  text-align: center;
  font-weight: bold;
}
.role {
  padding-top: 3%;
}
.wallet-address {
  font-weight: bold;
}
.balance {
  font-weight: bold;
}
</style>
