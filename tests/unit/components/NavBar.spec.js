import { fireEvent, render } from '@testing-library/vue';
import NavBar from '@/components/NavBar.vue';
import { padHex, finishPromises } from '@/utils/utils';
import { WEB3_BALANCEOF_ADDRESS_LENGTH, BLOCKCHAIN_PATHS } from '@/utils/constants';

const SAMPLE_ADDRESS = padHex('0x36f80a0bde5020ab0880ab54', WEB3_BALANCEOF_ADDRESS_LENGTH);

describe('NavBar', () => {
  it('Search Bar Displayed Correctly', () => {
    const { getByPlaceholderText } = render(NavBar);

    expect(getByPlaceholderText('Search Address...')).not.toBeNull();
  });

  it('Search Bar Valid Address Functionality', async () => {
    const router = [];
    const route = { path: '' };
    const { getByPlaceholderText } = render(NavBar, {
      mocks: {
        $router: router,
        $route: route,
      },
    });

    const input = getByPlaceholderText('Search Address...');

    for (const path of BLOCKCHAIN_PATHS) {
      route.path = path;
      await fireEvent.update(input,  SAMPLE_ADDRESS);
      await fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      await finishPromises();

      expect(router[router.length - 1].path).toEqual(`${path}/address/${SAMPLE_ADDRESS}`);
    }

    expect(router.length).toBe(3);
  });

  it('Displays page links correctly', async () => {
    const router = [];
    const route = { path: '' };
    const { getByText } = render(NavBar, {
      mocks: {
        $router: router,
        $route: route,
      },
    });

    expect(getByText('Accounts')).not.toBeNull();
    expect(getByText('Transfer')).not.toBeNull();

    for (const path of BLOCKCHAIN_PATHS) {
      route.path = path;
      await finishPromises();

      await fireEvent.click(getByText('Accounts'));
      expect(router[router.length - 1].path).toEqual(`${path}/accounts`);
    }
    
    await fireEvent.click(getByText('Transfer'));
    expect(router[router.length - 1].path).toEqual('/transfers');

    expect(getByText('Ethereum')).not.toBeNull();
    expect(getByText('Algorand')).not.toBeNull();
    expect(getByText('Solana')).not.toBeNull();

    await fireEvent.click(getByText('Ethereum'));
    expect(router[router.length - 1].path).toEqual('/');

    await fireEvent.click(getByText('Algorand'));
    expect(router[router.length - 1].path).toEqual('/algorand');

    await fireEvent.click(getByText('Solana'));
    expect(router[router.length - 1].path).toEqual('/solana');

    await fireEvent.click(getByText('Mint'));
    expect(router[router.length - 1].path).toEqual('/mint');

    await fireEvent.click(getByText('Burn'));
    expect(router[router.length - 1].path).toEqual('/burn');

    await fireEvent.click(getByText('Owner Controls'));
    expect(router[router.length - 1].path).toEqual('/roles/owner');

    await fireEvent.click(getByText('Blacklist & Unblacklist'));
    expect(router[router.length - 1].path).toEqual('/roles/blacklister');

    await fireEvent.click(getByText('Pause & Unpause'));
    expect(router[router.length - 1].path).toEqual('/roles/pauser');
  });
});
