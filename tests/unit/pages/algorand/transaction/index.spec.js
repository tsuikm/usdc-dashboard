import AlgoTransactionDetailsPage from '@/pages/algorand/transaction/_transaction.vue';
import AlgorandFetchFactory from '@/../tests/algorand-fetch-mock';
import { render } from '@testing-library/vue';
import { padHex, finishPromises } from '@/utils/utils';

AlgorandFetchFactory.TRANSACTION_ID = '0x13579';
AlgorandFetchFactory.CONFIRMED_ROUND = 1;
AlgorandFetchFactory.SENDER = padHex('0x2468a', 64);
AlgorandFetchFactory.RECEIVER = padHex('0x13579', 64);
AlgorandFetchFactory.FEE = 100;

AlgorandFetchFactory.MOCK_TRANSACTIONS = [
  {
    id: AlgorandFetchFactory.TRANSACTION_ID,
    fee: AlgorandFetchFactory.FEE,
    sender: AlgorandFetchFactory.SENDER,
    'asset-transfer-transaction': {
      receiver: AlgorandFetchFactory.RECEIVER,
    },
    'confirmed-round': AlgorandFetchFactory.CONFIRMED_ROUND,
  },
];

global.fetch = AlgorandFetchFactory.fetch;

describe('Algorand Transaction Details Page', () => {
  it('Renders algorand transaction details', async () => {
    const { getByText } = render(AlgoTransactionDetailsPage, {
      mocks: {
        $route: { 
          path: `/algorand/transaction/${AlgorandFetchFactory.TRANSACTION_ID}`, 
          params: {
            transaction: AlgorandFetchFactory.TRANSACTION_ID,
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

    expect(getByText(AlgorandFetchFactory.TRANSACTION_ID)).not.toBeNull();
    expect(getByText(SENDER)).not.toBeNull();
    expect(getByText(RECEIVER)).not.toBeNull();
    expect(getByText(CONFIRMED_ROUND.toString())).not.toBeNull();
    expect(getByText(FEE.toString())).not.toBeNull();
  });
});
