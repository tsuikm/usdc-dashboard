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
import Table from "@/components/Table";
import Web3 from "web3";
import {
  fromHex,
  removeLeadingZeros,
  removeDuplicates,
  roundToNearest,
  toHex,
  padHex,
} from "@/utils/utils";

import {
  USDC_CONTRACT_ADDRESS,
  WEB3_RESULT_TOO_LARGE_ERROR_CODE,
  WEB3_MAX_TRANSACTIONS,
  TRANSACTION_TOPIC,
  WEB3_GET_LOGS_ADDRESS_LENGTH,
} from "@/utils/constants";

const web3 = new Web3(Web3.givenProvider);
const PERCENTAGE_DECIMAL_PLACES = 8;

export default {
  components: {
    Table
  },
  methods: {
    async getLogs(fromBlock) {
      try {
        // Txns where wallet is receiver
        const receiverTxns = await web3.eth.getPastLogs({
          fromBlock: toHex(fromBlock),
          toBlock: 'latest',
          address: USDC_CONTRACT_ADDRESS
        });
        return receiverTxns
      } catch (e) {
        if (e.code === WEB3_RESULT_TOO_LARGE_ERROR_CODE) {
          // More than MAX_TRANSACTIONS results
          return null;
        }
      }
    },
    async fetchAllAccounts() {
      let addresses = new Set();

      let range = [0, await web3.eth.getBlockNumber()];
      let fromBlock = Math.floor((range[0] + range[1]) / 2);
      let transactions = await this.getLogs(fromBlock);

      // Over MAX_TRANSACTIONS transactions; binary search to find block number that gets us just over MAX_TRANSACTIONS
      while (
        transactions === null ||
        transactions.length < WEB3_MAX_TRANSACTIONS
      ) {
        console.log("hello")
        if (transactions === null) {
          // Still too many transactions
          console.log("in block")
          range[0] = fromBlock;
        } else {
          // Not enough transactions
          range[1] = fromBlock;
        }
        console.log(range)
        fromBlock = Math.floor((range[0] + range[1]) / 2);
        console.log(fromBlock)
        transactions = await this.getLogs(fromBlock);
    }

    transactions.forEach((t) => {
      if (t.topics[1]) {
        addresses.add(t.topics[1]);
      }
      if (t.topics[2]) {
        addresses.add(t.topics[2]);
      }
    });

      let accounts = [];
      let totalBalance = 0;
      
      for (let address of addresses) {
        try {
          let balance = await web3.eth.getBalance(address)/10**6;
          totalBalance += balance
          accounts.push({     
            address: removeLeadingZeros(address),
            balance: balance,
            percentage: 0
          });
        } 
        catch (err) {
            console.log(err)
        }
      }
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
