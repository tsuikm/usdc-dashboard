<template>
  <div class="role-container">
      <div v-if="this.minter" >
          <md-chip class="chip">
            MINTER
          </md-chip>
      </div>
      <div v-if="this.pauser">
          <md-chip class="chip">
            PAUSER
          </md-chip>
      </div>
      <div v-if="this.owner">
          <md-chip class="chip">
            OWNER
          </md-chip>
      </div>
  </div>
</template>

<script>
export default {
  name: 'RoleDisplay',
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
    margin-left: 20px;
    color: white;
    font-weight: 700;
}
</style>
