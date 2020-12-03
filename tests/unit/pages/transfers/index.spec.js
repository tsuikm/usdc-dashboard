import { render, fireEvent } from '@testing-library/vue';
import transfers from '@/pages/transfers/index';
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE } from '@/utils/constants';
import { toHex, finishPromises } from '@/utils/utils';

const MOCK_WALLET_ADDRESS = '0xdC1e071D120FD40fB1173BCcc86c74F47645F4E0';

global.ethereum = {
  request: jest.fn(async () => [MOCK_WALLET_ADDRESS]),
};

describe('Transfers page', () => {
  test('Transfers card renders', async () => {
    const { getByPlaceholderText, queryByText } = render(transfers);
    expect(queryByText('Transfer USDC')).not.toBeNull();
    expect(getByPlaceholderText('Enter Wallet Address Here')).not.toBeNull();
    expect(getByPlaceholderText('Amount: i.e. 0')).not.toBeNull();
    expect(queryByText('SUBMIT')).not.toBeNull();
  });

  test('Submit button works', async () => {
    const TO_WALLET_ADDRESS = '0x12345';
    const AMOUNT_TEXT = '100';
    const { getByPlaceholderText, queryByText } = render(transfers);

    const connectMetaMaskButton = queryByText('Connect to MetaMask');
    await fireEvent.click(connectMetaMaskButton);

    const submitButton = queryByText('SUBMIT');
    const amountInput = getByPlaceholderText('Amount: i.e. 0');
    const toInput = getByPlaceholderText('Enter Wallet Address Here');

    await fireEvent.update(toInput, TO_WALLET_ADDRESS);
    await fireEvent.update(amountInput, AMOUNT_TEXT);
    await fireEvent.click(submitButton);
    await finishPromises();

    // eslint-disable-next-line
    expect(ethereum.request.mock.calls[1]).toEqual([{
      method: 'eth_sendTransaction',
      params: [
        {
          from: MOCK_WALLET_ADDRESS,
          to: USDC_CONTRACT_ADDRESS,
          data: TO_WALLET_ADDRESS + ', ' + toHex(Number(AMOUNT_TEXT) * 1000000),
          gasPrice: DEFAULT_GAS_PRICE,
        },
      ],
    }]);
  });
});
