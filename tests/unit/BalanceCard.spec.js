import { mount } from "@vue/test-utils";
import Dashboard from "../../src/components/Dashboard.vue";
import Overview from "../../src/components/Overview.vue";
// import BalanceCard from "../../src/components/BalanceCard.vue";
// import ValueDisplay from "../../src/components/ValueDisplay.vue";
import Vue from "vue";
import VueMaterial from "vue-material";

Vue.use(VueMaterial);

describe("Dashboard", () => {
  it("displays usdc wallet balance", async done => {
    const wrapper = mount(Dashboard);
    const addr = wrapper.find("input");
    const form = wrapper.find("form");
    await addr.setValue("0xf7c343FBc40F6B34DaA8bC2a97607BA4cEDF98c3");
    await form.trigger("submit.prevent");
    await wrapper.vm.$nextTick();
    const overview = wrapper.findComponent(Overview);
    expect(overview.find("balance")).toBe(50000);

    // expect(wrapper.props("usdcBalance")).toBe(50000);
    // const valueDisplay = wrapper.find("ValueDisplay");
    // const usdc = valueDisplay.find("usdcBalance");
    // expect(usdc.exists).toBeTruthy();
    done();
  });

  //   it("displays wallet balance in usd", async done => {
  //     const wrapper = mount(BalanceCard);
  //     done();
  //   });

  //   it("fetches the conversion rate from Coinbase API", async done => {
  //     const wrapper = mount(BalanceCard);
  //     done();
  //   });
});
