import { render, fireEvent } from '@testing-library/vue';
import transfers from '@/pages/transfers/index';
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE } from '@/utils/constants';
import { toHex } from '@/utils/utils';

const MOCK_WALLET_ADDRESS = '0xdC1e071D120FD40fB1173BCcc86c74F47645F4E0';

global.ethereum = {
  request: jest.fn(async () => [MOCK_WALLET_ADDRESS]),
};

describe('Transfers page', () => {
  test('Transfers card renders', async () => {
    const { queryByLabelText, queryByText } = render(transfers);
    expect(queryByLabelText('To Address')).not.toBeNull();
    expect(queryByLabelText('Amount')).not.toBeNull();
    expect(queryByText('Connect to Metamask')).not.toBeNull();
    expect(queryByText('Submit')).not.toBeNull();
  });

  test('Connect Metamask button works', async () => {
    const { queryByText } = render(transfers);
    const button = queryByText('Connect to Metamask');
    await fireEvent.click(button);

    // eslint-disable-next-line
    expect(ethereum.request.mock.calls[0]).toEqual([{ method: 'eth_requestAccounts' }]);
    // eslint-disable-next-line
    expect(ethereum.request.mock.calls).toHaveLength(1);
  });

  test('Submit button works', async () => {
    const TO_WALLET_ADDRESS = '0x12345';
    const AMOUNT_TEXT = '100';
    const { queryByLabelText, queryByText } = render(transfers);

    const connectMetaMaskButton = queryByText('Connect to Metamask');
    await fireEvent.click(connectMetaMaskButton);

    const sendButton = queryByText('Submit');
    const amountInput = queryByLabelText('Amount');
    const toInput = queryByLabelText('To Address');

    await fireEvent.update(toInput, TO_WALLET_ADDRESS);
    await fireEvent.update(amountInput, AMOUNT_TEXT);
    await fireEvent.click(sendButton);

    // eslint-disable-next-line
    expect(ethereum.request.mock.calls[2]).toEqual([{
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
