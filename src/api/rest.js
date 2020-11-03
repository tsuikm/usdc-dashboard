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

app.get('/blacklister', async (req, res) => {
  const sqlQuery = 'SELECT block_number, newBlacklister FROM `blockchain-etl.ethereum_usdc.FiatTokenV1_event_BlacklisterChanged` ORDER BY block_number DESC LIMIT 1';
  const options = {
    query: sqlQuery,
    location: 'US',
  };

  try {
    const [rows] = await bigqueryClient.query(options);
    res.json(rows[0].newBlacklister);
  } catch (e) {
    res.status(500).end();
  }
});

module.exports = app;
