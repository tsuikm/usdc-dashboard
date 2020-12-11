export const WEB3_GET_LOGS_ADDRESS_LENGTH = 64;
export const WEB3_TXN_HASH_LENGTH = 64;
export const WEB3_BALANCEOF_ADDRESS_LENGTH = 40;
export const WEB3_RESULT_TOO_LARGE_ERROR_CODE = -32005;
export const WEB3_MAX_TRANSACTIONS = 10000;
export const OPTIMAL_PROMISE_ALL_SIZE = 500;
export const ALGORAND_USDC_ASSET_ID = 31566704;
export const RECENT_COUNT = 20;
export const ALGORAND_TXNS_LOOKBACK = 10000;
export const PERCENTAGE_DECIMAL_PLACES = 8;
export const ALGORAND_ACCOUNTS_QUERY_LIMIT = 10000;
export const ALGORAND_TXNS_QUERY_LIMIT = 100000000;
export const DECIMALS = 6;

export const USDC_CONTRACT_ADDRESS = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550';
//process.env.USDC_CONTRACT_ADDRESS || '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

// Test token Contract Address
export const TEST_TOKEN_CONTRACT_ADDRESS = '0xfc7e3a2554e2d4b23e41c81b14065ee31009cc31';

export const TRANSACTION_TOPIC =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

export const DEFAULT_GAS_PRICE = '0x09184e72a00'; // Decimal value is 625,000,000,000

export const BLACKLISTER_ADDRESS =
  '0x5db0115f3b72d19cea34dd697cf412ff86dc7e1b';

export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export const WEB3_PROVIDER = process.env.WEB3_PROVIDER;

export const BLOCKCHAIN_PATHS = ['', '/solana', '/algorand'];

export const TRANSACTION_SCHEMA = [
  {
    name: 'Transaction Hash',
    getter: t => t.transactionHash,
    link: t => `/transaction/${t.transactionHash}`,
  },
  {
    name: 'Quantity',
    getter: t => t.data,
  },
  {
    name: 'Sender',
    getter: t => t.from,
    link: t => `/address/${t.from}`,
  },
  {
    name: 'Receiver',
    getter: t => t.to,
    link: t => `/address/${t.to}`,
  },
  {
    name: 'Age',
    getter: t => t.age,
  },
  {
    name: 'Block Number',
    getter: t => t.blockNumber,
  },
];

export const ACCOUNTS_SCHEMA = [
  {
    name: 'Address',
    getter: account => account.address,
    link: account => `/address/${account.address}`,
  },
  {
    name: 'Balance',
    getter: account => account.balance,
  },
  {
    name: 'Percentage',
    getter: account => account.percentage,
  },
];

export const ALGORAND_TRANSACTION_SCHEMA = [
  {
    name: 'Transaction ID',
    getter: t => t.id,
    link: t => `/transaction/${t.id}`,
  },
  {
    name: 'Amount',
    getter: t => t['asset-transfer-transaction'] ? t['asset-transfer-transaction'].amount / (10 ** DECIMALS) : '',
  },
  {
    name: 'Sender',
    getter: t => t.sender,
    link: t => `/address/${t.sender}`,
  },
  {
    name: 'Receiver',
    getter: t => t['asset-transfer-transaction'] ? t['asset-transfer-transaction'].receiver : '',
    link: t => t['asset-transfer-transaction'] ? `/address/${t['asset-transfer-transaction'].receiver}` : '',
  },
  {
    name: 'Block Number',
    getter: t => t['confirmed-round'],
  },
];
