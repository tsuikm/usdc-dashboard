<template>
  <div>
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
        <md-table-cell> Sender: </md-table-cell>
        <md-table-cell><a :href="'/address/' + sender">{{sender}}</a></md-table-cell>
      </md-table-row>

      <md-table-row>
        <md-table-cell> Receiver: </md-table-cell>
        <md-table-cell><a :href="'/address/' + receiver">{{receiver}}</a></md-table-cell>
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
import Web3 from 'web3';
import { padHex } from '@/utils/utils';

// constants
const TRANSACTION_HASH_LENGTH = 64;

const web3 = new Web3(Web3.givenProvider);

export default {
  name: 'TransactionDetails',
  props: {
    hash: String
  },
  data() {
    return {
      gas: null,
      sender: null,
      receiver: null,
      blockNumber: null
    };
  },
  async created() {
    try {
      const transaction = await web3.eth.getTransaction(padHex(this.hash, TRANSACTION_HASH_LENGTH));

      this.sender = transaction.from;
      this.receiver = transaction.to;
      this.gas = transaction.gas;
      this.blockNumber = transaction.blockNumber;
    }
    catch (error) {
      window.location.href = '/404';
    }
  }
};
</script>
