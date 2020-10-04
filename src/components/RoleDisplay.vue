<template>
  <div class="role-container">
      <div v-if="this.minter" >
          <v-chip class="chip">
            MINTER
          </v-chip>
      </div>
      <div v-if="this.pauser">
          <v-chip class="chip">
            PAUSER
          </v-chip>
      </div>
      <div v-if="this.owner">
          <v-chip class="chip">
            OWNER
          </v-chip>
      </div>
  </div>
</template>

<script>
export default {
  name: "RoleDisplay",
  props: {
    minter: Boolean,
    pauser: Boolean,
    owner: Boolean,
  },
};
</script>

<style scoped>
.chip {
    background-color: #68d7f3;
    padding: 8px;
    border-radius: 10px;
    margin-left: 20px;
    color: white;
    font-weight: 700;
}
</style>
