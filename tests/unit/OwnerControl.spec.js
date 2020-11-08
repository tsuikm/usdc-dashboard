import OwnerControl from '@/components/OwnerControl.vue';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { render, fireEvent } from '@testing-library/vue';
import Web3 from 'web3';

Vue.use(VueMaterial);

function ethereumFactory(isConnectedToMetamask) {
  return {
    request: async config => {
      if (config.method === 'eth_sendTransaction') {
        await config.params[0].data();
      }

      // Simulates connecting to metamask as the owner.
      if (config.method === 'eth_requestAccounts') {
        return isConnectedToMetamask ? [Web3.OWNER] : [];
      }
    },
  };
}

const SCRATCH_ADDRESS = '0x0000000e'; // has no roles.

function createRoleAccounts() {
  Web3.PAUSER = '0x0000000a';
  Web3.OWNER = '0x0000000b';
  Web3.BLACKLISTER = '0x0000000c';
  Web3.MASTER_MINTER = '0x0000000d';
}

describe('OwnerControl', () => {

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
    createRoleAccounts();
    global.ethereum = ethereumFactory(true);

    const input = getByPlaceholderText('Enter Wallet Address Here');
    const masterMinterButton = getByText('MASTER MINTER');
    const blacklisterButton = getByText('BLACKLISTER');
    const pauserButton = getByText('PAUSER');
    const ownerButton = getByText('OWNER');
    const saveButton = getByText('SAVE');
    const finishPromises = async () => new Promise(resolve => setTimeout(resolve, 0));

    await fireEvent.update(input, SCRATCH_ADDRESS);

    await fireEvent.click(masterMinterButton);
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(Web3.MASTER_MINTER).toBe(SCRATCH_ADDRESS);

    await fireEvent.click(blacklisterButton);
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(Web3.BLACKLISTER).toBe(SCRATCH_ADDRESS);

    await fireEvent.click(pauserButton);
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(Web3.PAUSER).toBe(SCRATCH_ADDRESS);

    await fireEvent.click(ownerButton);
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(Web3.OWNER).toBe(SCRATCH_ADDRESS);
  });

  it('Prevents reassigning roles when owner is not connected', async () => {
    const { getByText, getByPlaceholderText } = render(OwnerControl);
    createRoleAccounts();
    global.ethereum = ethereumFactory(false);

    const input = getByPlaceholderText('Enter Wallet Address Here');
    const masterMinterButton = getByText('MASTER MINTER');
    const blacklisterButton = getByText('BLACKLISTER');
    const pauserButton = getByText('PAUSER');
    const ownerButton = getByText('OWNER');
    const saveButton = getByText('SAVE');
    const finishPromises = async () => new Promise(resolve => setTimeout(resolve, 0));

    await fireEvent.update(input, SCRATCH_ADDRESS);

    await fireEvent.click(masterMinterButton);
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(Web3.MASTER_MINTER).not.toBe(SCRATCH_ADDRESS);

    await fireEvent.click(blacklisterButton);
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(Web3.BLACKLISTER).not.toBe(SCRATCH_ADDRESS);

    await fireEvent.click(pauserButton);
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(Web3.PAUSER).not.toBe(SCRATCH_ADDRESS);

    await fireEvent.click(ownerButton);
    await fireEvent.click(saveButton);
    await finishPromises();
    expect(Web3.OWNER).not.toBe(SCRATCH_ADDRESS);
  });

});
