import { fireEvent, render } from '@testing-library/vue';
import AlgorandFetchFactory from '@/../tests/algorand-fetch-mock';
import { finishPromises } from '@/utils/utils';
import AlgoTransactions from '@/pages/algorand/transactions';

const MOCK_WALLET_ADDRESS = '0x123456789abcdef';
const MOCK_TRANSACTIONS = [
  {
    id: '0x0999',
    sender: MOCK_WALLET_ADDRESS,
    'asset-transfer-transaction': {
        amount: 1345,
        receiver: '0x232323',
    },
    'confirmed-round': 2,
  },
  {
    id: '0x01111',
    sender: MOCK_WALLET_ADDRESS,
    'asset-transfer-transaction': {
        amount: 1049,
        receiver: '0x288765',
    },
    'confirmed-round': 3,
  },
  {
    id: '0x12345',
    sender: MOCK_WALLET_ADDRESS,
    'asset-transfer-transaction': {
        amount: 1340,
        receiver: '0x2919191',
    },
    'confirmed-round': 6,
  },
  {
    id: '0x13579',
    sender: MOCK_WALLET_ADDRESS,
    'asset-transfer-transaction': {
        amount: 4001,
        receiver: '0x2468a',
    },
    'confirmed-round': 1,
  },
  {
    id: '0x1357a',
    sender: MOCK_WALLET_ADDRESS,
    'asset-transfer-transaction': {
        amount: 14000,
        receiver: '0x2468a',
    },
    'confirmed-round': 4,
  },
  {
    id: '0x1357b',
    sender: MOCK_WALLET_ADDRESS,
    'asset-transfer-transaction': {
        amount: 4100042,
        receiver: '0x24690',
    },
    'confirmed-round': 5,
  },
  {

    id: '0xd0a69b',
    sender: '0x843935',
    'asset-transfer-transaction': {
        amount: 149914,
        receiver: '0x843934',
    },
    'confirmed-round': 7,
  },
];

AlgorandFetchFactory.MOCK_TRANSACTIONS = MOCK_TRANSACTIONS;
AlgorandFetchFactory.CURRENT_ROUND = 10;

global.fetch = AlgorandFetchFactory.fetch;

describe('_address.vue', () => {
  it('renders all transactions correctly', async () => {
    const { getByTestId, getByText } = render(AlgoTransactions);

    await finishPromises();

    expect(getByTestId('md-table')).not.toBeNull();

    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[6].id)).not.toBeNull();
    expect(getByText((parseInt(AlgorandFetchFactory.MOCK_TRANSACTIONS[6]['asset-transfer-transaction'].amount) / 10 ** 6).toString())).not.toBeNull();
    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[6].sender)).not.toBeNull();
    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[6]['asset-transfer-transaction'].receiver)).not.toBeNull();
    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[6]['confirmed-round'].toString())).not.toBeNull();
  });

  it('paginates correctly', async () => {
    // Push more transactions to have over 25 and enable pagination
    for (let i = 0; i < 21; i++) {
      AlgorandFetchFactory.MOCK_TRANSACTIONS.push({

        id: `0x${i.toString(16)}`,
        sender: MOCK_WALLET_ADDRESS,
        'asset-transfer-transaction': {
            amount: 1234567,
            receiver: '0x24690'
        },
        'confirmed-round': 5,
      });
    }

    // MOCK_RECEIVER_TXNS now has 24 transactions (8 copies of the same 3 original items)
    // for a total of 27 transactions with the 3 in MOCK_SENDER_TXNS

    const { getByTestId, getByText, getAllByText } = render(AlgoTransactions);

    await finishPromises();

    expect(getByTestId('md-table')).not.toBeNull();

    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[2].id)).not.toBeNull();
    expect(getByText((parseInt(AlgorandFetchFactory.MOCK_TRANSACTIONS[2]['asset-transfer-transaction'].amount) / 10 ** 6).toString())).not.toBeNull();
    expect(getAllByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[2].sender)).not.toBeNull();
    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[2]['asset-transfer-transaction'].receiver)).not.toBeNull();
    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[2]['confirmed-round'].toString())).not.toBeNull();

    // Go to next page
    await fireEvent.click(getByText('navigate_next'));

    await finishPromises();

    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[3].id)).not.toBeNull();
    expect(getByText((parseInt(AlgorandFetchFactory.MOCK_TRANSACTIONS[3]['asset-transfer-transaction'].amount) / 10 ** 6).toString())).not.toBeNull();
    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[3].sender)).not.toBeNull();
    expect(getAllByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[3]['asset-transfer-transaction'].receiver)).not.toBeNull();
    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[3]['confirmed-round'].toString())).not.toBeNull();
  });
});
