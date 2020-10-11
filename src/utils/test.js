import { TRANSACTION_TOPIC } from './constants'

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
 */
export default (MOCK_ACCOUNTS, MOCK_TRANSACTIONS, VALID_ADDRESSES, CONTRACT_ADDRESSES) => {
  return class Web3 {
    get eth() {
      return {
        Contract: class {
          constructor() {
            this.methods = {
              balanceOf: address => {
                return {
                  call: async () => MOCK_ACCOUNTS[address].balance
                };
              },
              decimals: () => {
                return {
                  call: async () => 6
                }
              },
              isMinter: address => {
                return {
                  call: async () => MOCK_ACCOUNTS[address].minter
                }
              },
              isPauser: address => {
                return {
                  call: async () => MOCK_ACCOUNTS[address].pauser
                }
              },
              isOwner: address => {
                return {
                  call: async () => MOCK_ACCOUNTS[address].owner
                }
              },
              isBlacklisted: address => {
                return {
                  call: async () => MOCK_ACCOUNTS[address].blacklisted
                }
              }
            };
          }
        },
        getBlockNumber: async () => {
          // Map MOCK_TRANSACTIONS to block numbers, take max
          // max of the block numbers
          return Math.max(...MOCK_TRANSACTIONS.map(transaction => transaction.blockNumber));
        },
        getBlock: async (blockNumber) => {
          return {
            // The only part of getBlock that is used is the timestamp
            // We simulate timestamp to be blockNumber * 1000
            timestamp: blockNumber * 1000
          }
        },
        getPastLogs: async ({ fromBlock, toBlock, topics }) => {
          if (toBlock === 'latest') toBlock = await this.getBlockNumber()

          return MOCK_TRANSACTIONS.filter(transaction => {
            // Filter out transactions before from
            if (transaction.blockNumber < fromBlock) return false;

            // Filter out transactions after to
            if (transaction.blockNumber > toBlock) return false;

            // Filter out transactions sent from not topics[1]
            if (topics[1] && transaction.sender !== topics[1]) return false;

            // Filter out transactions received by not topics[2]
            if (topics[2] && transaction.receiver !== topics[2]) return false;

            return true;
          }).map(transaction => {
            return {
              data: transaction.data,
              transactionHash: transaction.transactionHash,
              blockNumber: transaction.blockNumber,
              topics: [TRANSACTION_TOPIC, transaction.sender, transaction.receiver],
            }
          })
        },
        getCode: async (address) => {
          if (CONTRACT_ADDRESSES.includes(address)) {
            return "0xabcdef1234567890"
          }

          return "0x"
        },
      }
    }

    get utils() {
      return {
        isAddress: address => VALID_ADDRESSES.includes(address)
      }
    }
  }
}
