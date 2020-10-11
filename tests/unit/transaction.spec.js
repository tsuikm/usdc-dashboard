import { render } from "@testing-library/vue";
import _transaction from "@/pages/transaction/_transaction";
import Vue from "vue";
import VueMaterial from "vue-material";

Vue.use(VueMaterial);

jest.mock('web3', () => class Web3 {
  get eth() {
    return {
    }
  }
} );


describe("transaction", () => {
  it("", () => {
    const { getByText } = render(_transaction);

  });


});
