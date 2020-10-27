import { render, fireEvent } from '@testing-library/vue';
import transfers from '@/pages/transfers/index';
import Vue from 'vue';
import VueMaterial from 'vue-material';

Vue.use(VueMaterial);

global.ethereum = {
  request: jest.fn(),
};

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
});
