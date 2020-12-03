import { render } from '@testing-library/vue';
import AddressDetails from '@/components/AddressDetails';

const MOCK_WALLET_ADDRESS = '0x12345';
const MOCK_PROPS = {
  roles: [{
    name: 'Pauser',
    color: '#1AA3FF',
  }],
  isBlacklisted: true,
  balance: 50000,
};

describe('Address page', () => {

  it('Renders labels correctly', () => {
    const { getByText } = render(AddressDetails, {
      props: MOCK_PROPS,
      mocks: {
        $route: {
          path: `/address/${MOCK_WALLET_ADDRESS}`,
          params: {
            address: MOCK_WALLET_ADDRESS,
          },
        },
      },
    });
    expect(getByText('Address Details')).not.toBeNull();
    expect(getByText('Wallet Address')).not.toBeNull();
    expect(getByText('Balance')).not.toBeNull();
    expect(getByText('Blacklisted?')).not.toBeNull();
  });

  it('Renders Roles correctly', () => {
    const { getByText } = render(AddressDetails, {
      props: MOCK_PROPS,
      mocks: {
        $route: {
          path: `/address/${MOCK_WALLET_ADDRESS}`,
          params: {
            address: MOCK_WALLET_ADDRESS,
          },
        },
      },
    });
    expect(getByText('Pauser')).not.toBeNull();
  });

  it('Displays the balance correctly', () => {
    const { getByText } = render(AddressDetails, {
      props: MOCK_PROPS,
      mocks: {
        $route: {
          path: `/address/${MOCK_WALLET_ADDRESS}`,
          params: {
            address: MOCK_WALLET_ADDRESS,
          },
        },
      },
    });
    expect(getByText('$50000')).not.toBeNull();
  });

  it('Displays whether the address is blacklisted correctly', () => {
    const { getByText } = render(AddressDetails, {
      props: MOCK_PROPS,
      mocks: {
        $route: {
          path: `/address/${MOCK_WALLET_ADDRESS}`,
          params: {
            address: MOCK_WALLET_ADDRESS,
          },
        },
      },
    });
    expect(getByText('Yes')).not.toBeNull();
  });
});
