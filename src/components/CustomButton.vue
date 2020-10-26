<template>
  <div class="button">
    <button
      :class="{'button-colored': minter, 'button-gray': !minter}"
      data-testid="minter"
      @click="clickMinter"
    >
      MINTER
    </button>
    <button
      :class="{'button-colored': pauser, 'button-gray': !pauser}"
      data-testid="pauser"
      @click="clickPauser"
    >
      PAUSER
    </button>
    <button
      :class="{'button-colored': owner, 'button-gray': !owner}"
      data-testid="owner"
      @click="clickOwner"
    >
      OWNER
    </button>
    <button
      :class="{'button-colored': blacklister, 'button-gray': !blacklister}"
      data-testid="blacklister"
      @click="clickBlacklister"
    >
      BLACKLISTER
    </button>
  </div>
</template>

<script>
export default {
  name: 'CustomButton',
  props:{
    minter: Boolean,
    pauser: Boolean,
    owner: Boolean,
    blacklister: Boolean,
  },
  methods: {
    clickMinter() {
      let updatedMinter = !this.minter;
      this.$emit("update-role", updatedMinter, this.pauser, this.owner, this.blacklister);
    },
    clickPauser() {
      let updatedPauser = !this.pauser;
      this.$emit("update-role", this.minter, updatedPauser, this.owner, this.blacklister);
    },
    clickOwner() {
      let updatedOwner = !this.owner;
      this.$emit("update-role", this.minter, this.pauser, updatedOwner, this.blacklister);
    },
    clickBlacklister() {
      let updatedBlacklister= !this.blacklister;
      this.$emit("update-role", this.minter, this.pauser, this.owner, updatedBlacklister);
    },
  }
}
</script>

<style scoped>
.button {
  margin-bottom: 5px;
}

.button-colored {
  background-color: #68d7f3;
  margin: 10px;
  padding: 15px;
  color: white;
  font-weight: 700;
  float: left;
  border-radius: 25px;
  border: none;
}

.button-gray {
  background-color: #d1d1d1;
  margin: 10px;
  padding: 15px;
  color: white;
  font-weight: 700;
  float: left;
  border-radius: 25px;
  border: none;
}
</style>