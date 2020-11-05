import SummaryPage from '@/pages/index';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { render } from '@testing-library/vue';
import { padHex, toHex } from '@/utils/utils';
import Web3 from 'web3';

Vue.use(VueMaterial);

const MOCK_ACCOUNTS = {
  '0x1': {
    balance: 10000,
    minter: true,
    pauser: false,
    owner: false,
    blacklisted: false,
  },
  '0x2': {
    balance: 10000,
    minter: false,
    pauser: true,
    owner: false,
    blacklisted: false,
  },
  '0x3': {
    balance: 10000,
    minter: false,
    pauser: false,
    owner: true,
    blacklisted: false,
  },
  '0x4': {
    balance: 10000,
    minter: false,
    pauser: false,
    owner: false,
    blacklisted: true,
  },
};
const MOCK_WALLET_ADDRESS = padHex('0x123456789abcdef', 64);
const MOCK_TRANSACTIONS = [
  {
    data: '0x010121',
    transactionHash: '0x0999',
    blockNumber: 2,
    sender: MOCK_WALLET_ADDRESS,
    receiver: padHex('0x232323', 64),
  },
  {
    data: '0x0109',
    transactionHash: '0x01111',
    blockNumber: 3,
    sender: MOCK_WALLET_ADDRESS,
    receiver: padHex('0x288765', 64),
  },
  {
    data: '0x087698',
    transactionHash: '0x12345',
    blockNumber: 6,
    sender: MOCK_WALLET_ADDRESS,
    receiver: padHex('0x2919191', 64),
  },
  {
    data: '0x100000',
    transactionHash: '0x13579',
    blockNumber: 1,
    sender: padHex('0x2468a', 64),
    receiver: MOCK_WALLET_ADDRESS,
  },
];

Web3.MOCK_TRANSACTIONS = MOCK_TRANSACTIONS;
Web3.MOCK_ACCOUNTS = MOCK_ACCOUNTS;

const MOCK_MINTERS = ['0x5', '0x6'];
const MOCK_BLACKLISTER = '0x7';

global.fetch = async (url) => {
  switch(url) {
  case 'http://localhost:3000/api/minters':
    return {
      json: async () => MOCK_MINTERS,
    };
  case 'http://localhost:3000/api/blacklister':
    return {
      json: async () => MOCK_BLACKLISTER,
    };
  default:
    break;
  }
};

describe('SummaryPage', () => {
  it('Header renders properly', () => {
    const { getByText } = render(SummaryPage, {
      stubs: {
        NuxtLink: true,
      },
    });
    const header = 'USDC Dashboard';
    expect(getByText(header)).not.toBeNull();
  });

  it('Renders recent transactions', async () => {
    const { getByText } = render(SummaryPage, {
      stubs: {
        NuxtLink: true,
      },
    });
    expect(getByText('Recent Transactions')).not.toBeNull();
    expect(getByText('See all transactions')).not.toBeNull();

    // Finish all promises
    await new Promise((resolve) => setTimeout(resolve, 0));
    
    expect(getByText(MOCK_TRANSACTIONS[0].transactionHash)).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[1].transactionHash)).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[2].transactionHash)).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[3].transactionHash)).not.toBeNull();
  });

  it('Renders latest blocks', async () => {
    const { getByText } = render(SummaryPage, {
      stubs: {
        NuxtLink: true,
      },
    });
    expect(getByText('Latest Blocks')).not.toBeNull();
    expect(getByText('See all blocks')).not.toBeNull();

    // Finish all promises
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getByText(MOCK_TRANSACTIONS[0].blockNumber.toString() + ' / ' + toHex(MOCK_TRANSACTIONS[0].blockNumber))).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[1].blockNumber.toString() + ' / ' + toHex(MOCK_TRANSACTIONS[1].blockNumber))).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[2].blockNumber.toString() + ' / ' + toHex(MOCK_TRANSACTIONS[2].blockNumber))).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[3].blockNumber.toString() + ' / ' + toHex(MOCK_TRANSACTIONS[3].blockNumber))).not.toBeNull();
  });

  it('Renders privileged roles', async () => {
    const { getByText } = render(SummaryPage, {
      stubs: {
        NuxtLink: true,
      },
    });
    expect(getByText('Owner')).not.toBeNull();
    expect(getByText('Pausers')).not.toBeNull();
    expect(getByText('Blacklister')).not.toBeNull();
    expect(getByText('Minters')).not.toBeNull();

    // Finish all promises
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getByText(MOCK_BLACKLISTER)).not.toBeNull();
    for (const minter of MOCK_MINTERS) {
      expect(getByText(minter)).not.toBeNull();
    }
  });
});
