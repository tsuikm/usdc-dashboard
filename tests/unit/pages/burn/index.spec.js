import { render, fireEvent } from '@testing-library/vue';
import burn from '@/pages/burn/index';
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE } from '@/utils/constants';
import { toHex, finishPromises } from '@/utils/utils';
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
Web3.MOCK_WALLET_ADDRESS = MOCK_WALLET_ADDRESS;

global.ethereum = {
  request: jest.fn(async () => [MOCK_WALLET_ADDRESS]),
};

describe('Burn page', () => {
  afterEach(() => {
    // eslint-disable-next-line
    ethereum.request.mockClear();
  });

  test('Burn card renders', async () => {
    const { getByPlaceholderText, queryByText } = render(burn);
    expect(queryByText('Burn USDC')).not.toBeNull();
    expect(getByPlaceholderText('Amount: i.e. 0')).not.toBeNull();
    expect(queryByText('SUBMIT')).not.toBeNull();
  });

  test('Burn button works', async () => {
    global.ethereum = {
      request: jest.fn(async () => [MOCK_WALLET_ADDRESS]),
      selectedAddress: MOCK_WALLET_ADDRESS,
    };

    const { getByPlaceholderText, queryByText, getByText } = render(burn);

    const metamaskButton = getByText('Connect to MetaMask');
    await fireEvent.click(metamaskButton);

    expect(ethereum.request.mock.calls[0]).toEqual([{ method: 'eth_requestAccounts' }]);
    expect(ethereum.request.mock.calls).toHaveLength(1);
    const AMOUNT_TEXT = 100;
    const submitButton = queryByText('SUBMIT');
    const amountInput = getByPlaceholderText('Amount: i.e. 0');

    await fireEvent.update(amountInput, AMOUNT_TEXT);
    await fireEvent.click(submitButton);

    // eslint-disable-next-line
    expect(ethereum.request.mock.calls[1]).toEqual([{
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

  describe('Errors', () => {
    test('Not connected to Metamask error renders', async () => {
      Web3.MOCK_ACCOUNTS = MOCK_ACCOUNTS;
      Web3.MOCK_WALLET_ADDRESS = MOCK_WALLET_ADDRESS;
      global.ethereum = {
        request: jest.fn(async () => [MOCK_WALLET_ADDRESS]),
      };
  
      const { getByPlaceholderText, queryByText, getByText } = render(burn);
      const AMOUNT_TEXT = 100;
      const submitButton = queryByText('SUBMIT');
      const amountInput = getByPlaceholderText('Amount: i.e. 0');
  
      const NOT_CONNECTED_TO_METAMASK_ERROR_MESSAGE = 'Please connect your account to Metamask before proceeding.';
  
      await fireEvent.update(amountInput, AMOUNT_TEXT);
      await fireEvent.click(submitButton);
  
      await finishPromises();
  
      expect(getByText(NOT_CONNECTED_TO_METAMASK_ERROR_MESSAGE)).not.toBeNull();
  
    });

    test('Not minter error renders', async () => {
      const MOCK_WALLET_ADDRESS_ERROR = '0x1';
      Web3.MOCK_ACCOUNTS = MOCK_ACCOUNTS;
      Web3.MOCK_WALLET_ADDRESS = MOCK_WALLET_ADDRESS_ERROR;
      global.ethereum = {
        request: jest.fn(async () => [MOCK_WALLET_ADDRESS_ERROR]),
        selectedAddress: MOCK_WALLET_ADDRESS_ERROR,
      };
  
      const { getByPlaceholderText, queryByText, getByText } = render(burn);
  
      const metamaskButton = getByText('Connect to MetaMask');
      await fireEvent.click(metamaskButton);
  
      expect(ethereum.request.mock.calls[0]).toEqual([{ method: 'eth_requestAccounts' }]);
      expect(ethereum.request.mock.calls).toHaveLength(1);
      const AMOUNT_TEXT = 100;
      const submitButton = queryByText('SUBMIT');
      const amountInput = getByPlaceholderText('Amount: i.e. 0');
  
      await fireEvent.update(amountInput, AMOUNT_TEXT);
      await fireEvent.click(submitButton);
  
      const MINTER_ERROR_MESSAGE = 'Error: You are not signed in as a minter of this contract and cannot burn USDC.';
  
      await fireEvent.update(amountInput, AMOUNT_TEXT);
      await fireEvent.click(submitButton);
  
      await finishPromises();
  
      expect(getByText(MINTER_ERROR_MESSAGE)).not.toBeNull();
  
    });
  })


  test('ConnectToMetamask component renders', async () => {
    const { findByText } = render(burn);
    expect(findByText('Connect to MetaMask')).not.toBeNull();
  });
});
