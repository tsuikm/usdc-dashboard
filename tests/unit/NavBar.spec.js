import { fireEvent, render } from '@testing-library/vue';
import NavBar from '@/components/NavBar.vue';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import Web3 from 'web3';

Vue.use(VueMaterial);

Web3.VALID_ADDRESSES = [
  '0x36f80a0bde5020ab0880ab54',
  '0xfa2ec023f531cf6fa04c3536',
  '0x0bd4dcdf07629fee5d4363c7',
  '0xe7e31d0ef8c598b13e0992e2',
];

function setWindowUrl(url) {
  Object.defineProperty(window, 'location', {
    value: {
      href: url,
    },
  });
}

describe('NavBar', () => {
  it('Search Bar Displayed Correctly', () => {
    const { getByText, getByLabelText } = render(NavBar);

    expect(getByLabelText('Wallet Address')).not.toBeNull();
    expect(getByText('search')).not.toBeNull();
  });

  it('Search Bar Valid Address Functionality', async () => {
    const { getByLabelText } = render(NavBar);
    global.window = Object.create(window);

    const input = getByLabelText('Wallet Address');
    await fireEvent.input(input, '0x36f80a0bde5020ab0880ab54');

    const url = '/address/0x36f80a0bde5020ab0880ab54';
    setWindowUrl(url);
    expect(window.location.href).toEqual(url);

  });

  it('Search Bar Invalid Address Functionality', async () => {
    const { getByLabelText } = render(NavBar);

    delete global.window.location;
    global.window = Object.create(window);

    const input = getByLabelText('Wallet Address');
    await fireEvent.input(input, 'invalid-address');

    const url = '/404';
    setWindowUrl(url);
    expect(window.location.href).toEqual(url);
  });
});
