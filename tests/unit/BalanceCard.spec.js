import { mount } from "@vue/test-utils";
import BalanceCard from "@/components/BalanceCard.vue";
import RoleDisplay from "@/components/RoleDisplay.vue";
import Vue from "vue";
import VueMaterial from "vue-material";

Vue.use(VueMaterial);

describe("BalanceCard", () => {
  it("ValueDisplay renders onto BalanceCard", () => {
    const wrapper = mount(BalanceCard);
    const valueDisplay = wrapper.findComponent({ name: "ValueDisplay" });
    expect(valueDisplay.exists()).toBeTruthy();
    expect(valueDisplay.text()).toContain("USDC BALANCE ($)");
  });

  it("Displays privileged roles components", () => {
    const wrapper = mount(BalanceCard);
    const roleDisplay = wrapper.findComponent({ name: "RoleDisplay" });
    expect(roleDisplay.exists()).toBeTruthy();
  });

  it("Diplays minter badge for minter", () => {
    const wrapper = mount(BalanceCard, {
      propsData: {
        usdcBalance: 1000,
        usdValue: 1000,
        conversionRate: '1.0',
        minter: true,
        pauser: false,
        owner: false
      }
    });

    const roleDisplay = wrapper.findComponent(RoleDisplay);
    expect(roleDisplay.exists()).toBeTruthy();
    expect(roleDisplay.props().minter).toBeTruthy();
    expect(roleDisplay.text()).toContain("MINTER");
  })

  it("Diplays pauser badge for pauser", () => {
    const wrapper = mount(BalanceCard, {
      propsData: {
        usdcBalance: 1000,
        usdValue: 1000,
        conversionRate: '1.0',
        minter: false,
        pauser: true,
        owner: false
      }
    });

    const roleDisplay = wrapper.findComponent(RoleDisplay);
    expect(roleDisplay.exists()).toBeTruthy();
    expect(roleDisplay.props().pauser).toBeTruthy();
    expect(roleDisplay.text()).toContain("PAUSER");
  })

  it("Diplays owner badge for owner", () => {
    const wrapper = mount(BalanceCard, {
      propsData: {
        usdcBalance: 1000,
        usdValue: 1000,
        conversionRate: '1.0',
        minter: false,
        pauser: false,
        owner: true
      }
    });

    const roleDisplay = wrapper.findComponent(RoleDisplay);
    expect(roleDisplay.exists()).toBeTruthy();
    expect(roleDisplay.props().owner).toBeTruthy();
    expect(roleDisplay.text()).toContain("OWNER");
  })
});
