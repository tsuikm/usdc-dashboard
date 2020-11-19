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
import Web3 from 'web3';
import { USDC_CONTRACT_ADDRESS, TRANSACTION_TOPIC, API_BASE_URL } from '@/utils/constants';

const web3 = new Web3(Web3.givenProvider);
const abi = [
  {
    constant: true,
    inputs: [],
    name: 'pauser',
    outputs: [{ name: '', type: 'address' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    type: 'function',
  },
];
const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export default {
  name: 'SummaryPage',
  components: {
    NavBar,
    Summary
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
        addresses: [await contract.methods.pauser().call()]
      });

      this.roles.push({
        name: 'Owner',
        addresses: [await contract.methods.owner().call()]
      });

      this.roles.push({
        name: 'Minters',
        addresses: await this.fetch(`${API_BASE_URL}/api/minters`)
      });

      this.roles.push({
        name: 'Blacklister',
        addresses: [await this.fetch(`${API_BASE_URL}/api/blacklister`)]
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

<style lang="scss" scoped>
  #content {
    display: flex;
    height: calc(100% - 10.25rem);
    padding: 10px;
    overflow-y: scroll;

    @media only screen and (max-width: 800px) {
      height: calc(100% - 126px);
    }

    .card {
      margin-left: 1rem;
      margin-right: 1rem;
      min-width: 240px;
      flex: 1;

      h2 {
        margin-bottom: 1rem;
        &:not(:first-of-type) {
          margin-top: 2rem;
        }
      }

      a {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .mono {
        margin-bottom: 0.25rem;
      }

      .list {
        @media screen and (min-width: 800px) {
          height: calc(100% - 4rem);
          overflow-y: scroll;
        }
      }
    }

    #content-blocks {
      flex: 0;
    }

    #content-roles {
      .list {
        height: 100%;
      }
    }

    @media only screen and (max-width: 800px) {
      flex-direction: column;

      .card {
        margin: 1rem 0;
      }
    }
  }
</style>
