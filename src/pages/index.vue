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
        <a>
          <router-link
            :to="'address/' + this.pauser"
            class="mono"
          >
            {{ this.pauser }}
          </router-link>
        </a>
        <h2>Minters</h2>
      </div>
      <div
        id="content-blocks"
        class="card"
      >
        <h2>Blocks</h2>
      </div>
      <div
        id="content-transactions"
        class="card"
      >
        <h2>Transactions</h2>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import Web3 from 'web3';
import { USDC_CONTRACT_ADDRESS } from '@/utils/constants';
import { BigQuery } from '@google-cloud/bigquery';

const bigqueryClient = new BigQuery();

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
      owner: String,
      pauser: String, 
    };
  },
  created: function () {
    this.lookupRoles();
  },
  methods: {
    async lookupRoles() {
      contract.methods.pauser().call((error, pauser) => {
        this.pauser = pauser;
      });
      contract.methods.owner().call((error, owner) => {
        this.owner = owner;
      });
    },
    async queryMinterConfigured() {
      const sqlQuery = 'SELECT * FROM `blockchain-etl.ethereum_usdc.FiatTokenV1_event_MinterConfigured` LIMIT 1000';
    },
  },
};
</script>

<style lang="scss" scoped>
  #content {
    display: flex;
    height: calc(100% - 10.25rem);

    .card {
      &:not(:first-child) {
        margin-left: 1rem;
      }

      &:not(:last-child) {
        margin-right: 1rem;
      }

      flex: 1;

      h2 {
        margin-bottom: 1rem;
        &:not(:first-of-type) {
          margin-top: 2rem;
        }
      }

      .mono {
        margin-bottom: 0.5rem;
      }
    }
  }
</style>
