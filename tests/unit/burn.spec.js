import { render, fireEvent } from '@testing-library/vue';
import burn from '@/pages/burn/index';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE } from '@/utils/constants';
import { toHex } from '@/utils/utils';
Vue.use(VueMaterial);

const MOCK_WALLET_ADDRESS = '0xdC1e071D120FD40fB1173BCcc86c74F47645F4E0';

global.ethereum = {
  request: jest.fn(async () => [MOCK_WALLET_ADDRESS]),
};

describe('Burn page', () => {
  test('Burn card renders', async () => {
    const { queryByTestId, queryByText } = render(burn);
    expect(queryByText('Burn USDC')).not.toBeNull();
    expect(queryByTestId('Amount')).not.toBeNull();
    expect(queryByText('Send')).not.toBeNull();
  });

  test('Burn button works', async () => {
    const { queryByTestId, queryByText } = render(burn);

    // eslint-disable-next-line
    expect(ethereum.request.mock.calls[0]).toEqual([{ method: 'eth_requestAccounts' }]);
    // eslint-disable-next-line
    expect(ethereum.request.mock.calls).toHaveLength(2);
    const AMOUNT_TEXT = '100';
    const sendButton = queryByText('Send');
    const amountInput = queryByTestId('Amount');

    await fireEvent.update(amountInput, AMOUNT_TEXT);
    await fireEvent.click(sendButton);

    // eslint-disable-next-line
    expect(ethereum.request.mock.calls[2]).toEqual([{
      method: 'eth_sendTransaction',
      params: [
        {
          from: MOCK_WALLET_ADDRESS,
          to: USDC_CONTRACT_ADDRESS,
          data: toHex(Number(AMOUNT_TEXT) * 1000000),
          gasPrice: DEFAULT_GAS_PRICE,
        },
      ],
    }]);
  });
}); 
