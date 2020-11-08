import { TRANSACTION_TOPIC } from '@/utils/constants';
import { fromHex } from '@/utils/utils';

/**
 * Transaction: {
 *    transactionHash: String,
 *    data: String, // amount transfered in hex, times 10 ** 6
 *    sender: String, // hex for sender address
 *    receiver: String, // hex for receiver address
 *    blockNumber: Number
 * }
 *
 * Account: {
 *    balance: Number,
 *    minter: Boolean,
 *    pauser: Boolean,
 *    owner: Boolean,
 *    blacklisted: Boolean
 * }
 *
 * @param {Object<key: String, value: Account>} MOCK_ACCOUNTS Map of wallet addresses to accounts
 * @param {Transaction[]} MOCK_TRANSACTIONS Array of mock transactions (Transaction structure above)
 * @param {String[]} VALID_ADDRESSES Array of valid addresses (for utils.isAddress)
 * @param {String[]} CONTRACT_ADDRESSES Subset of VALID_ADDRESSES that are contract addresses (for getCode)
 * @param {Integer} TOTAL_SUPPLY Total supply
 * @param {String} PAUSER - the address of the pauser.
 * @param {String} BLACKLISTER - the address of the blacklister.
 * @param {String} MASTER_MINTER - the address of the master_minter.
 * @param {String} OWNER - the address of the owner.
 */
export default class Web3 {
  static MOCK_ACCOUNTS = {};
  static MOCK_TRANSACTIONS = []
  static VALID_ADDRESSES = [];
  static CONTRACT_ADDRESSES = [];
  static TOTAL_SUPPLY = 0;
  static PAUSER = null;
  static BLACKLISTER = null;
  static MASTER_MINTER = null;
  static OWNER = null;

  get eth() {
    return {
      Contract: class {
        constructor() {
          this.methods = {
            balanceOf: address => {
              return {
                call: async () => Web3.MOCK_ACCOUNTS[address].balance,
              };
            },
            decimals: () => {
              return {
                call: async () => 6,
              };
            },
            isMinter: address => {
              return {
                call: async () => {
                  return Web3.MOCK_ACCOUNTS[address].minter;
                },
              };
            },
            pauser: () => {
              return {
                call: async () => Web3.PAUSER,
              };
            },
            owner: () => {
              return {
                call: async () => Web3.OWNER,
              };
            },
            masterMinter: () => {
              return {
                call: async () => Web3.MASTER_MINTER,
              };
            },
            blacklister: () => {
              return {
                call: async () => Web3.BLACKLISTER,
              };
            },
            isBlacklisted: address => {
              return {
                call: async () => Web3.MOCK_ACCOUNTS[address].blacklisted,
              };
            },
            totalSupply: () => {
              return {
                call: async () => Web3.TOTAL_SUPPLY.toString(),
              };
            },
            updatePauser: address => {
              return {
                call: async () => { Web3.PAUSER = address; }
              }
            },
            updateBlacklister: address => {
              return {
                call: async () => { Web3.BLACKLISTER = address; }
              }
            },
            transferOwnershp: address => {
              return {
                call: async () => { Web3.OWNER = owner; }
              }
            },
            updateMasterMinter: address =>{
              return {
                call: async () => { Web3.MASTER_MINTER = owner; }
              }
            }
          };
        }
      },
      async getBlockNumber() {
        // Map MOCK_TRANSACTIONS to block numbers, take max
        return Math.max(...Web3.MOCK_TRANSACTIONS.map(transaction => transaction.blockNumber));
      },
      async getBlock(blockNumber) {
        return {
          // The only part of getBlock that is used is the timestamp
          // We simulate timestamp to be blockNumber * 1000
          timestamp: blockNumber * 1000,
        };
      },
      async getPastLogs({ fromBlock, toBlock, topics }) {
        if (toBlock === 'latest') toBlock = await this.getBlockNumber();

        return Web3.MOCK_TRANSACTIONS.filter(transaction => {
          // Filter out transactions before from
          if (transaction.blockNumber < fromBlock) return false;

          // Filter out transactions after to
          if (transaction.blockNumber > toBlock) return false;

          // Filter out transactions sent from not topics[1]
          if (topics && topics[1] && transaction.sender !== topics[1]) {
            return false;
          }

          // Filter out transactions received by not topics[2]
          if (topics && topics[2] && transaction.receiver !== topics[2]) return false;

          return true;
        }).map(transaction => {
          return {
            data: transaction.data,
            transactionHash: transaction.transactionHash,
            blockNumber: transaction.blockNumber,
            topics: [TRANSACTION_TOPIC, transaction.sender, transaction.receiver],
          };
        });
      },
      async getCode(address) {
        if (Web3.CONTRACT_ADDRESSES.includes(address)) {
          return '0xabcdef1234567890';
        }

        return '0x';
      },
      async getTransaction(hash) {
        for (const transaction of Web3.MOCK_TRANSACTIONS) {
          if (fromHex(transaction.transactionHash) === fromHex(hash)) {
            return transaction;
          }
        }
        throw new Error();
      },
    };
  }

  get utils() {
    return {
      isAddress: address => Web3.VALID_ADDRESSES.includes(address),
    };
  }
}
