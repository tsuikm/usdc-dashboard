import OwnerControl from '@/components/OwnerControl.vue';
import { render, fireEvent } from '@testing-library/vue';
import Web3 from 'web3';

const contract = new (new Web3()).eth.Contract();

function ethereumFactory(isConnectedToMetamask) {
  return {
    request: async config => {
      if (config.method === 'eth_sendTransaction') {
        await config.params[0].data();
      }

      // Simulates connecting to metamask as the owner.
      if (config.method === 'eth_requestAccounts') {
        return isConnectedToMetamask ? [await contract.methods.owner().call()] : [];
      }
    },
  };
}
const finishPromises = async () => new Promise(resolve => setTimeout(resolve, 0));

const SCRATCH_ADDRESS = '0x0000000e'; // has no roles
const OWNER_ERROR_MESSAGE = 'Error: You are not signed in as the owner of this contract and cannot reassign roles.';

describe('OwnerControl', () => {

  beforeEach(() => {
    Web3.MOCK_ACCOUNTS = {
      '0x0000000a': { pauser: true },
      '0x0000000b': { owner: true },
      '0x0000000c': { blacklister: true },
      '0x0000000d': { masterMinter: true },
      [SCRATCH_ADDRESS]: {},
    };
  });

  it('Text components render properly', () => {
    const { getByText } = render(OwnerControl);
    expect(getByText('Check and Assign Roles')).not.toBeNull();
    expect(getByText('MASTER MINTER')).not.toBeNull();
    expect(getByText('BLACKLISTER')).not.toBeNull();
    expect(getByText('OWNER')).not.toBeNull();
    expect(getByText('PAUSER')).not.toBeNull();
  });

  it('Changes roles correctly', async () => {
    const { getByText, getByPlaceholderText } = render(OwnerControl);

    // Simulates connecting to metamask as the owner.
    global.ethereum = ethereumFactory(true);

    const input = getByPlaceholderText('Enter Wallet Address Here');
    const masterMinterButton = getByText('MASTER MINTER');
    const blacklisterButton = getByText('BLACKLISTER');
    const pauserButton = getByText('PAUSER');
    const ownerButton = getByText('OWNER');
    const saveButton = getByText('SAVE');

    await fireEvent.update(input, SCRATCH_ADDRESS);

    await fireEvent.click(masterMinterButton);
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(await contract.methods.masterMinter().call()).toBe(SCRATCH_ADDRESS);

    await fireEvent.click(blacklisterButton);
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(await contract.methods.blacklister().call()).toBe(SCRATCH_ADDRESS);

    await fireEvent.click(pauserButton);
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(await contract.methods.pauser().call()).toBe(SCRATCH_ADDRESS);

    await fireEvent.click(ownerButton);
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(await contract.methods.owner().call()).toBe(SCRATCH_ADDRESS);
  });

  it('Prevents reassigning roles when owner is not connected', async () => {
    const { getByText, getByPlaceholderText } = render(OwnerControl);

    global.ethereum = ethereumFactory(false);

    const input = getByPlaceholderText('Enter Wallet Address Here');
    const masterMinterButton = getByText('MASTER MINTER');
    const blacklisterButton = getByText('BLACKLISTER');
    const pauserButton = getByText('PAUSER');
    const ownerButton = getByText('OWNER');
    const saveButton = getByText('SAVE');

    await fireEvent.update(input, SCRATCH_ADDRESS);

    await fireEvent.click(masterMinterButton);
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(getByText(OWNER_ERROR_MESSAGE)).not.toBeNull();
    expect(await contract.methods.masterMinter().call()).not.toBe(SCRATCH_ADDRESS);

    await fireEvent.click(blacklisterButton);
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(getByText(OWNER_ERROR_MESSAGE)).not.toBeNull();
    expect(await contract.methods.blacklister().call()).not.toBe(SCRATCH_ADDRESS);

    await fireEvent.click(pauserButton);
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(getByText(OWNER_ERROR_MESSAGE)).not.toBeNull();
    expect(await contract.methods.pauser().call()).not.toBe(SCRATCH_ADDRESS);

    await fireEvent.click(ownerButton);
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(getByText(OWNER_ERROR_MESSAGE)).not.toBeNull();
    expect(await contract.methods.owner().call()).not.toBe(SCRATCH_ADDRESS);
  });
});
