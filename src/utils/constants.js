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
export const TEST_TOKEN_CONTRACT_ADDRESS = '0xfc7e3a2554e2d4b23e41c81b14065ee31009cc31';

export const DEFAULT_GAS_PRICE = '0x09184e72a000';

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
