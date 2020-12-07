import ConnectToMetamask from '@/components/ConnectToMetamask';
import { render, createEvent, fireEvent } from '@testing-library/vue';
import { padHex, finishPromises } from '@/utils/utils';
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import Web3 from 'web3';

global.ethereum = {
  request: jest.fn(async () => ['0x12345']),
};

describe('ConnectToMetamask', () => {
  it('Shows connected properly', () => {
    const { findByText } = render(ConnectToMetamask);
    expect(findByText('Connected to MetaMask')).not.toBeNull();
  });

  it('Fires event on click', () => {
    const { getByText } = render(ConnectToMetamask);
    expect(getByText('Not Connected to MetaMask')).not.toBeNull();
    const event = createEvent.click(getByText('Connect to MetaMask'));
    expect(fireEvent(getByText('Connect to MetaMask'), event)).not.toBeNull();
  });

  it('Hides button when user is connected', async () => {
    const { getByText, queryByText } = render(ConnectToMetamask);
    const connectButton = getByText('Connect to MetaMask');
    expect(connectButton).not.toBeNull();

    await fireEvent.click(connectButton);
    await finishPromises();

    const hiddenButton = queryByText('Connect to MetaMask');
    expect(hiddenButton).toBeNull();
    expect(getByText('Connected to MetaMask')).not.toBeNull();

  });

});
