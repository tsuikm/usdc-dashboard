import { mount } from "@vue/test-utils";
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

  it("Displays privileged roles components", () => {
    const wrapper = mount(BalanceCard);
    const roleDisplay = wrapper.findComponent({ name: "RoleDisplay" });
    expect(roleDisplay.exists()).toBeTruthy();
  })
});
