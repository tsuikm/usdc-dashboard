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
  static fetch(url) {
    const query = new URLSearchParams(url.replace('/algorand', ''));

    return {
      json: async () => {
        if (query.request === 'assets') return AlgorandFetchFactory._findAssets(query);
        if (query.request === 'transactions') return AlgorandFetchFactory._findTransactions(query);
        if (query.request === 'accounts') return AlgorandFetchFactory._findAccounts(query);
        if (query.request === 'supply') return AlgorandFetchFactory._findSupply(query);
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
   * @param {function(account: Object):boolean} predicate.
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
          creator: AlgorandFetchFactory._findAccount(account => account.creator),
          decimals: AlgorandFetchFactory.DECIMALS,
          total: AlgorandFetchFactory.TOTAL_SUPPLY,
        }
      }
    }
  }

  static _findTransactions(query) {
    return {
      transactions: AlgorandFetchFactory.MOCK_TRANSACTIONS.filter(transaction => {
        const round = transaction['confirmed-round'];
        const minRound = query.get('min-round') || 0;
        const maxRound = query.get('max-round') || AlgorandFetchFactory.CURRENT_ROUND;

        return round >= minRound && round <= maxRound
      }).slice(0, query.get('limit'))
    }
  }

  static _findAccounts(query) {
    return {
      accounts: AlgorandFetchFactory.MOCK_ACCOUNTS.slice(0, query.get('limit'))
    }
  }

  static _findSupply(query) {
    return {
      ['current-round']: AlgorandFetchFactory.CURRENT_ROUND
    }
  }
}
