import SummaryPage from '@/pages/index';
import { render } from '@testing-library/vue';
import { padHex, toHex } from '@/utils/utils';
import Web3 from 'web3';

const MOCK_ACCOUNTS = {
  '0x1': {
    owner: true,
  },
  '0x2': {
    pauser: true,
  },
  '0x3': {
    blacklister: true,
  }
};
const MOCK_TRANSACTIONS = [
  {
    transactionHash: '0x0999',
    blockNumber: 2,
  },
  {
    transactionHash: '0x01111',
    blockNumber: 3,
  },
  {
    transactionHash: '0x12345',
    blockNumber: 6,
  },
  {
    transactionHash: '0x13579',
    blockNumber: 1,
  },
];

Web3.MOCK_TRANSACTIONS = MOCK_TRANSACTIONS;
Web3.MOCK_ACCOUNTS = MOCK_ACCOUNTS;

const MOCK_MINTERS = ['0x5', '0x6'];

global.fetch = async () => {
  return {
    json: async () => MOCK_MINTERS,
  };
};

describe('Ethereum Summary Page', () => {

  it('Renders recent transactions', async () => {
    const { getByText } = render(SummaryPage);

    // Finish all promises
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getByText(MOCK_TRANSACTIONS[0].transactionHash)).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[1].transactionHash)).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[2].transactionHash)).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[3].transactionHash)).not.toBeNull();
  });

  it('Renders latest blocks', async () => {
    const { getByText } = render(SummaryPage);

    // Finish all promises
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getByText(MOCK_TRANSACTIONS[0].blockNumber.toString() + ' / ' + toHex(MOCK_TRANSACTIONS[0].blockNumber))).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[1].blockNumber.toString() + ' / ' + toHex(MOCK_TRANSACTIONS[1].blockNumber))).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[2].blockNumber.toString() + ' / ' + toHex(MOCK_TRANSACTIONS[2].blockNumber))).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[3].blockNumber.toString() + ' / ' + toHex(MOCK_TRANSACTIONS[3].blockNumber))).not.toBeNull();
  });

  it('Renders privileged roles', async () => {
    const { getByText } = render(SummaryPage);

    // Finish all promises
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getByText('Owner')).not.toBeNull();
    expect(getByText('Pauser')).not.toBeNull();
    expect(getByText('Blacklister')).not.toBeNull();
    expect(getByText('Minters')).not.toBeNull();

    // Finish all promises
    await new Promise((resolve) => setTimeout(resolve, 0));

    for (const role of Object.keys(Web3.MOCK_ACCOUNTS)) {
      expect(getByText(role)).not.toBeNull();
    }

    for (const minter of MOCK_MINTERS) {
      expect(getByText(minter)).not.toBeNull();
    }
  });
});
