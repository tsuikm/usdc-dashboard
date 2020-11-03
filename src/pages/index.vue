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
          <router-link
            :to="'address/' + this.owner"
            class="mono"
          >
            {{ this.owner }}
          </router-link>
        </div>
        <h2>Pausers</h2>
        <div>
          <router-link
            :to="'address/' + this.pauser"
            class="mono"
          >
            {{ this.pauser }}
          </router-link>
        </div>
        <h2>Minters</h2>
        <div>
          <router-link
            v-for="minter in minters"
            :key="minter"
            :to="'address/' + minter"
            class="mono"
          >
            {{ minter }}
          </router-link>
        </div>
      </div>
      <div
        id="content-blocks"
        class="card"
      >
        <h2>Latest Blocks</h2>
        <router-link to="/blocks">
          See all blocks
        </router-link>
        <nuxt-link
          v-for="block in blocks"
          :key="block"
          :to="'block/' + block.decimal"
          class="mono"
        >
          {{ block.decimal }} / {{ block.hex }}
        </nuxt-link>
      </div>
      <div
        id="content-transactions"
        class="card"
      >
        <h2>Recent Transactions</h2>
        <router-link to="/transactions">
          See all transactions
        </router-link>
        <router-link
          v-for="transaction in transactions"
          :key="transaction.transactionHash"
          :to="'transaction/' + transaction.transactionHash"
          class="mono"
        >
          {{ transaction.transactionHash }}
        </router-link>
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
      const mintersResponse = await fetch('http://localhost:3000/api/minters');
      this.minters = await mintersResponse.json();
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

    .card {
      margin-left: 1rem;
      margin-right: 1rem;
      min-width: 240px;
      flex: 1;

      @media screen and (min-width: 800px) {
        overflow-y: scroll;
      }

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
