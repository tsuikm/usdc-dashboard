import Address from '@/components/Address.vue';
import { USDC_CONTRACT_ADDRESS } from '@/utils/constants';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { render } from '@testing-library/vue';

Vue.use(VueMaterial);

describe('Address', () => {
  it('Wallet address displays correctly', () => {
    const testAddress = '0xc0539c310393165705265dc9865a0E495202771B'; // Normal Wallet Address
    const { queryByText } = render(Address, {
      propsData: {
        walletAddress: testAddress,
      },
    });
    
    expect(queryByText(testAddress)).not.toBeNull();
  });

  it('Contract address displays correctly', () => {
    const { queryByText } = render(Address, {
      propsData: {
        walletAddress: USDC_CONTRACT_ADDRESS,
      },
    });
    
    expect(queryByText(USDC_CONTRACT_ADDRESS)).not.toBeNull();
  });

  it('Displays whether the wallet address is a contract or a regular address', () => {
    const { getByText } = render(Address);
    expect(getByText('ADDRESS')).not.toBeNull();
  });
});
