<template>
  <div>
    <NavBar />
    <AddressPage 
      :roles="this.roles" 
      :is-blacklisted="this.isBlacklisted"
      :balance="this.balance"
    />
    <h1> Address Transactions </h1>
    <Table
      ref="table"
      :loading="loading"
      name=""
      :total-items="transactions.length"
      :schema="this.tableSchema"
      :content="transactions"
      :key-field="'Transaction Hash'"
      @page:change="this.pageChange"
    />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import AddressPage from '@/components/AddressPage';
import { padHex } from '@/utils/utils';
import { contract, getBalance } from '@/utils/web3utils';
import { getWalletTransactions, fetchAge } from '@/utils/web3utils';
import { TRANSACTION_SCHEMA, WEB3_GET_LOGS_ADDRESS_LENGTH } from '@/utils/constants';
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
      isBlacklisted: false,
      roles: [],
      transactions: [],
      loading: true,
    };
  },
  computed: {
    tableSchema() {
      return TRANSACTION_SCHEMA;
    },
  },
  created: function () {
    this.lookupBalance();
    this.lookupBlacklisted();
    this.checkRoles();
  },
  async mounted() {
    await this.fetchTransactions();
    await this.fetchAges(0);
    this.loading = false;
  },
  methods: {
    async lookupBalance() {
      if (this.$route.params.address === '') {
        return;
      }

      this.balance = await getBalance(this.$route.params.address);
    },
    async lookupBlacklisted() {
      if (this.$route.params.address === '') {
        return;
      }

      this.isBlacklisted = await contract.methods
        .isBlacklisted(this.$route.params.address).call();
    },
    async checkRoles() {
      if (await contract.methods.isMinter(this.$route.params.address).call()) {
        this.roles.push('Minter');
      }
      const pauserAddress = await contract.methods.pauser().call();
      if (pauserAddress === this.$route.params.address) {
        this.roles.push('Pauser');
      }
      const owner = await contract.methods.owner().call();
      if (owner === this.$route.params.address) {
        this.roles.push('Owner');
      }
      const blacklisterAddress = await contract.methods.blacklister().call();
      if (blacklisterAddress === this.$route.params.address) {
        this.roles.push('Blacklister');
      }
    },
    async fetchTransactions() {
      this.transactions = await getWalletTransactions(padHex(this.$route.params.address, WEB3_GET_LOGS_ADDRESS_LENGTH));
    },
    async fetchAges(page) {
      const pageLength = this.$refs.table.pageLength;
      const upperBound = Math.min((page + 1) * pageLength, this.transactions.length);
      const promises = [];
      for (let i = page * pageLength; i < upperBound; i++) {
        promises.push(fetchAge(this.transactions[i]));
      }
      const ages = await Promise.all(promises);
      for (let i = page * pageLength; i < upperBound; i++) {
        this.transactions[i].age = ages[i - page * pageLength];
      }
    },
    pageChange() {},
  },
};
</script>

<style scoped>

</style>
