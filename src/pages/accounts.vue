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
      async fetchAllAccounts() {
        const latest = await web3.eth.getBlockNumber();
        let addresses = new Set();
        let blockNum = 0;
        while (true) {
            let blck = blockNum++
            let block = await web3.eth.getBlock(blck)
            if (!block)
            break
            
            for(let i = 0; i < block.transactions.length; i++) {
                let tx = await web3.eth.getTransaction(block.transactions[i]);
                if (tx.to !== null) {
                  addresses.add(removeLeadingZeros(tx.to));
                }
                if (tx.from !== null) {
                  addresses.add(removeLeadingZeros(tx.from));;
                }
            }
        }

        let accounts = [];
        let totalBalance = 0;
        
        for (let address of addresses) {
            try {
                let balance = await web3.eth.getBalance(address);
                totalBalance += balance
                accounts.push(
                    {
                        address: address,
                        balance: balance,
                        percentage: 0
                });
            } catch (err) {
                console.log(err)
            }
        }
        accounts.sort((a,b) => (a.balance - b.balance)); 
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
