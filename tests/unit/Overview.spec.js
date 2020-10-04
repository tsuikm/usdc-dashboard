import { render } from '@testing-library/vue';
import Overview from '../../src/components/Overview.vue';
import Vue from 'vue'
import VueMaterial from 'vue-material'

Vue.use(VueMaterial);

const MOCK_ACCOUNTS = {
  '0x0000000000000000000000000000000011111111': {
    balance: 1000,
    isBlacklisted: true
  },
  '0x0000000000000000000000000000000000000000': {
    balance: 2000,
    isBlacklisted: false
  }
}

jest.mock('web3', () => class Web3 {
  get eth() {
    return {
      Contract: class {
        constructor() {
          this.methods = {
            balanceOf(address) {
              return {
                call(cb) {
                  cb(null, MOCK_ACCOUNTS[address].balance)
                }
              }
            },
            isBlacklisted(address) {
              return {
                call(cb) {
                  cb(null, MOCK_ACCOUNTS[address].isBlacklisted)
                }
              }
            },
            decimals() {
              return {
                call(cb) {
                  cb(null, 6)
                }
              }
            }
          }
        }
      }
    }
  }
});

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
