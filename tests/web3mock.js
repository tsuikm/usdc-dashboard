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
 *    blacklister: Boolean,
 *    blacklisted: Boolean,
 *    masterMinter: boolean,
 *    minterAllowance: int,
 * }
 *
 * @param {Object<key: String, value: Account>} MOCK_ACCOUNTS Map of wallet addresses to accounts
 * @param {Transaction[]} MOCK_TRANSACTIONS Array of mock transactions (Transaction structure above)
 * @param {String[]} VALID_ADDRESSES Array of valid addresses (for utils.isAddress)
 * @param {String[]} CONTRACT_ADDRESSES Subset of VALID_ADDRESSES that are contract addresses (for getCode)
 * @param {Integer} TOTAL_SUPPLY Total supply
 */
export default class Web3 {
  static MOCK_ACCOUNTS = {};
  static MOCK_TRANSACTIONS = []
  static VALID_ADDRESSES = [];
  static CONTRACT_ADDRESSES = [];
  static TOTAL_SUPPLY = 0;
  static PAUSED = false;

  /**
   * Finds the account address that matches the predicate when the account object is passed in.
   * @private
   *
   * @param {function(account: Object):boolean} predicate.
   * @return {String} - the account address.
   */
  static _findAccount(predicate) {
    return Object.keys(Web3.MOCK_ACCOUNTS).find(address => predicate(Web3.MOCK_ACCOUNTS[address]));
  }

  /**
   * Updates the address of an exclusive role. Pausers/Owners/MasterMinters/Blacklisters are exclusive (ie. there can
   * only be one of less of each).
   * So, for instance, _updateExclusiveRole('0x001', 'pauser') sets the '0x001' account to be the only pauser.
   * @private
   *
   * @param {String} address - the address of the exclusive role.
   * @param {String} role - the role given to the address. Must be a key in the Account definition above.
   */
  static _updateExclusiveRole(address, role) {
    if (!Object.prototype.hasOwnProperty.call(Web3.MOCK_ACCOUNTS, address)) {
      Web3.MOCK_ACCOUNTS[address] = {};
    }

    // Only give the role to the passed-in address.
    for (const [accountAddress, account] of Object.entries(Web3.MOCK_ACCOUNTS)) {
      account[role] = (accountAddress === address);
    }
  }

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
            paused: () => {
              return {
                call: async () => Web3.PAUSED,
              };
            },
            pauser: () => {
              return {
                call: async () => Web3._findAccount(account => account.pauser),
              };
            },
            owner: () => {
              return {
                call: async () => Web3._findAccount(account => account.owner),
              };
            },
            masterMinter: () => {
              return {
                call: async () => Web3._findAccount(account => account.masterMinter),
              };
            },
            blacklister: () => {
              return {
                call: async () => Web3._findAccount(account => account.blacklister),
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
            updatePauser: pauser => {
              const updatePauser = async () => Web3._updateExclusiveRole(pauser, 'pauser');
              return {
                call: updatePauser,
                encodeABI: () => updatePauser,
              };
            },
            updateBlacklister: blacklister => {
              const updateBlacklister = async () => Web3._updateExclusiveRole(blacklister, 'blacklister');
              return {
                call: updateBlacklister,
                encodeABI: () => updateBlacklister,
              };
            },
            transferOwnership: owner => {
              const updateOwner = async () => Web3._updateExclusiveRole(owner, 'owner');
              return {
                call: updateOwner,
                encodeABI: () => updateOwner,
              };
            },
            updateMasterMinter: masterMinter => {
              const updateMasterMinter = async () => Web3._updateExclusiveRole(masterMinter, 'masterMinter');
              return {
                call: updateMasterMinter,
                encodeABI: () => updateMasterMinter,
              };
            },
            transfer: (address, amount) => {
              return {
                call: async () => Web3.MOCK_ACCOUNTS[address].balance += amount,
                encodeABI: () => address + ', ' + amount,
              };
            },
            mint: (address, amount) => {
              return {
                call: async () => Web3.MOCK_ACCOUNTS[address].balance += amount,
                encodeABI: () => address + ', ' + amount,
              };
            },
            burn: (amount) => {
              return {
                call: async () => amount,
                encodeABI: () => amount,
              };
            },
            pause: () => {
              const pause = async () => { Web3.PAUSED = true; };
              return {
                call: pause,
                encodeABI: () => pause,
              };
            },
            unpause: () => {
              const unpause = async () => { Web3.PAUSED = false; };
              return {
                call: unpause,
                encodeABI: () => unpause,
              };
            },
            blacklist: (address) => {
              const blacklist = async () => Web3.MOCK_ACCOUNTS[address].blacklisted = true;
              return {
                call: blacklist,
                encodeABI: () => blacklist,
              };
            },
            unBlacklist: (address) => {
              const unblacklist = async () => Web3.MOCK_ACCOUNTS[address].blacklisted = false;
              return {
                call: unblacklist,
                encodeABI: () => unblacklist,
              };
            },
            minterAllowance: address => {
              return {
                call: async () => Web3.MOCK_ACCOUNTS[address].minterAllowance,
              };
            },
            configureMinter: (address, allowance) => {
              const configureMinter = async () => { 
                Web3.MOCK_ACCOUNTS[address].minter = true;
                Web3.MOCK_ACCOUNTS[address].minterAllowance = allowance;
              };
              return {
                call: configureMinter,
                encodeABI: () => configureMinter,
              };
            },
            removeMinter: (address) => {
              const removeMinter = async () => { 
                Web3.MOCK_ACCOUNTS[address].minter = false;
                Web3.MOCK_ACCOUNTS[address].minterAllowance = 0;
              };
              return {
                call: removeMinter,
                encodeABI: () => removeMinter,
              };
            },
          };
          this.pauseEvent = 'pause';
          this.unpauseEvent = 'unpause';
          this.blacklistEvent = 'blacklist';
          this.unBlacklistEvent = 'unblacklist';
          this.configureMinterEvent = 'configureMinter';
          this.removeMinterEvent = 'removeMinter';
        }
        async once(event, callback) {
          callback();
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
      async getAccounts(callback) {
        callback(undefined, Web3.MOCK_ACCOUNTS ? Object.keys(Web3.MOCK_ACCOUNTS) : []);
      },
    };
  }

  get utils() {
    return {
      isAddress: address => Web3.VALID_ADDRESSES.includes(address),
    };
  }
}
