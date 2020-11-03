import SummaryPage from '@/pages/index';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { render } from '@testing-library/vue';
import { padHex } from '@/utils/utils';
import Web3 from 'web3';

Vue.use(VueMaterial);

const MOCK_ACCOUNTS = [
  {
    balance: 10000,
    minter: true,
    pauser: false,
    owner: false,
    blacklisted: false,
  },
  {
    balance: 10000,
    minter: false,
    pauser: true,
    owner: false,
    blacklisted: false,
  },
  {
    balance: 10000,
    minter: false,
    pauser: false,
    owner: true,
    blacklisted: false,
  },
  {
    balance: 10000,
    minter: false,
    pauser: false,
    owner: false,
    blacklisted: true,
  },
];
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

describe('SummaryPage', () => {
  it('Header renders properly', () => {
    const { findByText } = render(SummaryPage, {
      stubs: {
        NuxtLink: true,
      },
    });
    const header = 'USDC Dashboard';
    expect(findByText(header)).not.toBeNull();
  });

  it('Renders recent transactions', async () => {
    const { findByText } = render(SummaryPage, {
      stubs: {
        NuxtLink: true,
      },
    });
    expect(findByText('Recent Transactions')).not.toBeNull();
    expect(findByText('See all transactions')).not.toBeNull();
    expect(findByText(MOCK_TRANSACTIONS[0].transactionHash)).not.toBeNull();
    expect(findByText(MOCK_TRANSACTIONS[1].transactionHash)).not.toBeNull();
    expect(findByText(MOCK_TRANSACTIONS[2].transactionHash)).not.toBeNull();
    expect(findByText(MOCK_TRANSACTIONS[3].transactionHash)).not.toBeNull();
  });

  it('Renders latest blocks', async () => {
    const { findByText } = render(SummaryPage, {
      stubs: {
        NuxtLink: true,
      },
    });
    expect(findByText('Latest Blocks')).not.toBeNull();
    expect(findByText('See all blocks')).not.toBeNull();
    expect(findByText(MOCK_TRANSACTIONS[0].blockNumber)).not.toBeNull();
    expect(findByText(MOCK_TRANSACTIONS[1].blockNumber)).not.toBeNull();
    expect(findByText(MOCK_TRANSACTIONS[2].blockNumber)).not.toBeNull();
    expect(findByText(MOCK_TRANSACTIONS[3].blockNumber)).not.toBeNull();
  });

  it('Renders privileged roles', async () => {
    const { findByText } = render(SummaryPage, {
      stubs: {
        NuxtLink: true,
      },
    });
    expect(findByText('Owner')).not.toBeNull();
    expect(findByText('Pausers')).not.toBeNull();
    expect(findByText(MOCK_WALLET_ADDRESS)).not.toBeNull();
  });
});
