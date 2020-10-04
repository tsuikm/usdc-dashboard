import { render, fireEvent } from "@testing-library/vue";
import accounts from "@/pages/accounts";
import Vue from "vue";
import VueMaterial from "vue-material";
import { fromHex, toHex, padHex } from "@/utils/utils";

Vue.use(VueMaterial);

const MOCK_TRANSACTIONS = [];
for(let i = 0; i < 101; i++) {
  const randomQuantity = Math.random() * 109502;
  MOCK_TRANSACTIONS.push({
    data: toHex(randomQuantity),
    topics: [ null, padHex(toHex(i), 20), null ]
  });
}

jest.mock('web3', () => class Web3 {
  get eth() {
    return {
      Contract: class Contract {
        constructor() {
          this.methods = {
            balanceOf: address => {
              return {
                call: () => new Promise((res) => {
                  let totalBalance = 0;
                  for (let transaction of MOCK_TRANSACTIONS) {
                    if (transaction.topics[1] == address) {
                      totalBalance += transaction.data
                    }
                  }
                  return res(totalBalance)
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
        const length = transactions.length;
        return transactions.slice(Math.max(length -(from - to), 0), length);
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
    const { findByText } = render(accounts);

    
  });

  // it("ConversionDisplay renders onto BalanceCard", () => {
  //   const wrapper = mount(BalanceCard);
  //   const conversionDisplay = wrapper.findComponent({
  //     name: "ConversionDisplay",
  //   });
  //   expect(conversionDisplay.exists()).toBeTruthy();
  //   expect(conversionDisplay.text()).toContain("CONVERSION RATE:");
  //   expect(conversionDisplay.text()).toContain("1 USD//Coin to");
  //   expect(conversionDisplay.text()).toContain("US Dollar");
  // });
});
