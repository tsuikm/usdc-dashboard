import { API_BASE_URL } from '@/utils/constants';

export default class AlgorandFetchFactory {

  /**
   * @param {Object<key: String, value: Account>}
   * @typedef {Account}: {
   *    amount: {Number},
   *    manager: Boolean,
   *    freeze: Boolean,
   *    reserve: Boolean,
   *    clawback: Boolean,
   *    creator: Boolean,
   * }
   */
  static MOCK_ACCOUNTS = {};

  /**
   * @public {Transaction[]}
   * @typedef {Transaction}: {
   *    id: {String},
   *    sender: {String},
   *    'asset-transfer-transaction': {
   *      amount: {Number},
   *      receiver: {String}
   *    },
   *    'confirmed-round': Number
   * }
   */
  static MOCK_TRANSACTIONS = []

  // @public {Number}
  static DECIMALS = 6;
  static TOTAL_SUPPLY;
  static CURRENT_ROUND;

  /**
   * Global fetch function.
   * @public
   *
   * @param {String} url
   */
  static async fetch(url) {
    const query = new URLSearchParams(url.replace(`${API_BASE_URL}/api/algorand`, ''));

    return {
      json: () => {
        if (query.get('request') === 'assets') return AlgorandFetchFactory._findAssets(query);
        if (query.get('request') === 'transactions') return AlgorandFetchFactory._findTransactions(query);
        if (query.get('request') === 'accounts') return AlgorandFetchFactory._findAccounts(query);
        if (query.get('request') === 'account') return AlgorandFetchFactory._findAccountByAddress(query.get('param'));
        if (query.get('request') === 'supply') return AlgorandFetchFactory._findSupply(query);
      },
    };
  }

  /*----------------------------------------------------------------------------*
   * Private methods
   *----------------------------------------------------------------------------*/

  /**
   * Finds the account address that matches the predicate when the account object is passed in.
   * @private
   *
   * @param {function(account: Account):boolean} predicate.
   * @return {String} - the account address.
   */
  static _findAccount(predicate) {
    return Object.keys(AlgorandFetchFactory.MOCK_ACCOUNTS)
      .find(address => predicate(AlgorandFetchFactory.MOCK_ACCOUNTS[address]));
  }

  static _findAssets() {
    return {
      asset: {
        params: {
          creator: AlgorandFetchFactory._findAccount(account => account.creator),
          freeze: AlgorandFetchFactory._findAccount(account => account.freeze),
          reserve: AlgorandFetchFactory._findAccount(account => account.reserve),
          clawback: AlgorandFetchFactory._findAccount(account => account.clawback),
          manager: AlgorandFetchFactory._findAccount(account => account.manager),
          decimals: AlgorandFetchFactory.DECIMALS,
          total: AlgorandFetchFactory.TOTAL_SUPPLY,
        },
      },
    };
  }

  static _findTransactions(query) {
    return {
      //fix for specific txn detail page fetch
      transactions: AlgorandFetchFactory.MOCK_TRANSACTIONS.filter(transaction => {
        const round = transaction['confirmed-round'];
        const minRound = query.get('min-round') || 0;
        const maxRound = query.get('max-round') || AlgorandFetchFactory.CURRENT_ROUND;

        if (query.get('txid')) {
          return transaction.id == query.get('txid');
        }
        if (query.get('address')) {
          return transaction.sender === query.get('address') ||
                 transaction['asset-transfer-transaction'].receiver === query.get('address');
        }

        return round >= minRound && round <= maxRound;
      }).sort((a, b) => b['confirmed-round'] - a['confirmed-round'])
        .reverse()
        .slice(0, query.get('limit') || AlgorandFetchFactory.MOCK_TRANSACTIONS.length),
    };
  }

  static _findAccounts(query) {
    const addresses = [...Object.keys(AlgorandFetchFactory.MOCK_ACCOUNTS)].slice(0, query.get('limit'));
    const accounts = [];

    for (let address of addresses) {
      accounts.push(AlgorandFetchFactory.MOCK_ACCOUNTS[address]);
      AlgorandFetchFactory.MOCK_ACCOUNTS[address].address = address;
    }

    return { accounts };
  }

  static _findAccountByAddress(address) {
    return {
      account: AlgorandFetchFactory.MOCK_ACCOUNTS[address],
    };
  }

  static _findSupply(query) {
    return {
      current_round: AlgorandFetchFactory.CURRENT_ROUND,
    };
  }
}
