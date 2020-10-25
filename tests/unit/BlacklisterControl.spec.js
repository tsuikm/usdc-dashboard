import BlacklisterControl from '@/components/BlacklisterControl.vue';
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { render, fireEvent } from '@testing-library/vue';
import { padHex } from '@/utils/utils';
import Web3 from 'web3';

Vue.use(VueMaterial);

const MOCK_ACCOUNTS = {
  [padHex('0x11111111', WEB3_BALANCEOF_ADDRESS_LENGTH)]: {
    isBlacklisted: true,
  },
  [padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH)]: {
    isBlacklisted: false,
  },
};

Web3.MOCK_ACCOUNTS = MOCK_ACCOUNTS;

describe('BlacklisterControl', () => {
  it('Text components render properly', () => {
    const { findByText } = render(BlacklisterControl);
    const header = 'Check and Blacklist Roles';
    expect(findByText(header)).not.toBeNull();
  });


  it('Displays UNBLACKLIST when blacklisted address is looked up', async () => {
    const { getByTestId, getByText } = render(BlacklisterControl, {
      propsData: {
        address: padHex('0x11111111', WEB3_BALANCEOF_ADDRESS_LENGTH),
        isBlacklisted: true,
      },
    });
    const button = getByText('CHECK STATUS');
    await fireEvent.click(button);
    await Vue.nextTick();
    expect(getByText('This address is currently blacklisted.')).not.toBeNull();
    // expect(getByTestId('check-blacklisted')).not.toBeNull();
  });


  it('Displays BLACKLIST when unblacklisted address is looked up', async () => {
    const { getByTestId, getByText } = render(BlacklisterControl, {
      propsData: {
        address: padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH),
        isBlacklisted: false,
      },
    });
    const button = getByText('CHECK STATUS');
    await fireEvent.click(button);
    await Vue.nextTick();
    expect(getByText('This address is not currently blacklisted.')).not.toBeNull();
    // expect(getByTestId('check-unblacklisted')).not.toBeNull();
  });

  it('Displays BLACKLIST when unblacklisted address is looked up', async () => {
    const { getByTestId } = render(BlacklisterControl);
    await Vue.nextTick();
    expect(getByTestId('header')).not.toBeNull();
  });


});
