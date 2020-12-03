import AlgoTransactionDetailsPage from '@/pages/algorand/transaction/_transaction.vue';
import { render } from '@testing-library/vue';
import { padHex, finishPromises } from '@/utils/utils';

const TRANSACTION_ID = '0x13579';
const CONFIRMED_ROUND = 1;
const SENDER = padHex('0x2468a', 64);
const RECEIVER = padHex('0x13579', 64);
const FEE = 100;

const MOCK_TRANSACTIONS = [
  {
    id: TRANSACTION_ID,
    fee: FEE,
    sender: SENDER,
    'asset-transfer-transaction': {
      receiver: RECEIVER,
    },
    'confirmed-round': CONFIRMED_ROUND,
  },
];

Web3.MOCK_TRANSACTIONS = MOCK_TRANSACTIONS;

describe('Algorand Transaction Details Page', () => {
  it('Renders algorand transaction details', async () => {
    const { getByText } = render(AlgoTransactionDetailsPage, {
      mocks: {
        $route: { 
          path: `/algorand/transaction/${TRANSACTION_ID}`, 
          params: {
            transaction: TRANSACTION_ID,
          }, 
        },
      },
    });

    expect(getByText('Transaction Details')).not.toBeNull();

    expect(getByText('Transaction ID')).not.toBeNull();
    expect(getByText('Sender')).not.toBeNull();
    expect(getByText('Receiver')).not.toBeNull();
    expect(getByText('Block Number')).not.toBeNull();
    expect(getByText('Fee')).not.toBeNull();

    await finishPromises();

    expect(getByText(TRANSACTION_ID)).not.toBeNull();
    expect(getByText(SENDER)).not.toBeNull();
    expect(getByText(RECEIVER)).not.toBeNull();
    expect(getByText(CONFIRMED_ROUND.toString())).not.toBeNull();
    expect(getByText(FEE.toString())).not.toBeNull();
  });
});
