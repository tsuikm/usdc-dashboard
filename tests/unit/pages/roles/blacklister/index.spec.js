import BlacklisterControl from '@/pages/roles/blacklister/index';
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import { render, fireEvent } from '@testing-library/vue';
import { padHex, finishPromises } from '@/utils/utils';
import Web3 from 'web3';

function ethereumFactory(isConnectedToMetamask) {
  return {
    request: jest.fn(async config => {
      if (config.method === 'eth_sendTransaction') {
        await config.params[0].data();
      }

      // Simulates connecting to metamask as the owner.
      if (config.method === 'eth_requestAccounts') {
        return isConnectedToMetamask ? [BLACKLISTER] : [];
      }
    }),
  };
}
const BLACKLISTER = padHex('0x00000001', WEB3_BALANCEOF_ADDRESS_LENGTH);
Web3.MOCK_ACCOUNTS = {
  [BLACKLISTER]: {},
  [padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH)]: {},
};
global.ethereum = ethereumFactory(true);

describe('BlacklisterControl', () => {
  it('Text components render properly', () => {
    const { findByText } = render(BlacklisterControl);
    const header = 'Check and Blacklist Addresses';
    expect(findByText(header)).not.toBeNull();
  });

  it('Correctly renders components when blacklisted address is entered', async () => {
    const { getByText } = render(BlacklisterControl, {
      data: function() {
        return {
          address: padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH),
          isBlacklisted: true,
          statusChecked: true,
          originalStatus: true,
        };
      },
    });
    expect(getByText('Address is currently blacklisted.')).not.toBeNull();
  });

  it('Correctly renders components when unblacklisted address is entered', async () => {
    const { getByText } = render(BlacklisterControl, {
      data: function() {
        return {
          address: padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH),
          isBlacklisted: false,
          statusChecked: true,
          originalStatus: false,
        };
      },
    });
    expect(getByText('Address is not currently blacklisted.')).not.toBeNull();
  });

  it('BLACKLISTs an unblacklisted address', async () => {
    const { getByText, getByTestId } = render(BlacklisterControl, {
      data: function() {
        return {
          address: padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH),
          isBlacklisted: false,
          statusChecked: true,
          originalStatus: true,
        };
      },
    });
    expect(getByText('Address is currently blacklisted.')).not.toBeNull();
    const saveButton = getByText('SAVE');

    await fireEvent.click(getByTestId('toggle'));
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(getByText('Address is currently blacklisted.')).not.toBeNull();
  });

  it('UNBLACKLISTs a blacklisted address', async () => {
    const { getByText, getByTestId } = render(BlacklisterControl, {
      data: function() {
        return {
          address: padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH),
          isBlacklisted: true,
          statusChecked: true,
          originalStatus: false,
        };
      },
    });
    expect(getByText('Address is not currently blacklisted.')).not.toBeNull();
    const saveButton = getByText('SAVE');

    await fireEvent.click(getByTestId('toggle'));
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(getByText('Address is not currently blacklisted.')).not.toBeNull();
  });

  test('ConnectToMetamask component renders', async () => {
    const { findByText } = render(BlacklisterControl);
    expect(findByText('Connect to MetaMask')).not.toBeNull();
  });
});
