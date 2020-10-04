import { render, fireEvent } from "@testing-library/vue";
import accounts from "@/pages/accounts";
import Vue from "vue";
import VueMaterial from "vue-material";
import { fromHex, toHex, padHex, removeLeadingZeros } from "@/utils/utils";

Vue.use(VueMaterial);

const MOCK_TRANSACTIONS = [];
for(let i = 0; i < 101; i++) {
  const randomQuantity = Math.random() * 109502;
  MOCK_TRANSACTIONS.push({
    data: toHex(randomQuantity),
    topics: [ null, padHex(toHex(i), 20), null ]
  });
}

const MOCK_ACCOUNTS = new Map();
for (let transaction of MOCK_TRANSACTIONS) {
  let address = transaction.topics[1]
  if (!MOCK_ACCOUNTS.has(address)) {
    MOCK_ACCOUNTS.set(address, transaction.data)
  }
  else {
    MOCK_ACCOUNTS.set(address, MOCK_ACCOUNTS.get(address) + transaction.data)
  }    
}

jest.doMock('web3', () => class Web3 {
  get eth() {
    return {
      Contract: class Contract {
        constructor() {
          this.methods = {
            balanceOf: address => {
              return {
                call: () => new Promise((res) => {
                  return res(MOCK_ACCOUNTS.get(address));
                })
              };
            },
            decimals: () => {
              return {
                call: () => new Promise((res) => res(0))
              }
            }
          };
        }
      },
      getBlockNumber: async () => 800000,
      getPastLogs: async (options) => {
        const from = fromHex(options.fromBlock);
        const to = fromHex(options.toBlock);
        const length = MOCK_TRANSACTIONS.length;
        return MOCK_TRANSACTIONS.slice(Math.max(length -(from - to), 0), length);
      },
    }
  }
} );
  

describe("accounts", () => {
  it("accounts displays a table titled Accounts with columns for Address, Balance and Percentage", () => {
    const { getByText } = render(accounts);
    expect(getByText('Accounts')).not.toBeNull();
    expect(getByText('Address')).not.toBeNull();
    expect(getByText('Balance')).not.toBeNull();
    expect(getByText('Percentage')).not.toBeNull();
  });

  it("orders accounts by balance", async () => {
    const { findByText, getByText } = render(accounts);

    let addresses = [...MOCK_ACCOUNTS.entries()].sort((a, b) => b[1] - a[1]);

    // top 25 accounts by balance
    for (let i = 0; i < 25; i++) {
      expect(findByText(removeLeadingZeros(addresses[i][0]))).not.toBeNull();
      expect(findByText(addresses[i][1])).not.toBeNull();
    }
    
    // go to page 2
    await fireEvent.click(getByText('navigate_next'));
    getByText('First');
    findByText('Page 2 of ' + Math.ceil(addresses.length/25));
    getByText('Last');

    // next top 25 accounts by balance
    for (let i = 25; i < 50; i++) {
      expect(findByText(removeLeadingZeros(addresses[i][0]))).not.toBeNull();
      expect(findByText(addresses[i][1])).not.toBeNull();
    }
  });
});
