import MasterminterControl from '@/pages/roles/masterminter/index';
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
        return isConnectedToMetamask ? [MASTERMINTER] : [];
      }
    },
  };
}
const MASTERMINTER = padHex('0x00000001', WEB3_BALANCEOF_ADDRESS_LENGTH);
const MINTER = padHex('0x00000002', WEB3_BALANCEOF_ADDRESS_LENGTH);
Web3.MOCK_ACCOUNTS = {
  [MASTERMINTER]: {},
  [MINTER]: {},
  [padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH)]: {},
};
global.ethereum = ethereumFactory(true);

const finishPromises = async () => new Promise(resolve => setTimeout(resolve, 0));

describe('MasterminterControl', () => {
  it('Text components render properly', () => {
    const { findByText } = render(MasterminterControl);
    const header = 'Check and Configure Minters';
    expect(findByText(header)).not.toBeNull();
  });


  it('Displays correctly when minter is looked up', async () => {
    const { getByText } = render(MasterminterControl, {
      data: function() {
        return {
          address: MINTER,
          isMinter: true,
          minterAllowance: 500,
        };
      },
    });
    expect(getByText('This address is currently a minter with allowance 500.')).not.toBeNull();
    expect(getByText('Click to increase the allowance or remove the minter.')).not.toBeNull();
  });

  it('Displays correctly when non minter address is looked up', async () => {
    const { getByText } = render(MasterminterControl, {
      data: function() {
        return {
          address: padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH),
          isMinter: false,
        };
      },
    });
    expect(getByText('This address is not currently a minter.')).not.toBeNull();
    expect(getByText('Click to configure minter.')).not.toBeNull();
  });

  it('Configures a new minter correctly', async () => {
    const { getByText } = render(MasterminterControl, {
      data: function() {
        return {
          address: padHex('0x00000000', WEB3_BALANCEOF_ADDRESS_LENGTH),
          isMinter: false,
          minterAllowance: 50,
        };
      },
    });
    expect(getByText('This address is not currently a minter.')).not.toBeNull();
    expect(getByText('Click to configure minter.')).not.toBeNull();

    await fireEvent.click(getByText('CONFIGURE MINTER'));
    await finishPromises();
    expect(getByText('This address is currently a minter with allowance 50.')).not.toBeNull();
    expect(getByText('Click to increase the allowance or remove the minter.')).not.toBeNull();
  });

  it('Removes a minter correctly', async () => {
    const { getByText } = render(MasterminterControl, {
      data: function() {
        return {
          address: MINTER,
          isMinter: true,
          minterAllowance: 170,
        };
      },
    });
    expect(getByText('This address is currently a minter with allowance 170.')).not.toBeNull();
    expect(getByText('Click to increase the allowance or remove the minter.')).not.toBeNull();

    await fireEvent.click(getByText('REMOVE MINTER'));
    await finishPromises();
    expect(getByText('This address is not currently a minter.')).not.toBeNull();
    expect(getByText('Click to configure minter.')).not.toBeNull();
  });

  it('Updates allowance of a minter correctly', async () => {
    const { getByText } = render(MasterminterControl, {
      data: function() {
        return {
          address: MINTER,
          isMinter: true,
          minterAllowance: 195,
          allowance: 675,
        };
      },
    });
    expect(getByText('This address is currently a minter with allowance 195.')).not.toBeNull();
    expect(getByText('Click to increase the allowance or remove the minter.')).not.toBeNull();

    await fireEvent.click(getByText('INCREASE ALLOWANCE'));
    await finishPromises();
    expect(getByText('This address is currently a minter with allowance 675.')).not.toBeNull();
    expect(getByText('Click to increase the allowance or remove the minter.')).not.toBeNull();
  });


});
