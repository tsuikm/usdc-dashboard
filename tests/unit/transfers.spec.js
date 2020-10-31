import { render, fireEvent } from '@testing-library/vue';
import transfers from '@/pages/transfers/index';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { USDC_CONTRACT_ADDRESS } from '@/utils/constants';
import { toHex } from '@/utils/utils';
// import Web3 from '@/utils/web3mock';
Vue.use(VueMaterial);

const MOCK_WALLET_ADDRESS = '0xdC1e071D120FD40fB1173BCcc86c74F47645F4E0';
global.ethereum = {
  request: jest.fn(async () => [MOCK_WALLET_ADDRESS]),
};
// console.log(Web3);
// const contractClass = new Web3().eth.Contract;
// // console.log(contractClass);
// const contract = new contractClass();
// console.log(contract.methods);
describe('Transfers page', () => {
  test('Transfers card renders', async () => {
    const { queryByTestId } = render(transfers);
    expect(queryByTestId('transfers-card-test-id')).not.toBeNull();
    expect(queryByTestId('transfers-card-to-input')).not.toBeNull();
    expect(queryByTestId('transfers-card-from-input')).not.toBeNull();
    expect(queryByTestId('transfers-card-amount-input')).not.toBeNull();
    expect(queryByTestId('transfers-card-connect-button')).not.toBeNull();
    expect(queryByTestId('transfers-card-send-button')).not.toBeNull();
  });
  
  test('Connect Metamask button works', async () => {
    const { queryByTestId } = render(transfers);
    const button = queryByTestId('transfers-card-connect-button');
    await fireEvent.click(button);

    // eslint-disable-next-line
    expect(ethereum.request.mock.calls[0]).toEqual([{ method: 'eth_requestAccounts' }]);
    // eslint-disable-next-line
    expect(ethereum.request.mock.calls).toHaveLength(1);
  });

  test('Send USDC button works', async () => {
    const TO_WALLET_ADDRESS = '0x12345';
    const { queryByTestId } = render(transfers);
    const connectMetaMaskButton = queryByTestId('transfers-card-connect-button');
    await fireEvent.click(connectMetaMaskButton);
    const sendButton = queryByTestId('transfers-card-send-button');
    const amountInput = queryByTestId('transfers-card-amount-input');
    const toInput = queryByTestId('transfers-card-to-input');
    const fromInput = queryByTestId('transfers-card-from-input');
    await fireEvent.change(fromInput, {target: {value: MOCK_WALLET_ADDRESS}});
    await fireEvent.change(toInput, {target: {value: TO_WALLET_ADDRESS}});
    await fireEvent.change(amountInput, {target: {value: 100}});
    await fireEvent.click(sendButton);
    // eslint-disable-next-line
    expect(ethereum.request.mock.calls[1]).toEqual([{
      method: 'eth_sendTransaction',
      params: [
        {
          from: MOCK_WALLET_ADDRESS,
          to: USDC_CONTRACT_ADDRESS,
          data: MOCK_WALLET_ADDRESS + ', ' + toHex(Number(100) * 1000000),
          gasPrice: '0x09184e72a000',
        },
      ],
    }]);
  });
});
