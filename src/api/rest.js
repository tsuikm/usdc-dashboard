const bodyParser = require('body-parser');
const app = require('express')();
const { BigQuery } = require('@google-cloud/bigquery');

const bigqueryClient = new BigQuery();

app.use(bodyParser.json());

app.get('/minters', async (req, res) => {
  if (req.query.contract !== '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48') {
    return res.json([]);
  }

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

app.get('/algorand', require('./algorand-rest').get);

module.exports = app;
