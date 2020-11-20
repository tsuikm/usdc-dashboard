<template>
  <div>
    <NavBar />
    <TransactionDetails 
      :hash="{ label: 'Transaction Hash', value: hash }"
      :sender="sender"
      :receiver="receiver"
      :block-number="{ label: 'Block Number', value: blockNumber }"
      :gas="{ label: 'Gas', value: gas }"
    />
  </div>
</template>

<script>

// modules
import { web3 } from '@/utils/web3utils';
import { padHex } from '@/utils/utils';
import { WEB3_TXN_HASH_LENGTH } from '@/utils/constants';
import NavBar from '@/components/NavBar';
import TransactionDetails from '@/components/TransactionDetails';


export default {
  components: {
    NavBar,
    TransactionDetails,
  },
  data() {
    return {
      hash: null,
      gas: null,
      sender: null,
      receiver: null,
      blockNumber: null,
    };
  },
  async mounted() {
    this.hash = this.$route.params.transaction;
    try {
      const transaction = await web3.eth.getTransaction(padHex(this.hash, WEB3_TXN_HASH_LENGTH));
      this.sender = transaction.from;
      this.receiver = transaction.to;
      this.gas = transaction.gas;
      this.blockNumber = transaction.blockNumber;
    } catch (e) {
      this.$router && this.$router.push({path: '/404' });
    }
  },
};
</script>
