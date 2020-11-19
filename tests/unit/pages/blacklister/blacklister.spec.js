import BlacklisterControl from '@/pages/roles/blacklister/index';
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import { render, fireEvent } from '@testing-library/vue';
import { padHex } from '@/utils/utils';
import Web3 from 'web3';

function ethereumFactory(isConnectedToMetamask) {
  return {
    request: async config => {
      if (config.method === 'eth_sendTransaction') {
        await config.params[0].data();
      }

      // Simulates connecting to metamask as the owner.
      if (config.method === 'eth_requestAccounts') {
        return isConnectedToMetamask ? [BLACKLISTER] : [];
      }
    },
  };
}
const BLACKLISTER = padHex('0x00000001', WEB3_BALANCEOF_ADDRESS_LENGTH);
Web3.MOCK_ACCOUNTS = {
  [BLACKLISTER]: {},
  [padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH)]: {},
};
global.ethereum = ethereumFactory(true);

const finishPromises = async () => new Promise(resolve => setTimeout(resolve, 0));

describe('BlacklisterControl', () => {
  it('Text components render properly', () => {
    const { findByText } = render(BlacklisterControl);
    const header = 'Check and Blacklist Roles';
    expect(findByText(header)).not.toBeNull();
  });


  it('Displays UNBLACKLIST when blacklisted address is looked up', async () => {
    const { getByText } = render(BlacklisterControl, {
      data: function() {
        return {
          address: padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH),
          isBlacklisted: true,
        };
      },
    });
    expect(getByText('This address is currently blacklisted.')).not.toBeNull();
    expect(getByText('Click to unblacklist.')).not.toBeNull();
  });

  it('Displays BLACKLIST when unblacklisted address is looked up', async () => {
    const { getByText } = render(BlacklisterControl, {
      data: function() {
        return {
          address: padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH),
          isBlacklisted: false,
        };
      },
    });
    expect(getByText('This address is not currently blacklisted.')).not.toBeNull();
    expect(getByText('Click to blacklist.')).not.toBeNull();
  });

  it('BLACKLISTs an unblacklisted address', async () => {
    const { getByText } = render(BlacklisterControl, {
      data: function() {
        return {
          address: padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH),
          isBlacklisted: false,
        };
      },
    });
    expect(getByText('This address is not currently blacklisted.')).not.toBeNull();
    expect(getByText('Click to blacklist.')).not.toBeNull();

    await fireEvent.click(getByText('BLACKLIST'));
    await finishPromises();
    expect(getByText('This address is currently blacklisted.')).not.toBeNull();
    expect(getByText('Click to unblacklist.')).not.toBeNull();
  });

  it('UNBLACKLISTs a blacklisted address', async () => {
    const { getByText } = render(BlacklisterControl, {
      data: function() {
        return {
          address: padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH),
          isBlacklisted: true,
        };
      },
    });
    expect(getByText('This address is currently blacklisted.')).not.toBeNull();
    expect(getByText('Click to unblacklist.')).not.toBeNull();

    await fireEvent.click(getByText('UNBLACKLIST'));
    await finishPromises();
    expect(getByText('This address is not currently blacklisted.')).not.toBeNull();
    expect(getByText('Click to blacklist.')).not.toBeNull();
  });


});
