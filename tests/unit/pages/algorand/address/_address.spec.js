import AddressDetailsPage from '@/pages/algorand/address/_address';
import { render } from '@testing-library/vue';
import { finishPromises } from '@/utils/utils';
import AlgorandFetchFactory from '@/../tests/algorand-fetch-mock';

const MOCK_WALLET_ADDRESS = '0x1';

AlgorandFetchFactory.MOCK_ACCOUNTS = {
  [MOCK_WALLET_ADDRESS]: {
    amount: 10000,
    creator: true,
    manager: true
  },
};
AlgorandFetchFactory.MOCK_TRANSACTIONS = [
  {
    id: '0x2',
    sender: MOCK_WALLET_ADDRESS,
    'asset-transfer-transaction': {
      amount: 1,
      receiver: '0x3',
    },
  },
  {
    id: '0x4',
    sender: '0x5',
    'asset-transfer-transaction': {
      amount: 1,
      receiver: MOCK_WALLET_ADDRESS,
    },
  },
];

global.fetch = AlgorandFetchFactory.fetch;

describe('Algorand Address Details Page', () => {
  it('Renders component correctly', async () => {
    const { getByText } = render(AddressDetailsPage, {
      mocks: {
        $route: {
          path: `/algorand/address/${MOCK_WALLET_ADDRESS}`,
          params: {
            address: MOCK_WALLET_ADDRESS,
          },
          query: {
            page: 1
          }
        },
      },
    });
    await finishPromises();

    expect(getByText('Address Details')).not.toBeNull();
    expect(getByText('Wallet Address')).not.toBeNull();
    expect(getByText('Balance')).not.toBeNull();
    expect(getByText('Transaction ID')).not.toBeNull();
    expect(getByText('Amount')).not.toBeNull();
    expect(getByText('Sender')).not.toBeNull();
    expect(getByText('Receiver')).not.toBeNull();
    expect(getByText('Block Number')).not.toBeNull();
  });

  it('Renders content correctly', async () => {
    const { getByText, getAllByText } = render(AddressDetailsPage, {
      mocks: {
        $route: {
          path: `/algorand/address/${MOCK_WALLET_ADDRESS}`,
          params: {
            address: MOCK_WALLET_ADDRESS,
          },
          query: {
            page: 1
          }
        },
      },
    });
    await finishPromises();

    expect(getAllByText(MOCK_WALLET_ADDRESS).length).toBeGreaterThanOrEqual(1);
    expect(getByText('$' + AlgorandFetchFactory.MOCK_ACCOUNTS[MOCK_WALLET_ADDRESS].amount / 10 ** AlgorandFetchFactory.DECIMALS)).not.toBeNull();
    expect(getByText('Creator')).not.toBeNull();
    expect(getByText('Manager')).not.toBeNull();
  });

  it('Redirects to /404 on invalid address', async () => {
    const router = [];
    render(AddressDetailsPage, {
      mocks: {
        $route: {
          path: '/address/not-valid',
          params: {
            address: 'not-valid',
          },
          query: {
            page: 1
          },
        },
        $router: router,
      },
    });
    await finishPromises();

    expect(router.length).toBe(1);
    expect(router[0].path).toBe('/404');
  });
});
