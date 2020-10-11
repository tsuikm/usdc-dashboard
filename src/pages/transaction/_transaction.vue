<template>
  <div>
    <NavBar />
    <md-table md-card>
      <md-table-toolbar>
        <h1 class="md-title">Transaction Details</h1>
      </md-table-toolbar>

      <md-table-row>
        <md-table-cell> Hash: </md-table-cell>
        <md-table-cell> {{hash}} </md-table-cell>
      </md-table-row>

      <md-table-row>
        <md-table-cell> Block: </md-table-cell>
        <md-table-cell> {{blockNumber}} </md-table-cell>
      </md-table-row>

      <md-table-row>
        <md-table-cell> From: </md-table-cell>
        <md-table-cell><a :href="'/address/' + from">{{from}}</a></md-table-cell>
      </md-table-row>

      <md-table-row>
        <md-table-cell> To: </md-table-cell>
        <md-table-cell><a :href="'/address/' + to">{{to}}</a></md-table-cell>
      </md-table-row>

      <md-table-row>
        <md-table-cell> Gas: </md-table-cell>
        <md-table-cell> {{gas}} </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>

// modules
import NavBar from '@/components/NavBar';
import Web3 from 'web3';
import { padHex } from '@/utils/utils';

// constants
const TRANSACTION_HASH_LENGTH = 64;

const web3 = new Web3(Web3.givenProvider);

export default {
  components: {
    NavBar
  },
  data() {
    return {
      hash: this.$route.params.transaction,
      gas: null,
      from: null,
      to: null,
      blockNumber: null
    };
  },
  async created() {
    try {
      const transaction = await web3.eth.getTransaction(padHex(this.hash, TRANSACTION_HASH_LENGTH));

      this.from = transaction.from;
      this.to = transaction.to;
      this.gas = transaction.gas;
      this.blockNumber = transaction.blockNumber;
    }
    catch (error) {
      window.location.href = '/404';
    }
  }
};
</script>
