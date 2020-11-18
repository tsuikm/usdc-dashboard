import { fireEvent, render } from '@testing-library/vue';
import NavBar from '@/components/NavBar.vue';
import { padHex } from '@/utils/utils';
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';

const finishPromises = async () => new Promise(resolve => setTimeout(resolve, 0));

const SAMPLE_ADDRESS = padHex('0x36f80a0bde5020ab0880ab54', WEB3_BALANCEOF_ADDRESS_LENGTH);

describe('NavBar', () => {
  it('Search Bar Displayed Correctly', () => {
    const { getByPlaceholderText } = render(NavBar);

    expect(getByPlaceholderText('Wallet Address or Txn Hash')).not.toBeNull();
  });

  it('Search Bar Valid Address Functionality Ethereum', async () => {
    const router = [];
    const { getByPlaceholderText } = render(NavBar, {
      mocks: {
        $router: router,
        $route: {
          path: '',
        },
      },
    });
    const input = getByPlaceholderText('Wallet Address or Txn Hash');
    await fireEvent.update(input,  SAMPLE_ADDRESS);
    await finishPromises();
    await fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    await finishPromises();

    const url = '/address/' + SAMPLE_ADDRESS;
    expect(router.length).toBe(1);
    expect(router[0].path).toEqual(url);
  });

  it('Search Bar Valid Address Functionality Solana', async () => {
    const router = [];
    const { getByPlaceholderText } = render(NavBar, {
      mocks: {
        $router: router,
        $route: {
          path: '/solana',
        },
      },
    });
    const input = getByPlaceholderText('Wallet Address or Txn Hash');
    await fireEvent.update(input,  SAMPLE_ADDRESS);
    await finishPromises();
    await fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    await finishPromises();

    const url = '/solana/address/' + SAMPLE_ADDRESS;
    expect(router.length).toBe(1);
    expect(router[0].path).toEqual(url);
  });

  it('Search Bar Valid Address Functionality Algorand', async () => {
    const router = [];
    const { getByPlaceholderText } = render(NavBar, {
      mocks: {
        $router: router,
        $route: {
          path: '/algorand',
        },
      },
    });
    const input = getByPlaceholderText('Wallet Address or Txn Hash');
    await fireEvent.update(input,  SAMPLE_ADDRESS);
    await finishPromises();
    await fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    await finishPromises();

    const url = '/algorand/address/' + SAMPLE_ADDRESS;
    expect(router.length).toBe(1);
    expect(router[0].path).toEqual(url);
  });

  it('Displays page links correctly Ethereum', async () => {
    const router = [];
    const { getByText } = render(NavBar, {
      mocks: {
        $router: router,
        $route: {
          path: '',
        },
      },
    });
    expect(getByText('Accounts')).not.toBeNull();
    expect(getByText('Transfer')).not.toBeNull();

    await fireEvent.click(getByText('Accounts'));

    expect(router.length).toBe(1);
    expect(router[0].path).toEqual('/accounts');

    await fireEvent.click(getByText('Transfer'));

    expect(router.length).toBe(2);
    expect(router[1].path).toEqual('/transfers');
  });

  it('Displays page links correctly Solana', async () => {
    const router = [];
    const { getByText } = render(NavBar, {
      mocks: {
        $router: router,
        $route: {
          path: '/solana',
        },
      },
    });
    expect(getByText('Accounts')).not.toBeNull();
    expect(getByText('Transfer')).not.toBeNull();

    await fireEvent.click(getByText('Accounts'));

    expect(router.length).toBe(1);
    expect(router[0].path).toEqual('/solana/accounts');

    await fireEvent.click(getByText('Transfer'));

    expect(router.length).toBe(2);
    expect(router[1].path).toEqual('/solana/transfers');
  });

  it('Displays page links correctly Algorand', async () => {
    const router = [];
    const { getByText } = render(NavBar, {
      mocks: {
        $router: router,
        $route: {
          path: '/algorand',
        },
      },
    });
    expect(getByText('Accounts')).not.toBeNull();
    expect(getByText('Transfer')).not.toBeNull();

    await fireEvent.click(getByText('Accounts'));

    expect(router.length).toBe(1);
    expect(router[0].path).toEqual('/algorand/accounts');

    await fireEvent.click(getByText('Transfer'));

    expect(router.length).toBe(2);
    expect(router[1].path).toEqual('/algorand/transfers');
  });
});
