const bodyParser = require('body-parser');
const app = require('express')();
const { BigQuery } = require('@google-cloud/bigquery');

const bigqueryClient = new BigQuery();

app.use(bodyParser.json());

app.get('/minters', async (req, res) => {
  const sqlQuery = 'SELECT minter FROM `blockchain-etl.ethereum_usdc.FiatTokenV1_event_MinterConfigured` GROUP BY minter';
  const options = {
    query: sqlQuery,
    location: 'US',
  };

  try {
    const [rows] = await bigqueryClient.query(options);
    res.json(rows.map(m => m.minter));
  } catch (e) {
    res.status(500).end();
  }
});


// TODO: initial approach was to create our own API endpoints. We tentatively bailed on this approach
//       to directly use purestake's rest endpoints. We will investigate if this resolves issue where part
//       of the response string is cut off, resulting in a JSON parsing error.
//
const algosdk = require('algosdk');
const baseServer = 'https://mainnet-algorand.api.purestake.io';
const port = '';
const token = {
  'X-API-Key': process.env.PURESTAKE_API_KEY
};

const indexer = new algosdk.Indexer(token, `${baseServer}/idx2/`, port);
const algod = new algosdk.Algodv2(token, `${baseServer}/ps2/`, port);

app.get('/algorand', async (req, res) => {
  try {
    if (req.query.api === 'indexer') {
      if (req.query.request === 'transactions') {
        response = indexer.searchForTransactions(req.query.param);
      }
      if (req.query.request === 'blocks') {
        response = indexer.lookupBlock(req.query.param);
      }
      if (req.query.request === 'assets') {
        response = indexer.lookupAssetByID(req.query.param);
      }
      if (req.query.request === 'accounts') {
        response = indexer.searchAccounts(req.query.param);
      }
      response.query = req.query;
    }
    else {
      if (req.query.request === 'supply') {
        response = algod.supply(req.query.param);
      } 
    }

    res.json(await response.do());
  }
  catch {
    res.status(500).end();
  }
});

module.exports = app;
