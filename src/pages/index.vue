<template>
  <div id="root">
    <NavBar />
    <h1>USDC Dashboard</h1>
    <div id="content">
      <div
        id="content-roles"
        class="card"
      >
        <h2>Owner</h2>
        <div>
          <nuxt-link
            :to="'address/' + this.owner"
            class="mono"
          >
            {{ this.owner }}
          </nuxt-link>
        </div>
        <h2>Pausers</h2>
        <div>
          <nuxt-link
            :to="'address/' + this.pauser"
            class="mono"
          >
            {{ this.pauser }}
          </nuxt-link>
        </div>
        <h2>Blacklister</h2>
        <div>
          <nuxt-link
            :to="'address/' + blacklister"
            class="mono"
          >
            {{ blacklister }}
          </nuxt-link>
        </div>
        <h2>Minters</h2>
        <div>
          <nuxt-link
            v-for="minter in minters"
            :key="minter"
            :to="'address/' + minter"
            class="mono"
          >
            {{ minter }}
          </nuxt-link>
        </div>
      </div>
      <div
        id="content-blocks"
        class="card"
      >
        <h2>Latest Blocks</h2>
        <nuxt-link to="/blocks">
          See all blocks
        </nuxt-link>
        <div class="list">
          <nuxt-link
            v-for="block in blocks"
            :key="block.hex"
            :to="'block/' + block.decimal"
            class="mono"
          >
            {{ block.decimal }} / {{ block.hex }}
          </nuxt-link>
        </div>
      </div>
      <div
        id="content-transactions"
        class="card"
      >
        <h2>Recent Transactions</h2>
        <nuxt-link to="/transactions">
          See all transactions
        </nuxt-link>
        <div class="list">
          <nuxt-link
            v-for="transaction in transactions"
            :key="transaction.logIndex"
            :to="'transaction/' + transaction.transactionHash"
            class="mono"
          >
            {{ transaction.transactionHash }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import Web3 from 'web3';
import { USDC_CONTRACT_ADDRESS, TRANSACTION_TOPIC } from '@/utils/constants';
import { toHex } from '@/utils/utils';

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
  },
  data() {
    return {
      owner: '',
      pauser: '', 
      minters: [],
      blacklister: '',
      blocks: [],
      transactions: [],
    };
  },
  created: function () {
    this.lookupRoles();
    this.lookupBlocks();
    this.lookupTransactions();
  },
  methods: {
    async lookupRoles() {
      contract.methods.pauser().call((error, pauser) => {
        this.pauser = pauser;
      });

      contract.methods.owner().call((error, owner) => {
        this.owner = owner;
      });

      // TODO: update localhost:3000 with actual domain, or use env vars
      fetch('http://localhost:3000/api/minters').then(async (mintersResponse) => {
        this.minters = await mintersResponse.json();
      });
      
      fetch('http://localhost:3000/api/blacklister').then(async (blacklisterResponse) => {
        this.blacklister = await blacklisterResponse.json();
      });
    },
    async lookupBlocks() {
      const currentBlock = await web3.eth.getBlockNumber();
      this.blocks = [];
      for (let i = 0; i < 20; i++) this.blocks.push({
        decimal: currentBlock - i,
        hex: toHex(currentBlock - i),
      });
    },
    async lookupTransactions() {
      const currentBlock = await web3.eth.getBlockNumber();
      const txns = await web3.eth.getPastLogs({
        fromBlock: currentBlock - 10,
        toBlock: 'latest',
        address: USDC_CONTRACT_ADDRESS,
        topics: [TRANSACTION_TOPIC, null, null],
      });

      this.transactions = txns.slice(0, 20);
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

    @media only screen and (max-width: 800px) {
      flex-direction: column;

      .card {
        margin: 1rem 0;
      }
    }
  }
</style>
