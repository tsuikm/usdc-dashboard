<template>
  <div>
    <TransactionDetails 
      :hash="{ label: 'Transaction Hash', value: hash }"
      :sender="sender"
      :receiver="receiver"
      :block-number="{ label: 'Block Number', value: blockNumber }"
      :gas="{ label: 'Gas Price (wei)', value: gas }"
      :value="{ label: 'Value (wei)', value: value }"
      :data="{ label: 'Transaction Data', value: data }"
    />
  </div>
</template>

<script>

// modules
import { web3 } from '@/utils/web3utils';
import { padHex } from '@/utils/utils';
import { WEB3_TXN_HASH_LENGTH } from '@/utils/constants';
import TransactionDetails from '@/components/TransactionDetails';


export default {
  components: {
    TransactionDetails,
  },
  data() {
    return {
      hash: null,
      gas: null,
      sender: null,
      receiver: null,
      blockNumber: null,
      value: null,
      data: null,
    };
  },
  async mounted() {
    this.hash = this.$route.params.transaction;
    try {
      const transaction = await web3.eth.getTransaction(padHex(this.hash, WEB3_TXN_HASH_LENGTH));
      this.sender = transaction.from;
      this.receiver = transaction.to;
      this.gas = transaction.gasPrice;
      this.blockNumber = transaction.blockNumber;
      this.value = transaction.value;
      this.data = transaction.input;
    } catch (e) {
      this.$router && this.$router.push({path: '/404' });
    }
  },
  head() {
    return {
      title: `Transaction: ${this.$route.params.transaction}`,
    };
  },
};
</script>
