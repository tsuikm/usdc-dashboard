<template>
  <div>
    <md-card class="transferCard" data-testid="transfers-card-test-id">
      <md-card-header class="transferCardHeader">
        <div class="md-title">Transfer USDC</div>
      </md-card-header>
      <md-field class="transferInput" data-testid="transfers-card-from-input">
        <label>From</label>
        <md-input></md-input>
      </md-field>

      <md-field class="transferInput" data-testid="transfers-card-to-input">
        <label>To</label>
        <md-input></md-input>
      </md-field>
      <md-field class="transferInput" data-testid="transfers-card-amount-input">
        <label>Transfer Amount</label>
        <md-input></md-input>
      </md-field>
      <md-card-actions>
        <md-button data-testid="transfers-card-send-button">Send</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.transferInput {
  color: black;
  width: 25%;
  text-align: center;
  left: 37.5%;
}

.transferCard {
  width: 50%;
  left: 25%;
  padding: 5%;
  background-color: #6cb6ff;
}
.transferCardHeader {
  color: white;
}
</style>