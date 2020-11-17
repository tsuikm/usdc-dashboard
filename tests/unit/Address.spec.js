import Address from '@/components/Address.vue';
import { USDC_CONTRACT_ADDRESS } from '@/utils/constants';
import { render } from '@testing-library/vue';

describe('Address', () => {
  it('Wallet address displays correctly', () => {
    const testAddress = '0xc0539c310393165705265dc9865a0E495202771B'; // Normal Wallet Address
    const { getByText } = render(Address, {
      propsData: {
        walletAddress: testAddress,
      },
    });

    expect(getByText(testAddress)).not.toBeNull();
  });

  it('Contract address displays correctly', () => {
    const { getByText } = render(Address, {
      propsData: {
        walletAddress: USDC_CONTRACT_ADDRESS,
      },
    });

    expect(getByText(USDC_CONTRACT_ADDRESS)).not.toBeNull();
  });

  it('Displays whether the wallet address is a contract or a regular address', () => {
    const { getByText } = render(Address);
    expect(getByText('ADDRESS')).not.toBeNull();
  });
});
