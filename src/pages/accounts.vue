<template>
  <div>
    <Table
      :name="'Accounts'"
      :totalItems="this.totalItems"
      :schema="this.tableSchema"
      :content="this.accounts"
      :keyField="'address'"
      @page:change="this.pageChange"
      ref="table"
    />
  </div>
</template>

<script>

// modules
import Table from '@/components/Table';
import Web3 from 'web3';
import * as constants from '@/utils/constants';
import { toHex, padHex, removeLeadingZeros, roundToNearest } from '@/utils/utils';

const PERCENTAGE_DECIMAL_PLACES = 8;
const web3 = new Web3(Web3.givenProvider);

export default {
  components: {
    Table
  },
  methods: {

    /**
     * Gets the transactions from one block to another block.
     *
     * @param {number} from - as a base-10 number.
     * @param {number} to - as a base-10 number.
     * @returns {Object[]|null} - returns null if there are more than MAX_TRANSACTIONS results.
     */
    async getTransactions(from, to) {
      try {
        return await web3.eth.getPastLogs({
          fromBlock: toHex(from),
          toBlock: toHex(to),
          address: constants.USDC_CONTRACT_ADDRESS
        });
      }
      catch (error) {
        if (error.code === constants.WEB3_RESULT_TOO_LARGE_ERROR_CODE) {
          // More than MAX_TRANSACTIONS results
          return null;
        }
        throw error;
      }
    },


    async fetchAllAccounts() {
      const addresses = new Set();
      const latest = await web3.eth.getBlockNumber();

      const range = [0, latest];

      let fromBlock = Math.floor((range[0] + range[1]) / 2);
      let transactions = await this.getTransactions(fromBlock, latest);

      // Binary search to find block number that gets us just over MAX_TRANSACTIONS
      while (transactions === null ||transactions.length < constants.WEB3_MAX_TRANSACTIONS - 1) {
        if (transactions === null) {
          // Still too many transactions
          range[0] = fromBlock;
        } else {
          // Not enough transactions
          range[1] = fromBlock;
        }
        fromBlock = Math.floor((range[0] + range[1]) / 2);
        transactions = await this.getTransactions(fromBlock, latest);
      }

      transactions.forEach((t) => {
        if (t.topics[1]) {
          addresses.add(removeLeadingZeros(t.topics[1]));
        }
        if (t.topics[2]) {
          addresses.add(removeLeadingZeros(t.topics[2]));
        }
      });

      let accounts = [];
      let totalBalance = 0;

      for (let address of addresses) {
        try {
          const paddedAddress = padHex(address, constants.WEB3_BALANCEOF_ADDRESS_LENGTH)

          let balance = await web3.eth.getBalance(paddedAddress)/10**6;
          totalBalance += balance
          accounts.push({
            address: address,
            balance: balance,
            percentage: 0
          });
          console.log(balance)
        }
        catch (err) {
            console.log(err)
        }
      }
      console.log(accounts.length)
      accounts.sort((a,b) => (b.balance - a.balance));
      for (let account of accounts) {
        account.percentage = roundToNearest(account.balance*100/totalBalance, PERCENTAGE_DECIMAL_PLACES) + '%'
      }
      this.totalBalance = totalBalance;
      this.accounts = accounts;
    },
      async pageChange(page) {
        console.log("hi")
    },
  },
  computed: {
    totalItems() {
      // TODO: this number is hard-coded. We need to calculate the total number of transactions
      return 5500;
    },
    tableSchema() {
      return [
        {
          name: 'Address',
          getter(account) {
              return account.address;
          },
          link(account) {
              return `/address/${account.address}`;
          },
        },
        {
          name: 'Balance',
          getter(account) {
              return account.balance;
          },
        },
        {
          name: 'Percentage',
          getter(account) {
              return account.percentage;
          }
        }
      ];
    },
    pageLength() {
        return this.$refs.table.pageLength;
    }
  },
  data() {
    return {
      totalBalance: 0,
      accounts: [],
      page: 0
    };
  },
  async created() {
    await this.fetchAllAccounts()
  }
};
</script>
