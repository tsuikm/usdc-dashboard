import { fireEvent, render } from '@testing-library/vue';
import NavBar from '@/components/NavBar.vue';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { padHex } from '@/utils/utils';
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import NuxtLink from '@/utils/nuxt-link-stub';
import Web3 from 'web3';

Vue.use(VueMaterial);

Web3.VALID_ADDRESSES = [
  '0x36f80a0bde5020ab0880ab54',
  '0xfa2ec023f531cf6fa04c3536',
  '0x0bd4dcdf07629fee5d4363c7',
  '0xe7e31d0ef8c598b13e0992e2',
].map(address => padHex(address, WEB3_BALANCEOF_ADDRESS_LENGTH));

const finishPromises = async () => new Promise(resolve => setTimeout(resolve, 0));

describe('NavBar', () => {
  it('Search Bar Displayed Correctly', () => {
    const { getByPlaceholderText } = render(NavBar, {
      stubs: {
        NuxtLink: true,
      },
    });

    expect(getByPlaceholderText('Wallet Address or Txn Hash')).not.toBeNull();
  });

  it('Search Bar Valid Address Functionality', async () => {
    const router = [];
    const { getByPlaceholderText } = render(NavBar, {
      stubs: {
        NuxtLink: true,
      },
      mocks: {
        $router: router,
      },
    });
    const input = getByPlaceholderText('Wallet Address or Txn Hash');
    await fireEvent.update(input,  Web3.VALID_ADDRESSES[0]);
    await finishPromises();
    await fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    await finishPromises();

    const url = '/address/' + Web3.VALID_ADDRESSES[0];
    expect(router.length).toBe(1);
    expect(router[0].path).toEqual(url);
  });

  it('Search Bar Invalid Address Functionality', async () => {
    const router = [];
    const { getByPlaceholderText } = render(NavBar, {
      stubs: {
        NuxtLink: true,
      },
      mocks: {
        $router: router,
      },
    });

    const input = getByPlaceholderText('Wallet Address or Txn Hash');
    await fireEvent.update(input, 'invalid-address');
    await finishPromises();
    await fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    await finishPromises();

    const url = '/404';
    expect(router.length).toBe(1);
    expect(router[0].path).toEqual(url);
  });

  describe('Other links', () => {
    it('Displays other links correctly', async () => {
      const router = [];
      const { getByText } = render(NavBar, {
        stubs: {
          'nuxt-link': NuxtLink,
        },
        mocks: {
          $router: router,
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
  });
});
