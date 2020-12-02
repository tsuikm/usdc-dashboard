<template>
  <div>
    <NavBar />
    <TransactionDetails 
      :hash="{ label: 'Transaction ID', value: id }"
      :sender="sender"
      :receiver="receiver"
      :block-number="{ label: 'Block Number', value: blockNumber }"
      :gas="{ label: 'Fee', value: fee }"
    />
  </div>
</template>

<script>
import { getCurrentRound, fetchAlgorand } from '@/utils/algo-utils';
import { ALGORAND_USDC_ASSET_ID } from '@/utils/constants';
import NavBar from '@/components/NavBar';
import TransactionDetails from '@/components/TransactionDetails';

export default {
  components: {
    NavBar,
    TransactionDetails,
  },
  data() {
    return {
      id: null,
      fee: null,
      sender: null,
      receiver: null,
      blockNumber: null,
      // amount: null,
      // type: null,
    };
  },
  async mounted() {
    this.id = this.$route.params.transaction;
    
    try {
      const transaction = (await fetchAlgorand({
        api: 'indexer',
        request: 'transactions',
        'asset-id': ALGORAND_USDC_ASSET_ID,
        'txid': this.id,
        'max-round': await getCurrentRound(),
      })).transactions[0];
            
      this.sender = transaction.sender;
      this.receiver = transaction['asset-transfer-transaction'].receiver;
      this.fee = transaction.fee;
      this.blockNumber = transaction['confirmed-round'];
      // this.amount = transaction['asset-transfer-transaction'].amount;
      // this.type = transaction['tx-type'];
    }
    catch (e) {
      this.$router && this.$router.push({ path: '/404' });
    }
  },
};
</script>
