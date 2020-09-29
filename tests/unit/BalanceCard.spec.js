import { mount } from "@vue/test-utils";
import Dashboard from "../../src/components/Dashboard.vue";
import BalanceCard from "../../src/components/BalanceCard.vue";
import Vue from "vue";
import VueMaterial from "vue-material";

Vue.use(VueMaterial);

describe("BalanceCard", () => {
  it("values display within balance card", async (done) => {
    const wrapper = mount(BalanceCard);
    const valueDisplay = wrapper.findComponent({ name: "ValueDisplay" });
    expect(valueDisplay.exists()).toBeTruthy();
    done();
  });

  it("balance card images properly display", async (done) => {
    const wrapper = mount(BalanceCard);
    const images = wrapper.find("img");
    expect(images.exists()).toBeTruthy();
    done();
  });

  it("fetches conversion rate from Coinbase API", async (done) => {
    const wrapper = mount(BalanceCard);
    const arrow = wrapper.find("img");
    expect(arrow.exists()).toBeTruthy();
    done();
  });
});

describe("Dashboard", () => {
  it("balance card displays on submit", async (done) => {
    const wrapper = mount(Dashboard);
    const addr = wrapper.find("input");
    const form = wrapper.find("form");
    await addr.setValue("0xc0539c310393165705265dc9865a0E495202771B");
    await form.trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    const balancecard = wrapper.findComponent({ name: "BalanceCard" });
    expect(balancecard.exists()).toBeTruthy();
    done();
  });
});

//   it("displays balance values on balance card", async (done) => {
//     const wrapper = mount(Dashboard);
//     const addr = wrapper.find("input");
//     const form = wrapper.find("form");
//     await addr.setValue("0xc0539c310393165705265dc9865a0E495202771B");
//     await form.trigger("submit.prevent");
//     await wrapper.vm.$nextTick();

//     const valuedisplay = wrapper.findComponent({ name: "ValueDisplay" });
//     expect(valuedisplay.exists()).toBeTruthy();
//     done();
//   });

//   //   it("displays wallet balance in usd", async done => {
//   //     const wrapper = mount(BalanceCard);
//   //     done();
//   //   });

//   //   it("fetches the conversion rate from Coinbase API", async done => {
//   //     const wrapper = mount(BalanceCard);
//   //     done();
//   //   });
