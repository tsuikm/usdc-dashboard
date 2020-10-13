import { render } from "@testing-library/vue";
import TransactionDetails from "@/components/TransactionDetails";
import Vue from "vue";
import VueMaterial from "vue-material";

Vue.use(VueMaterial);

const MOCK_TRANSACTION = {
  transactionHash: '0x123456',
  from: '0xaaaaa',
  to: '0xbbbbb',
  blockNumber: 0,
  gas: 10
}

jest.mock('web3', () => class Web3 {
  get eth() {
    return {

      async getTransaction(hash) {
        if (hash === MOCK_TRANSACTION.transactionHash) {
          return MOCK_TRANSACTION;
        }
        throw new Error();
      }
    }
  }
} );


describe("Transaction Details", () => {
  it("Renders transaction details correctly for correct hash", () => {
    const { getByText, findByText } = render(TransactionDetails, {
      props: {
        hash: MOCK_TRANSACTION.transactionHash
      }
    });

    expect(getByText('Hash:')).not.toBeNull();
    expect(getByText('Sender:')).not.toBeNull();
    expect(getByText('Receiver:')).not.toBeNull();
    expect(getByText('Block:')).not.toBeNull();
    expect(getByText('Gas:')).not.toBeNull();

    expect(findByText('0x123456')).not.toBeNull();
    expect(findByText('0xaaaaa')).not.toBeNull();
    expect(findByText('0xbbbbb')).not.toBeNull();
    expect(findByText('0')).not.toBeNull();
    expect(findByText('1')).not.toBeNull();
  });

  it("Redirects to 404 with incorrect hash", async () => {
    delete global.window.location;
    global.window = Object.create(window);
    window.location = {}

    const { updateProps } = render(TransactionDetails, {
      props: {
        hash: MOCK_TRANSACTION.transactionHash
      }
    });

    await updateProps({ hash: 'invalid' });

    expect(window.location.href).toEqual('/404');
  });
});
