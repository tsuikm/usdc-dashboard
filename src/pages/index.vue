<template>
  <div>
    <NavBar />
    <Summary
      :roles="this.roles"
      :blocks="this.blocks"
      :transactions="this.transactions"
    />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import Summary from '@/components/Summary';
import { USDC_CONTRACT_ADDRESS, TRANSACTION_TOPIC, API_BASE_URL } from '@/utils/constants';
import { web3, contract } from '@/utils/web3utils';

export default {
  name: 'SummaryPage',
  components: {
    NavBar,
    Summary,
  },
  data() {
    return {
      roles: [],
      blocks: [],
      transactions: [],
    };
  },
  created() {
    this.lookupRoles();
    this.lookupBlocks();
    this.lookupTransactions();
  },
  methods: {
    async fetch(request) {
      const response = await fetch(request);
      return await response.json();
    },
    async lookupRoles() {
      this.roles.push({
        name: 'Pauser',
        addresses: [await contract.methods.pauser().call()],
        icon: 'pauser-icon.svg',
      });

      this.roles.push({
        name: 'Owner',
        addresses: [await contract.methods.owner().call()],
        icon: 'owner-icon.svg',
      });

      this.roles.push({
        name: 'Minters',
        addresses: await this.fetch(`${API_BASE_URL}/api/minters`),
        icon: 'minter-icon.svg',
      });

      this.roles.push({
        name: 'Blacklister',
        addresses: [await contract.methods.blacklister().call()],
        icon: 'blacklister-icon.svg',
      });
    },
    async lookupBlocks() {
      const currentBlock = await web3.eth.getBlockNumber();
      for (let i = 0; i < 20; i++) {
        this.blocks.push(currentBlock - i);
      }
    },
    async lookupTransactions() {
      const currentBlock = await web3.eth.getBlockNumber();
      const txns = await web3.eth.getPastLogs({
        fromBlock: currentBlock - 10,
        toBlock: 'latest',
        address: USDC_CONTRACT_ADDRESS,
        topics: [TRANSACTION_TOPIC, null, null],
      });

      this.transactions = txns.slice(0, 20).map(transaction => transaction.transactionHash);
    },
  },
};
</script>
