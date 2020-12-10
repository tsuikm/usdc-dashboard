<template>
  <div>
    <NavBar />
    <Table
      :name="'Accounts'"
      :loading="loading"
      :schema="this.tableSchema"
      :content="this.accounts"
      :key-field="'address'"
    />
  </div>
</template>

<script>

// modules
import NavBar from '@/components/NavBar';
import Table from '@/components/Table';
// import { getBalance, getTotalSupply, getAllTransactions } from '@/utils/web3utils';
import { ACCOUNTS_SCHEMA, getTopAccounts, getTokenInformation } from '@/utils/solana';

export default {
  components: {
    Table,
    NavBar,
  },
  data() {
    return {
      accounts: [],
      loading: true,
      supply: 1,
    };
  },
  computed: {
    tableSchema() {
      return ACCOUNTS_SCHEMA;
    },
  },
  async created() {
    this.accounts = (await getTopAccounts()).result.value;
    this.supply = (await getTokenInformation()).result.value.data.parsed.info.supply / (10 ** 6);

    for (let account of this.accounts) {
      account.percentage = (account.uiAmount / this.supply * 100).toFixed(2) + '%';
    }
    
    this.loading = false;
  },
  methods: {},
  head() {
    return {
      title: 'Accounts',
    };
  },
};
</script>
