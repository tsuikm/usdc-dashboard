<template>
  <div>
    <AddressDetails
      :roles="this.roles"
      :is-blacklisted="this.isBlacklisted"
      :balance="this.balance"
    >
      <div class="blacklisted">
        <h2> Blacklisted? </h2>
        <div class="page-blacklisted">
          <div v-if="this.isBlacklisted">
            Yes
          </div>
          <div v-else>
            No
          </div>
        </div>
      </div>
    </AddressDetails>

    <h1> Address Transactions </h1>
    <div v-if="transactions.length == 0 && !loading">
      No transactions with this wallet address.
    </div>
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
import AddressDetails from '@/components/AddressDetails';
import { padHex } from '@/utils/utils';
import { contract, getBalance } from '@/utils/web3utils';
import { getWalletTransactions, fetchAge, web3 } from '@/utils/web3utils';
import { TRANSACTION_SCHEMA, WEB3_GET_LOGS_ADDRESS_LENGTH, WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import Table from '@/components/Table';

export default {
  components: {
    AddressDetails,
    Table,
  },
  data() {
    return {
      balance: null,
      isBlacklisted: false,
      roles: [],
      transactions: [],
      address: null,
      loading: true,
    };
  },
  computed: {
    tableSchema() {
      return TRANSACTION_SCHEMA;
    },
  },
  async mounted() {
    this.address = this.$route.params.address;
    if (!this.address.startsWith('0x')) {
      this.address = '0x' + this.address;
    }

    if (this.address.length > WEB3_BALANCEOF_ADDRESS_LENGTH + 2) {
      // Too long to be a valid Ethereum address
      this.$router.replace('/404');
      return;
    }

    this.address = padHex(this.address, WEB3_BALANCEOF_ADDRESS_LENGTH);

    if (!web3.utils.isAddress(this.address)) {
      // Not a valid Ethereum address
      this.$router.replace('/404');
      return;
    }

    await Promise.all([
      this.lookupBalance(),
      this.lookupBlacklisted(),
      this.checkRoles(),
      this.fetchTransactions(),
    ]);
    if (this.transactions.length != 0) {
      await this.fetchAges(this.$refs.table.page);
    }
    this.loading = false;
  },
  methods: {
    async lookupBalance() {
      this.balance = await getBalance(this.address);
    },
    async lookupBlacklisted() {
      this.isBlacklisted = await contract.methods
        .isBlacklisted(this.address).call();
    },
    async checkRoles() {
      if (await contract.methods.isMinter(this.address).call()) {
        this.roles.push({
          name: 'Minter',
          color: '#4FE39C',
        });
      }
      const pauserAddress = await contract.methods.pauser().call();
      if (pauserAddress === this.address) {
        this.roles.push({
          name: 'Pauser',
          color: '#1AA3FF',
        });
      }
      const owner = await contract.methods.owner().call();
      if (owner === this.address) {
        this.roles.push({
          name: 'Owner',
          color: '#9F72FF',
        });
      }
      const blacklisterAddress = await contract.methods.blacklister().call();
      if (blacklisterAddress === this.address) {
        this.roles.push({
          name: 'Blacklister',
          color: '#FF6678',
        });
      }
    },
    async fetchTransactions() {
      this.transactions = await getWalletTransactions(padHex(this.address, WEB3_GET_LOGS_ADDRESS_LENGTH));
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
    async pageChange(page) {
      this.loading = true;
      await this.fetchAges(page);
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
.page-blacklisted {
  padding-top: 5%;
}
.blacklisted {
  font-weight: bold;
}
</style>
