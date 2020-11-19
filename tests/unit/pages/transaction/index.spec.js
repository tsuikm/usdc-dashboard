import TransactionDetailsPage from '@/pages/transaction/_transaction.vue';
import { render } from '@testing-library/vue';
import { padHex } from '@/utils/utils';
import Web3 from 'web3';

const finishPromises = async () => new Promise(resolve => setTimeout(resolve, 0));

const TRANSACTION_DATA = '0x100000';
const TRANSACTION_HASH = '0x13579';
const BLOCK_NUMBER = 1;
const SENDER = padHex('0x2468a', 64);
const RECEIVER = padHex('0x13579', 64);
const GAS = 100;

const MOCK_TRANSACTIONS = [
  {
    data: TRANSACTION_DATA,
    transactionHash: TRANSACTION_HASH,
    blockNumber: BLOCK_NUMBER,
    from: SENDER,
    to: RECEIVER,
    gas: GAS,
  },
];

Web3.MOCK_TRANSACTIONS = MOCK_TRANSACTIONS;

describe('Transaction Details Page', () => {
  it('Renders transaction details', async () => {
    const { getByText } = render(TransactionDetailsPage, {
      mocks: {
        $route: { 
          path: `/transaction/${TRANSACTION_HASH}`, 
          params: {
            transaction: TRANSACTION_HASH,
          }, 
        },
      },
    });

    expect(getByText('Transaction Details')).not.toBeNull();

    expect(getByText('Transaction Hash:')).not.toBeNull();
    expect(getByText('Sender:')).not.toBeNull();
    expect(getByText('Receiver:')).not.toBeNull();
    expect(getByText('Block Number:')).not.toBeNull();
    expect(getByText('Gas:')).not.toBeNull();

    await finishPromises();

    expect(getByText(TRANSACTION_HASH)).not.toBeNull();
    expect(getByText(SENDER)).not.toBeNull();
    expect(getByText(RECEIVER)).not.toBeNull();
    expect(getByText(BLOCK_NUMBER.toString())).not.toBeNull();
    expect(getByText(GAS.toString())).not.toBeNull();
  });
});
