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

        const result = [];
        for (let i = 0; i < (from - to) / 1000 * 50; i++) {
          result.push({
            data: '0x0',
            transactionHash: `0x000${i}`,
            blockNumber: `0x000${i}0000`,
            topics: [ '0x0', `0x00${i}00`, `0x${i}000`]
          });
        }
        return result;
      };
    }
  }
} );
  

describe("accounts renders ", () => {
  it("ValueDisplay renders onto BalanceCard", () => {
    
    expect(valueDisplay.exists()).toBeTruthy();
    expect(valueDisplay.text()).toContain("BALANCE (USDC)");
    expect(valueDisplay.text()).toContain("BALANCE (USD $)");
  });

  it("Images display on BalanceCard", () => {
    const wrapper = mount(BalanceCard);
    const images = wrapper.find("img");
    expect(images.exists()).toBeTruthy();
  });

  it("ConversionDisplay renders onto BalanceCard", () => {
    const wrapper = mount(BalanceCard);
    const conversionDisplay = wrapper.findComponent({
      name: "ConversionDisplay",
    });
    expect(conversionDisplay.exists()).toBeTruthy();
    expect(conversionDisplay.text()).toContain("CONVERSION RATE:");
    expect(conversionDisplay.text()).toContain("1 USD//Coin to");
    expect(conversionDisplay.text()).toContain("US Dollar");
  });
});

describe("Dashboard", () => {
  it("BalanceCard displays on Dashboard input's submit", async () => {
    const wrapper = mount(Dashboard);
    const addr = wrapper.find("input");
    const form = wrapper.find("form");
    
    await addr.setValue("0xc0539c310393165705265dc9865a0E495202771B");
    await form.trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    const balancecard = wrapper.findComponent({ name: "BalanceCard" });
    expect(balancecard.exists()).toBeTruthy();
  });
});
