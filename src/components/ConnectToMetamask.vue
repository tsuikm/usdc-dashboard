<template>
  <div>
    <md-button
      class='connectButton'
      data-testid="transfers-card-connect-button"
      @click="connectMetamask"
    >
      Connect to Metamask
    </md-button>
  </div>
</template>

<script>
export default {
  name: 'ConnectToMetamask',
  methods: {
    async connectMetamask() {
      try {
        // eslint-disable-next-line
        this.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped>
.connectButton {
  color: #1ED67D;
}
</style>