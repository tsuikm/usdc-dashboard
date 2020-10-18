<template>
  <div>
    <NavBar />
    <Table
      :name="'Accounts'"
      :totalItems="this.totalItems"
      :schema="this.tableSchema"
      :content="this.accounts"
      :keyField="'address'"
    />
  </div>
</template>

<script>

// modules
import NavBar from '@/components/NavBar';
import Table from '@/components/Table';
import Web3 from 'web3';
import * as constants from '@/utils/constants';
import { toHex, removeLeadingZeros, roundToNearest, pushAll } from '@/utils/utils';
import { getBalance, getTotalSupply } from '@/components/Overview';

const PERCENTAGE_DECIMAL_PLACES = 8;
const web3 = new Web3(Web3.givenProvider);

/**
 * Gets the transactions from one block to another block.
 *
 * @param {number} from - as a base-10 number.
 * @param {number} to - as a base-10 number.
 * @return {Object[]|null} - returns null if there are more than MAX_TRANSACTIONS results.
 */
async function getTransactions(from, to) {
  try {
    return await web3.eth.getPastLogs({
      fromBlock: toHex(from),
      toBlock: toHex(to),
      address: constants.USDC_CONTRACT_ADDRESS,
    });
  }
  catch (error) {
    if (error.code === constants.WEB3_RESULT_TOO_LARGE_ERROR_CODE) {
      // More than MAX_TRANSACTIONS results
      return null;
    }
    throw error;
  }
}

/**
 * Gets all transactions in the entire block-chain, capped at MAX_TRANSACTIONS.
 *
 * @return {Object[]}
 */
export async function getAllTransactions() {
  const latest = await web3.eth.getBlockNumber();

  // Range of the possible 'from' block numbers that gets MAX_TRANSACTIONS.
  const range = [0, latest];
  let midpoint = Math.floor((range[0] + range[1]) / 2);
  let transactions = await getTransactions(midpoint, latest);

  // Binary search to find the block number that gets MAX_TRANSACTIONS.
  while (transactions === null || transactions.length < constants.WEB3_MAX_TRANSACTIONS - 1) {

    // If the range is too small, find the first non-null result.
    if (range[1] - range[0] <= 1) {
      let i = 0;
      while (transactions === null) {
        transactions = await getTransactions(midpoint + i++, latest);
      }
      break;
    }

    if (transactions === null) {
      // Still too many transactions.
      range[0] = midpoint;
    }
    else {
      // Not enough transactions.
      range[1] = midpoint;
    }
    midpoint = Math.floor((range[0] + range[1]) / 2);
    transactions = await getTransactions(midpoint, latest);
  }
  return transactions;
}

export default {
  components: {
    Table,
    NavBar
  },
  data() {
    return {
      accounts: []
    };
  },
  async created() {
    this.accounts = await this.getAccounts();
  },
  methods: {
    /**
     * Indicates if the passed-in address is 'valid'. A valid address is truth-y and has less than
     * WEB3_BALANCEOF_ADDRESS_LENGTH digits (not including '0x').
     * Addresses that are too long are not compatible with getBalance.
     *
     * @param {string|null} address
     * @return {boolean}
     */
    isValidAddress(address) {
      return address && removeLeadingZeros(address).length <= constants.WEB3_BALANCEOF_ADDRESS_LENGTH + 2;
    },

    /**
     * Gets the corresponding balances of an Iterable containing addresses.
     * Uses Promise.all() to aggregate the responses.
     *
     * @param {Iterable.<string>} addresses
     * @return {string[]}
     */
    async getBalancesFor(addresses) {
      // Get the promises that resolve to the balance of every chunk of OPTIMAL_PROMISE_ALL_SIZE addresses.
      const balances = [];
      let balancePromises = [];

      for (const address of addresses) {
        if (balancePromises.length < constants.OPTIMAL_PROMISE_ALL_SIZE) {
          balancePromises.push(getBalance(address));
        }
        else {
          pushAll(balances, await Promise.all(balancePromises));
          balancePromises = [];
        }
      }
      pushAll(balances, await Promise.all(balancePromises));
      return balances;
    },

    /**
     * Gets all accounts (addresses) and their balances/percentages.
     *
     * @return {Object[]}
     */
    async getAccounts() {
      const transactions = await getAllTransactions();

      // Get all of the valid addresses of all transactions in a Set.
      const addresses = new Set();
      for (const txn of transactions) {
        this.isValidAddress(txn.topics[1]) && addresses.add(removeLeadingZeros(txn.topics[1]));
        this.isValidAddress(txn.topics[2]) && addresses.add(removeLeadingZeros(txn.topics[2]));
      }

      // Fetch the totalSupply of USDC and all of the balances of each address.
      const totalSupply = await getTotalSupply();
      const balances = await this.getBalancesFor(addresses);

      const accounts = [];
      let i = 0;
      for (const address of addresses) {
        const balance = balances[i++];
        const percentage = `${roundToNearest(balance / totalSupply * 100, PERCENTAGE_DECIMAL_PLACES)}%`;

        accounts.push({address, balance, percentage});
      }

      // Sort (in reverse order) the account addresses by balance.
      accounts.sort((a, b) => b.balance - a.balance);
      return accounts;
    }
  },
  computed: {
    totalItems() {
      return this.accounts.length;
    },
    tableSchema() {
      return [
        {
          name: 'Address',
          getter: account => account.address,
          link: account => `/address/${account.address}`
        },
        {
          name: 'Balance',
          getter: account => account.balance
        },
        {
          name: 'Percentage',
          getter: account => account.percentage
        }
      ];
    }
  }
};
</script>
