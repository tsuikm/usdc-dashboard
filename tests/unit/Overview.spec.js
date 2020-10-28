import Overview from '@/components/Overview.vue';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import Web3 from 'web3';
import { padHex } from '@/utils/utils';
import { render } from '@testing-library/vue';

Vue.use(VueMaterial);

const MOCK_ACCOUNTS = {
  [padHex('0x11111111', WEB3_BALANCEOF_ADDRESS_LENGTH)]: {
    balance: 1000,
    blacklisted: true,
  },
  [padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH)]: {
    balance: 2000,
    blacklisted: false,
  },
};

Web3.MOCK_ACCOUNTS = MOCK_ACCOUNTS;

describe('Overview', () => {
  it('Correctly displays blacklisted label', async () => {
    const { getByText } = render(Overview, { 
      props: { 
        walletAddress: padHex('0x11111111', WEB3_BALANCEOF_ADDRESS_LENGTH), 
      }, 
      stubs: {
        NuxtLink: true,
      },
    });

    await Vue.nextTick();
    expect(getByText('block')).not.toBeNull();
  });

  it('Correctly hides blacklisted label', () => {
    const { queryByText } = render(Overview, { 
      props: { 
        walletAddress: padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH), 
      },
      stubs: {
        NuxtLink: true,
      },
    });

    expect(queryByText('block')).toBeNull();
  });
});
