export const WEB3_GET_LOGS_ADDRESS_LENGTH = 64;
export const WEB3_TXN_HASH_LENGTH = 64;
export const WEB3_BALANCEOF_ADDRESS_LENGTH = 40;
export const WEB3_RESULT_TOO_LARGE_ERROR_CODE = -32005;
export const WEB3_MAX_TRANSACTIONS = 10000;
export const OPTIMAL_PROMISE_ALL_SIZE = 500;

// export const USDC_CONTRACT_ADDRESS = '0xFb2654b8543092a28ef2C1BE7b80B06866a25b07';
export const USDC_CONTRACT_ADDRESS = process.env.USDC_CONTRACT_ADDRESS || '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

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
