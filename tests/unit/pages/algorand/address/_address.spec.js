import AlgoAddressDetailsPage from '@/pages/algorand/_address';
import { render } from '@testing-library/vue';
import { finishPromises } from '@/utils/utils';
import Web3 from 'web3';

const MOCK_ACCOUNTS = {
  '0xf7c343FBc40F6B34DaA8bC2a97607BA4cEDF98c3': {
    amount: 10000,
    minter: true,
    pauser: false,
    owner: false,
    blacklisted: false,
  },
};
const MOCK_WALLET_ADDRESS = '0xf7c343FBc40F6B34DaA8bC2a97607BA4cEDF98c3';

Web3.MOCK_ACCOUNTS = MOCK_ACCOUNTS;
Web3.MOCK_WALLET_ADDRESS = MOCK_WALLET_ADDRESS;

describe('Algorand Address Details Page', () => {
  it('Renders AlgoAddressDetails component', async () => {
    const { getByText } = render(AlgoAddressDetailsPage, {
      mocks: {
        $route: {
          path: `/address/${MOCK_WALLET_ADDRESS}`,
          params: {
            address: MOCK_WALLET_ADDRESS,
          },
          query: {
            page: 1, // Load with ?page=1
          },
        },
        $router: {
          replace: () => {},
        },
        $refs: {
          table: {
            pageLength: 1,
          },
        },
      },
    });

    expect(getByText('Address Details')).not.toBeNull();
    expect(getByText('Wallet Address')).not.toBeNull();
    expect(getByText('Balance')).not.toBeNull();
    expect(getByText('Blacklisted?')).not.toBeNull();

    await finishPromises();
  });

  it('Renders AlgoAddressDetails component and address transaction table', async () => {
    const { getByText } = render(AlgoAddressDetailsPage, {
      mocks: {
        $route: {
          path: `/address/${MOCK_WALLET_ADDRESS}`,
          params: {
            address: MOCK_WALLET_ADDRESS,
          },
          query: {
            page: 1, // Load with ?page=1
          },
        },
        $router: {
          replace: () => {},
        },
        $refs: {
          table: {
            pageLength: 1,
          },
        },
      },
    });

    expect(getByText('Address Transactions')).not.toBeNull();
    expect(getByText('Transaction Hash')).not.toBeNull();
    expect(getByText('Quantity')).not.toBeNull();
    expect(getByText('Sender')).not.toBeNull();
    expect(getByText('Receiver')).not.toBeNull();
    expect(getByText('Age')).not.toBeNull();
    expect(getByText('Block Number')).not.toBeNull();

    await finishPromises();
  });

  it('Redirects to /404 on invalid address', async () => {
    const routeReplace = jest.fn();
    render(AlgoAddressDetailsPage, {
      mocks: {
        $route: {
          path: '/address/asjkndgkljasbndklganjkdklasjndgklasjng',
          params: {
            address: 'asjkndgkljasbndklganjkdklasjndgklasjng',
          },
          query: {
            page: 1, // Load with ?page=1
          },
        },
        $router: {
          replace: routeReplace,
        },
        $refs: {
          table: {
            pageLength: 1,
          },
        },
      },
    });

    
    expect(routeReplace.mock.calls).toHaveLength(1);
    expect(routeReplace.mock.calls[0][0]).toBe('/404');
  });
});
