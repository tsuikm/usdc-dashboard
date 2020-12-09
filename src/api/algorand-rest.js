/**
 * Rest endpoints for all `/algorand/*` pages.
 *
 * Currently only supports read operations, although the infrastructure is in-place
 * for write operations.
 */

// modules
const algosdk = require('algosdk');

// constants
const PURESTAKE_BASE_SERVER = 'https://mainnet-algorand.api.purestake.io';
const RATE_LIMITING_MESSAGE = 'Too Many Requests';
const RATE_LIMITING_COOLDOWN = 1000;
const PURESTAKE_PORT = '';
const REQUEST_TO_INDEXER = {
  transactions: 'searchForTransactions',
  blocks: 'lookupBlock',
  assets: 'lookupAssetByID',
  accounts: 'searchAccounts',
  account: 'lookupAccountByID',
};

//----------------------------------------------------------------------------------------

const indexer = new algosdk.Indexer(
  {
    'X-API-Key': process.env.PURESTAKE_API_KEY,
  },
  PURESTAKE_BASE_SERVER + '/idx2/',
  PURESTAKE_PORT,
);

async function get(req, res) {
  try {
    const response = indexer[REQUEST_TO_INDEXER[req.query.request]](req.query.param);
    response.query = req.query;

    return res.json(await response.do());
  }
  catch (error) {

    // When Purestake rate-limits our calls, attempt to query again in RATE_LIMITING_COOLDOWN ms.
    if (error.message === RATE_LIMITING_MESSAGE) {
      await new Promise(r => setTimeout(r, RATE_LIMITING_COOLDOWN));
      return get(req, res);
    }

    return res.status(500).end();
  }
}

module.exports = { get };
