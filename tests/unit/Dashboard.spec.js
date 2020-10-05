import { render, fireEvent } from '@testing-library/vue';
import Dashboard from '../../src/components/Dashboard.vue';
import Vue from 'vue';
import VueMaterial from 'vue-material';

Vue.use(VueMaterial);

jest.mock('web3', () => class Web3 {
  get utils() {
    const VALID_ADDRESSES = [
      '0x36f80a0bde5020ab0880ab54',
      '0xfa2ec023f531cf6fa04c3536',
      '0x0bd4dcdf07629fee5d4363c7',
      '0xe7e31d0ef8c598b13e0992e2'
    ];

    return {
      isAddress: address => VALID_ADDRESSES.includes(address)
    };
  }
  get eth() {
    return {
      Contract: class Contract {},
      getBlockNumber: async () => 0,
      getBlock: async () => 0,
      getPastLogs: async () => []
    };
  }
} );


describe('Dashboard', () => {
  it('Search Bar Displayed Correctly', () => {
    const { getByText, getByLabelText } = render(Dashboard);

    expect(getByLabelText('Wallet Address')).not.toBeNull();
    expect(getByText('search')).not.toBeNull();
  });

  it('Search Bar Valid Address Functionality', async () => {
    const { getByLabelText } = render(Dashboard);
    global.window = Object.create(window);

    const input = getByLabelText('Wallet Address');
    await fireEvent.input(input, '0x36f80a0bde5020ab0880ab54');

    const url = '/address/0x36f80a0bde5020ab0880ab54';
    Object.defineProperty(window, 'location', {
      value: {
        href: url
      }
    });
    expect(window.location.href).toEqual(url);

  });

  it('Search Bar Invalid Address Functionality', async () => {
    const { getByLabelText } = render(Dashboard);

    delete global.window.location;
    global.window = Object.create(window);

    const input = getByLabelText('Wallet Address');
    await fireEvent.input(input, 'invalid-address');

    const url = '/404';
    Object.defineProperty(window, 'location', {
      value: {
        href: url
      }
    });
    expect(window.location.href).toEqual(url);
  });
});