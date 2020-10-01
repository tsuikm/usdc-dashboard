import { mount } from "@vue/test-utils";
import Dashboard from "../../src/components/Dashboard.vue";
import BalanceCard from "../../src/components/BalanceCard.vue";
import Vue from "vue";
import VueMaterial from "vue-material";

Vue.use(VueMaterial);

describe("BalanceCard", () => {
  it("ValueDisplay renders onto BalanceCard", () => {
    const wrapper = mount(BalanceCard);
    const valueDisplay = wrapper.findComponent({ name: "ValueDisplay" });
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
