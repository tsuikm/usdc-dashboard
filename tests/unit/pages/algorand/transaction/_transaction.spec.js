import AlgoTransactionDetailsPage from '@/pages/algorand/transaction/_transaction.vue';
import AlgorandFetchFactory from '@/../tests/algorand-fetch-mock';
import { render, cleanup } from '@testing-library/vue';
import { finishPromises } from '@/utils/utils';

const TRANSACTION_ID = '0x13579';
AlgorandFetchFactory.CURRENT_ROUND = 1;
const SENDER = '0x2468a';
const RECEIVER = '0x13379';
const FEE = 100;

AlgorandFetchFactory.MOCK_TRANSACTIONS = [
  {
    id: TRANSACTION_ID,
    fee: FEE,
    sender: SENDER,
    'asset-transfer-transaction': {
      receiver: RECEIVER,
      amount: 0,
    },
    'confirmed-round': AlgorandFetchFactory.CURRENT_ROUND,
    'tx-type': 'transfer',
  },
];

global.fetch = AlgorandFetchFactory.fetch;

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
    expect(getByText(AlgorandFetchFactory.CURRENT_ROUND.toString())).not.toBeNull();
    expect(getByText(FEE.toString())).not.toBeNull();
  });
});
