import PauserControl from '@/pages/roles/pauser/index';
import { render, fireEvent } from '@testing-library/vue';
import { finishPromises } from '@/utils/utils';
import Web3 from 'web3';

const contract = new (new Web3()).eth.Contract();

async function ethereumFactory(isConnectedToMetamask) {
  return {
    request: jest.fn(async config => {
      if (config.method === 'eth_sendTransaction') {
        await config.params[0].data();
      }

      // Simulates connecting to metamask as the pauser.
      if (config.method === 'eth_requestAccounts') {
        return isConnectedToMetamask ? [await contract.methods.pauser().call()] : [];
      }
    }),
  };
}

Web3.MOCK_ACCOUNTS = {
  '0x0000000a': { pauser: true },
};


describe('PauserControl', () => {

  it('Text components render properly', async () => {
    global.ethereum = await ethereumFactory(true);

    const { getByText } = render(PauserControl);
    const header = 'Pause and Unpause Contract';
    expect(getByText(header)).not.toBeNull();
    expect(getByText('Pausing prevents transfers, minting, and burning.')).not.toBeNull();
  });

  it('Unpauses when pauser attempts to unpause', async () => {
    global.ethereum = await ethereumFactory(true);

    const { getByText, getByTestId } = render(PauserControl, {
      data: function() {
        return {
          contractPaused: true,
        };
      },
    });
    const saveButton = getByText('SAVE');

    await fireEvent.click(getByTestId('toggle'));
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(getByText('Pausing prevents transfers, minting, and burning.')).not.toBeNull();
  });

  it('Pauses when pauser attempts to pause', async () => {
    global.ethereum = await ethereumFactory(true);

    const { getByText, getByTestId } = render(PauserControl, {
      data: function() {
        return {
          contractPaused: false,
        };
      },
    });
    const saveButton = getByText('SAVE');

    await fireEvent.click(getByTestId('toggle'));
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(getByText('Pausing prevents transfers, minting, and burning.')).not.toBeNull();
  });

  it('Not connected to Metamask error renders', async () => {
    global.ethereum = await ethereumFactory(false);

    const { getByText, getByTestId } = render(PauserControl, {
      data: function() {
        return {
          contractPaused: false,
        };
      },
    });

    const saveButton = getByText('SAVE');

    await fireEvent.click(getByTestId('toggle'));
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(getByText('Pausing prevents transfers, minting, and burning.')).not.toBeNull();
    expect(getByText('Please connect your account to Metamask before proceeding.')).not.toBeNull();
  });

  test('ConnectToMetamask component renders', async () => {
    const { findByText } = render(PauserControl);
    expect(findByText('Connect to MetaMask')).not.toBeNull();
  });
});
