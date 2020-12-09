<template>
  <div>
    <NavBar />
    <AddressPage
      :roles="[]"
      :is-blacklisted="false"
      :balance="this.balance"
      :address="this.address"
    />
    <h1>Solana USDC Address Transactions</h1>
    <Table
      ref="table"
      :loading="loading"
      name=""
      :total-items="transactions.length"
      :schema="this.tableSchema"
      :content="this.transactions"
      :key-field="'Transaction Hash'"
      @page:change="this.pageChange"
    />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import AddressPage from '@/components/AddressDetails';
import { getBalance, getWalletTransactions, getTransactionInfo, getBlockTime, SOLANA_TRANSACTION_SCHEMA } from '@/utils/solana';
import moment from 'moment';
import { ageText } from '@/utils/web3utils';
import Table from '@/components/Table';

export default {
  components: {
    NavBar,
    AddressPage,
    Table,
  },
  data() {
    return {
      balance: null,
      address: null,
      transactions: [],
      loading: true,
    };
  },
  computed: {
    tableSchema() {
      return SOLANA_TRANSACTION_SCHEMA;
    },
  },
  async mounted() {
    this.address = this.$route.params.address;

    // await Promise.all([
    //   this.lookupBalance(),
    // ]);
    await this.lookupBalance();
    await this.fetchTransactions();
    await this.fetchInfos(this.$refs.table.page);
    this.loading = false;
  },
  methods: {
    async lookupBalance() {
      console.log((await getBalance(this.address)));
      this.balance = (await getBalance(this.address)).result.value;
    },
    async fetchTransactions() {
      this.transactions = (await getWalletTransactions(this.$route.params.address, 1000)).result;
    },
    async fetchInfos(page) {
      const pageLength = this.$refs.table.pageLength;
      const upperBound = Math.min((page + 1) * pageLength, this.transactions.length);
      const promises = [];

      for (let i = page * pageLength; i < upperBound; i++) {
        promises.push(getBlockTime(this.transactions[i].slot));
        promises.push(getTransactionInfo(this.transactions[i]));
      }

      const infos = await Promise.all(promises);
      for (let i = page * pageLength; i < upperBound; i++) {
        const age = moment.duration(moment().diff(moment.unix(infos[2 * (i - page * pageLength)].result)));
        this.transactions[i].age = ageText(age);
        this.transactions[i].fee = infos[2 * (i - page * pageLength) + 1].result.meta.fee / (10 ** 9);
      }
    },
    async pageChange(page) {
      this.loading = true;
      await this.fetchInfos(page);
      this.loading = false;
    },
  },
  head() {
    return {
      title: `Address: ${this.$route.params.address}`,
    };
  },
};
</script>

<style scoped>

</style>
