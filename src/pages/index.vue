<template>
  <div id="root">
    <NavBar />
    <h1>USDC Dashboard</h1>
    <div id="content">
      <div
        id="content-roles"
        class="card"
      >
        <div class="list">
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
import { API_BASE_URL } from '@/utils/constants';
import { toHex } from '@/utils/utils';
import { web3, contract, getTransactions } from '@/utils/web3utils';

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

      fetch(`${API_BASE_URL}/api/minters`).then(async (mintersResponse) => {
        this.minters = await mintersResponse.json();
      });
      
      fetch(`${API_BASE_URL}/api/blacklister`).then(async (blacklisterResponse) => {
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
      this.transactions = (await getTransactions(toHex(currentBlock - 10000))).slice(0, 20);
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
