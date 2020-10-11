import { render } from '@testing-library/vue';
import Overview from '../../src/components/Overview.vue';
import Vue from 'vue'
import VueMaterial from 'vue-material'
import Web3MockBuilder from '@/utils/test'

Vue.use(VueMaterial);

const MOCK_ACCOUNTS = {
  '0x0000000000000000000000000000000011111111': {
    balance: 1000,
    blacklisted: true
  },
  '0x0000000000000000000000000000000000000000': {
    balance: 2000,
    blacklisted: false
  }
}

jest.doMock('web3', () => Web3MockBuilder(MOCK_ACCOUNTS))

describe('Overview', () => {
  it('Correctly displays blacklisted label', () => {
    const { queryByText } = render(Overview, { props: { walletAddress: '0x11111111' } });

    expect(queryByText('block')).not.toBeNull();
  });

  it('Correctly hides blacklisted label', () => {
    const { queryByText } = render(Overview, { props: { walletAddress: '0x00000000' } });

    expect(queryByText('block')).toBeNull();
  });
});
