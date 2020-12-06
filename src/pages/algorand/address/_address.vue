<template>
  <div>
    <NavBar />
    <AddressDetails
      :roles="this.roles"
      :is-blacklisted="false"
      :balance="this.balance"
      :address="this.address"
    />
    <h1>Address Transactions</h1>
    <div v-if="transactions.length == 0 && !loading">
      No transactions with this wallet address.
    </div>
    <div v-else>
      <Table
        :loading="loading"
        name=""
        :total-items="transactions.length"
        :schema="ALGORAND_TRANSACTION_SCHEMA"
        :content="transactions"
        :key-field="'Transaction Hash'"
      />
    </div>
  </div>
</template>

<script>
import AddressDetails from '@/components/AddressDetails';
import Table from '@/components/Table';
import NavBar from '@/components/NavBar';
import { fetchAlgorand } from '@/utils/algo-utils';
import {
  ALGORAND_TRANSACTION_SCHEMA,
  ALGORAND_USDC_ASSET_ID,
  ALGORAND_TXNS_QUERY_LIMIT,
} from '@/utils/constants';

export default {
  components: {
    NavBar,
    AddressDetails,
    Table,
  },
  data() {
    return {
      balance: null,
      roles: [],
      transactions: [],
      address: this.$route.params.address,
      loading: true,
      assets: null,
      ALGORAND_TRANSACTION_SCHEMA,
    };
  },
  async mounted() {
    this.assets = await fetchAlgorand({
      request: 'assets',
      param: ALGORAND_USDC_ASSET_ID,
    });

    await this.fetchAddress();
    await this.fetchTransactions();
    await this.checkRoles();
    this.loading = false;
  },
  methods: {
    async fetchAddress() {
      try {
        const account = (await fetchAlgorand({
          request: 'account',
          param: this.address,
        })).account;

        this.balance = account.amount / 10 ** this.assets.asset.params.decimals;
      }
      catch (e) {
        this.$router && this.$router.push({ path: '/404' });
      }
    },
    async checkRoles() {
      if (this.address === this.assets.asset.params.reserve) {
        this.roles.push({
          name: 'Reserve',
          color: '#4FE39C',
        });
      }
      if (this.address === this.assets.asset.params.freeze) {
        this.roles.push({
          name: 'Freeze',
          color: '#1AA3FF',
        });
      }
      if (this.address === this.assets.asset.params.creator) {
        this.roles.push({
          name: 'Creator',
          color: '#9F72FF',
        });
      }
      if (this.address === this.assets.asset.params.clawback) {
        this.roles.push({
          name: 'Clawback',
          color: '#FF6678',
        });
      }
      if (this.address === this.assets.asset.params.manager) {
        this.roles.push({
          name: 'Manager',
          color: '#000000',
        });
      }
    },
    async fetchTransactions() {
      this.transactions = (await fetchAlgorand({
        request: 'transactions',
        address: this.address,
        'asset-id': ALGORAND_USDC_ASSET_ID,
        'min-round': 0,
        'limit': ALGORAND_TXNS_QUERY_LIMIT,
        'max-round': this.assets['current-round'],
      })).transactions.reverse();
    },
  },
  head() {
    return {
      title: `Address: ${this.$route.params.address}`,
    };
  },
};
</script>
