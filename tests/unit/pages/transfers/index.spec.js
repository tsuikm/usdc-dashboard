import { render, fireEvent } from '@testing-library/vue';
import transfers from '@/pages/transfers/index';
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE, WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import { toHex, padHex, finishPromises } from '@/utils/utils';
import Web3 from 'web3';

const MOCK_WALLET_ADDRESS = '0xdC1e071D120FD40fB1173BCcc86c74F47645F4E0';
Web3.VALID_ADDRESSES = [padHex(MOCK_WALLET_ADDRESS.trim(), WEB3_BALANCEOF_ADDRESS_LENGTH), padHex('0x12345'.trim(), WEB3_BALANCEOF_ADDRESS_LENGTH)];


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
    const AMOUNT_TEXT = 100;
    const { getByPlaceholderText, getByText } = render(transfers);

    const connectMetaMaskButton = getByText('Connect to MetaMask');
    await fireEvent.click(connectMetaMaskButton);

    const submitButton = getByText('SUBMIT');
    const amountInput = getByPlaceholderText('Amount: i.e. 0');
    const toInput = getByPlaceholderText('Enter Wallet Address Here');

    await fireEvent.update(toInput, TO_WALLET_ADDRESS);
    await fireEvent.update(amountInput, AMOUNT_TEXT);
    await fireEvent.click(submitButton);
    await finishPromises();

    expect(ethereum.request.mock.calls[1]).toEqual([{
      method: 'eth_sendTransaction',
      params: [
        {
          from: MOCK_WALLET_ADDRESS,
          to: USDC_CONTRACT_ADDRESS,
          data: padHex(TO_WALLET_ADDRESS.trim(), WEB3_BALANCEOF_ADDRESS_LENGTH)  + ', ' + toHex(Number(AMOUNT_TEXT) * 1000000),
          gasPrice: DEFAULT_GAS_PRICE,
        },
      ],
    }]);
  });

  test('Not connected to Metamask error renders', async () => {
    global.ethereum = {
      request: jest.fn(async () => []),
    };

    const TO_WALLET_ADDRESS = '0x12345';
    const AMOUNT_TEXT = 100;
    const { getByPlaceholderText, getByText } = render(transfers);

    const connectMetaMaskButton = getByText('Connect to MetaMask');
    await fireEvent.click(connectMetaMaskButton);

    const submitButton = getByText('SUBMIT');
    const amountInput = getByPlaceholderText('Amount: i.e. 0');
    const toInput = getByPlaceholderText('Enter Wallet Address Here');

    await fireEvent.update(toInput, TO_WALLET_ADDRESS);
    await fireEvent.update(amountInput, AMOUNT_TEXT);
    await fireEvent.click(submitButton);
    await finishPromises();

    expect(getByText('Please connect your account to Metamask before proceeding.')).not.toBeNull();

  });
});
