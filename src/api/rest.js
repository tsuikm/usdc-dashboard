const bodyParser = require('body-parser');
const app = require('express')();
const { BigQuery } = require('@google-cloud/bigquery');
const algosdk = require('algosdk');

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

const baseServer = 'https://mainnet-algorand.api.purestake.io/idx2/';
const port = '';
const token = {
  'X-API-Key': 'Yux8PVogsu1Z7tFByiIvh7npNLq9daJsp0pDmaj6',
};
const client = new algosdk.Indexer(token, baseServer, port);

app.get('/test', async (req, res) => {

  try {
    const txns = await client.searchForTransactions().do();
    res.json(txns);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});


module.exports = app;
