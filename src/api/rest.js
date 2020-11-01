const bodyParser = require('body-parser');
const app = require('express')();
const { BigQuery } = require('@google-cloud/bigquery');

const bigqueryClient = new BigQuery();

app.use(bodyParser.json());

app.get('/minters', async (req, res) => {
  const sqlQuery = 'SELECT minter FROM `blockchain-etl.ethereum_usdc.FiatTokenV1_event_MinterConfigured` LIMIT 1000';
  const options = {
    query: sqlQuery,
    location: 'US',
  };

  try {
    const [rows] = await bigqueryClient.query(options);
    const minters = new Set();
    for (const { minter } of rows) {
      minters.add(minter);
    }

    res.json(Array.from(minters));
  } catch (e) {
    res.status(500).end();
  }
});

module.exports = app;
