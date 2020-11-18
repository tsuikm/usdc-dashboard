import { fireEvent, render } from '@testing-library/vue';
import NavBar from '@/components/NavBar.vue';
import { padHex } from '@/utils/utils';
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';

const finishPromises = async () => new Promise(resolve => setTimeout(resolve, 0));

const SAMPLE_ADDRESS = padHex('0x36f80a0bde5020ab0880ab54', WEB3_BALANCEOF_ADDRESS_LENGTH);
const BLOCKCHAIN_PATHS = ['', '/solana', '/algorand'];

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
      await fireEvent.click(getByText('Transfer'));
      expect(router[router.length - 1].path).toEqual(`${path}/transfers`);
    }
    expect(router.length).toBe(6);
  });
});
