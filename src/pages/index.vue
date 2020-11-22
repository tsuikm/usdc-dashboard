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
      roles: [
        {
          name: 'Owner',
          addresses: [],
          icon: 'owner-icon.svg',
        },
        {
          name: 'Pauser',
          addresses: [],
          icon: 'pauser-icon.svg',
        },
        {
          name: 'Minters',
          addresses: [],
          icon: 'minter-icon.svg',
        },
        {
          name: 'Blacklister',
          addresses: [],
          icon: 'blacklister-icon.svg',
        },
      ],
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
    setAddresses(roleName, addresses) {
      const role = this.roles.find(role => role.name === roleName);

      for (const address of addresses) {
        role.addresses.push(address);
      }
    },
    async lookupRoles() {
      this.setAddresses('Owner', [await contract.methods.owner().call()]);
      this.setAddresses('Pauser', [await contract.methods.pauser().call()]);
      this.setAddresses('Minters', await this.fetch(`${API_BASE_URL}/api/minters`));
      this.setAddresses('Blacklister', [await contract.methods.blacklister().call()]);
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
