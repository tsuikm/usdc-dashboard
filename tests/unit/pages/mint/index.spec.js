import { render, fireEvent } from '@testing-library/vue';
import mint from '@/pages/mint/index';
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE, WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import { toHex, finishPromises, padHex } from '@/utils/utils';
import Web3 from 'web3';

const MOCK_ACCOUNTS = {
  '0x12345': {
    balance: 10000,
    minter: true,
    pauser: false,
    owner: false,
    blacklisted: false,
  },
  '0x1': {
    balance: 10000,
    minter: false,
    pauser: false,
    owner: false,
    blacklisted: false,
  },
};
const MOCK_WALLET_ADDRESS = '0x12345';

Web3.MOCK_ACCOUNTS = MOCK_ACCOUNTS;
Web3.VALID_ADDRESSES = [...Object.keys(MOCK_ACCOUNTS)].map(address => padHex(address.trim(), WEB3_BALANCEOF_ADDRESS_LENGTH));
Web3.MOCK_WALLET_ADDRESS = MOCK_WALLET_ADDRESS;

for (let address in Object.keys(MOCK_ACCOUNTS)) {
  Web3.VALID_ADDRESSES.push(padHex(address.trim(), WEB3_BALANCEOF_ADDRESS_LENGTH));
}

global.ethereum = {
  request: jest.fn(async () => [MOCK_WALLET_ADDRESS]),
};

describe('Mint page', () => {
  afterEach(() => {
    ethereum.request.mockClear();
  });

  test('Mint card renders', async () => {
    const { getByPlaceholderText, queryByText } = render(mint);
    expect(queryByText('Mint USDC')).not.toBeNull();
    expect(getByPlaceholderText('Enter Wallet Address Here')).not.toBeNull();
    expect(getByPlaceholderText('Amount: i.e. 0')).not.toBeNull();
    expect(queryByText('SUBMIT')).not.toBeNull();
  });

  test('Mint button works', async () => {
    global.ethereum = {
      request: jest.fn(async () => [MOCK_WALLET_ADDRESS]),
    };

    const { getByPlaceholderText, queryByText, getByText } = render(mint);

    const metamaskButton = getByText('Connect to MetaMask');
    await fireEvent.click(metamaskButton);

    expect(ethereum.request.mock.calls[0]).toEqual([{ method: 'eth_requestAccounts' }]);
    expect(ethereum.request.mock.calls).toHaveLength(1);

    const TO_WALLET_ADDRESS = '0x12345';
    const AMOUNT_TEXT = 100;

    const submitButton = queryByText('SUBMIT');
    const amountInput = getByPlaceholderText('Amount: i.e. 0');
    const toInput = getByPlaceholderText('Enter Wallet Address Here');

    await fireEvent.update(toInput, TO_WALLET_ADDRESS);
    await finishPromises();
    await fireEvent.update(amountInput, AMOUNT_TEXT);
    await finishPromises();
    await fireEvent.click(submitButton);
    await finishPromises();

    expect(ethereum.request.mock.calls[1]).toEqual([{
      method: 'eth_sendTransaction',
      params: [
        {
          from: MOCK_WALLET_ADDRESS,
          to: USDC_CONTRACT_ADDRESS,
          data: padHex(TO_WALLET_ADDRESS.trim(), WEB3_BALANCEOF_ADDRESS_LENGTH) + ', ' + toHex(AMOUNT_TEXT * 1000000),
          gasPrice: DEFAULT_GAS_PRICE,
        },
      ],
    }]);
  });

  test('Error renders', async () => {
    const MOCK_WALLET_ADDRESS_ERROR = '0x1';
    Web3.MOCK_ACCOUNTS = MOCK_ACCOUNTS;
    Web3.MOCK_WALLET_ADDRESS = MOCK_WALLET_ADDRESS_ERROR;
    global.ethereum = {
      request: jest.fn(async () => [MOCK_WALLET_ADDRESS_ERROR]),
    };

    const { getByPlaceholderText, queryByText, getByText } = render(mint);
    const metamaskButton = getByText('Connect to MetaMask');
    const TO_WALLET_ADDRESS = '0x12345';
    const AMOUNT_TEXT = 200;
    const submitButton = queryByText('SUBMIT');
    const amountInput = getByPlaceholderText('Amount: i.e. 0');
    const toInput = getByPlaceholderText('Enter Wallet Address Here');

    const MINTER_ERROR_MESSAGE = 'Error: You are not signed in as a minter of this contract and cannot mint tokens.';

    await fireEvent.click(metamaskButton);

    await fireEvent.update(toInput, TO_WALLET_ADDRESS);
    await fireEvent.update(amountInput, AMOUNT_TEXT);
    await fireEvent.click(submitButton);

    await finishPromises();

    expect(getByText(MINTER_ERROR_MESSAGE)).not.toBeNull();
  });

  test('ConnectToMetamask component renders', async () => {
    const { findByText } = render(mint);
    expect(findByText('Connect to MetaMask')).not.toBeNull();
  });
});

