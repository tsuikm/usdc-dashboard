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

});
