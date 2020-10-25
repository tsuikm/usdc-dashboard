import BlacklisterControl from '@/components/BlacklisterControl.vue';
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { render } from '@testing-library/vue';
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


  it ('Displays UNBLACKLIST when blacklisted address is looked up', async () => {
    const { getByTestId } = render(BlacklisterControl, { 
      props: {
        address: padHex('0x11111111', WEB3_BALANCEOF_ADDRESS_LENGTH),
        isBlacklisted: true, 
      },
    });
    await Vue.nextTick();
    expect(getByTestId('check-unblacklisted')).not.toBeNull();
  });


  it ('Displays BLACKLIST when unblacklisted address is looked up', async () => {
    const { getByTestId } = render(BlacklisterControl, { 
      props: {
        address: padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH),
        isBlacklisted: false, 
      }, 
    });
    await Vue.nextTick();
    expect(getByTestId('check-blacklisted')).not.toBeNull();
  });
 

});
