import address from '@/pages/address/_address';
import { USDC_CONTRACT_ADDRESS } from '@/utils/constants';
import { render } from '@testing-library/vue';
import { mount } from '@vue/test-utils';

// const $route = {
//   params: {
//     address: '/0xc0539c310393165705265dc9865a0E495202771', // Normal Wallet Address
//   },
// };

const MOCK_WALLET_ADDRESS = '/0xc0539c310393165705265dc9865a0E495202771';

describe('address page', () => {
  it('Wallet address displays correctly', () => {
    const testAddress = '0xc0539c310393165705265dc9865a0E495202771B';
    console.log('mount');   
    const wrapper = mount(address, {
      mocks: {
        $route: {
          path: '/address/' + MOCK_WALLET_ADDRESS,
          params: {
            address: MOCK_WALLET_ADDRESS,
          },
        },
      },
    });
    console.log(wrapper);
    const { getByText } = render(address);
    
    expect(getByText(testAddress)).not.toBeNull();
  });

  it('Contract address displays correctly', () => {
    const { getByText } = render(address, {
      propsData: {
        walletAddress: USDC_CONTRACT_ADDRESS,
      },
    });

    expect(getByText(USDC_CONTRACT_ADDRESS)).not.toBeNull();
  });

  it('Displays whether the wallet address is a contract or a regular address', () => {
    const { getByText } = render(address);
    expect(getByText('ADDRESS')).not.toBeNull();
  });
});


// const $route = {
//   path: '/some/path',
// };

// const wrapper = shallowMount(Component, {
//   mocks: {
//     $route,
//   },
// });

// wrapper.vm.$route.path; // /some/path
