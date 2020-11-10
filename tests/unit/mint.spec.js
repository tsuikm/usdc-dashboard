import { render, fireEvent } from '@testing-library/vue';
import mint from '@/pages/mint/index';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { USDC_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE } from '@/utils/constants';
import { toHex } from '@/utils/utils';
import Web3 from 'web3';
Vue.use(VueMaterial);

const MOCK_ACCOUNTS = {
  '0x12345': {
    balance: 10000,
    minter: true,
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

describe('Mint page', () => {
  test('Mint card renders', async () => {
    const { queryByTestId, queryByText } = render(mint);
    expect(queryByText('Mint USDC')).not.toBeNull();
    expect(queryByTestId('To Address')).not.toBeNull();
    expect(queryByTestId('Amount')).not.toBeNull();
    expect(queryByText('Send')).not.toBeNull();
  });

  test('Mint button works', async () => {
    const { queryByTestId, queryByText } = render(mint);

    // eslint-disable-next-line
    expect(ethereum.request.mock.calls[0]).toEqual([{ method: 'eth_requestAccounts' }]);
    // eslint-disable-next-line
    expect(ethereum.request.mock.calls[1]).toEqual([{ method: 'eth_requestAccounts' }]);
    // eslint-disable-next-line
    expect(ethereum.request.mock.calls).toHaveLength(2);

    const TO_WALLET_ADDRESS = '0x12345';
    const AMOUNT_TEXT = '100';

    const sendButton = queryByText('Send');
    const amountInput = queryByTestId('Amount');
    const toInput = queryByTestId('To Address');

    await fireEvent.update(toInput, TO_WALLET_ADDRESS);
    await fireEvent.update(amountInput, AMOUNT_TEXT);
    await fireEvent.click(sendButton);

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

