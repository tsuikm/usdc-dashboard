export const WEB3_GET_LOGS_ADDRESS_LENGTH = 64;
export const WEB3_BALANCEOF_ADDRESS_LENGTH = 40;
export const WEB3_RESULT_TOO_LARGE_ERROR_CODE = -32005;
export const WEB3_MAX_TRANSACTIONS = 10000;
export const OPTIMAL_PROMISE_ALL_SIZE = 500;

// Ropsten USDC Address
export const USDC_CONTRACT_ADDRESS = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F';

// Mainnet USDC Address
// export const USDC_CONTRACT_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

//Test token Contract Address
export const TEST_TOKEN_CONTRACT_ADDRESS = '0xe9404c75d0c2c6fc9fe5c07f36b5ae15547b546c';

//Test token Owner Address
export const TEST_TOKEN_OWNER_ADDRESS = '0xdc1e071d120fd40fb1173bccc86c74f47645f4e0';

//Test token Master Minter Address
export const TEST_TOKEN_MASTER_MINTER_ADDRESS = '0x5df6c542e318966CC5FB8862Faf25452574A6c5D';

//Test token Pauser Address
export const TEST_TOKEN_PAUSER_ADDRESS = '0xdC1e071D120FD40fB1173BCcc86c74F47645F4E0';

//Test token Blacklister Address
export const TEST_TOKEN_BLACKLISTER_ADDRESS = '0x5df6c542e318966CC5FB8862Faf25452574A6c5D';

export const TRANSACTION_TOPIC =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

export const BLACKLISTER_ADDRESS = 
  '0x5db0115f3b72d19cea34dd697cf412ff86dc7e1b';
export const NuxtLinkStub = {
  name: 'NuxtLinkStub',
  props: {
    to: {
      type: [String, Object],
      required: true,
    },
    tag: {
      type: String,
      default: 'a',
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: [String, Array],
      default: 'click',
    },
  },
  render: function render(h) {
    return h(this.tag, undefined, this.$slots.default);
  },
};
