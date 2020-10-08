<template>
  <div>
    <md-card class="container">
      <div class="card-header">
        <div class="heading">
          <div v-if="this.isContract">
            <div>CONTRACT</div>
          </div>
          <div v-else>
            <div>ADDRESS</div>
          </div>
        </div>
      </div>
      <div>
        <img src="@/assets/gray-bar.svg" alt="gray-bar" class="gray-bar" />
      </div>
      <div class="subheading">
        <div>{{ this.walletAddress }}</div>
        <md-icon v-if="this.isBlacklisted" title="Blacklisted">block</md-icon>
      </div>
    </md-card>
  </div>
</template>

<script>
export default {
  name: "Address",
  props: {
    isBlacklisted: Boolean,
    isContract: Boolean,
    walletAddress: String,
  },
};
</script>

<style scoped>
.container {
  width: 700px;
  height: 120px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  padding: 30px;
  margin-bottom: 30px;
}
.card-header {
  height: 23px;
  letter-spacing: 1px;
  display: flex;
  flex-direction: column;
}
.heading {
  font-weight: 800;
  font-size: 24px;
  color: #a3a3a3;
}
.gray-bar {
  width: 800px;
}
.subheading {
  font-weight: 800;
  font-size: 20px;
  color: #a3a3a3;
  height: 50px;
  letter-spacing: 1px;
}

.subheading > div {
  display: inline;
}

.subheading > i {
  margin-bottom: 0.25rem;
}
</style>