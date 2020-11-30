import AddressDetailsPage from '@/pages/address/_address';
import { render } from '@testing-library/vue';
import { padHex, finishPromises } from '@/utils/utils';
import Web3 from 'web3';

const MOCK_ACCOUNTS = {
  '0xf7c343FBc40F6B34DaA8bC2a97607BA4cEDF98c3': {
    balance: 10000,
    minter: true,
    pauser: false,
    owner: false,
    blacklisted: false,
  },
};
const MOCK_WALLET_ADDRESS = '0xf7c343FBc40F6B34DaA8bC2a97607BA4cEDF98c3';

Web3.MOCK_ACCOUNTS = MOCK_ACCOUNTS;
Web3.MOCK_WALLET_ADDRESS = MOCK_WALLET_ADDRESS;

const TRANSACTION_DATA = '0x100000';
const TRANSACTION_HASH = '0x13579';
const BLOCK_NUMBER = 1;
const SENDER = padHex('0x2468a', 64);
const RECEIVER = padHex('0x13579', 64);
const AGE = '17 days';

const MOCK_TRANSACTIONS = [
  {
    data: TRANSACTION_DATA,
    transactionHash: TRANSACTION_HASH,
    blockNumber: BLOCK_NUMBER,
    from: SENDER,
    to: RECEIVER,
    age: AGE,
  },
];

Web3.MOCK_TRANSACTIONS = MOCK_TRANSACTIONS;

describe('Address Details Page', () => {

  it('Renders address transaction table', async () => {
    const { getByText } = render(AddressDetailsPage, {
      mocks: {
        $route: {
          path: `/address/${MOCK_WALLET_ADDRESS}`,
          params: {
            address: MOCK_WALLET_ADDRESS,
          },
          query: {
            page: 1, // Load with ?page=1
          },
        },
        data: function () {
          return {
            balance: 10000,
            isBlacklisted: false,
            roles: ['Minter'],
            transactions: [MOCK_TRANSACTIONS],
            loading: true,
          };
        },
      },
    });

    expect(getByText('Address Transactions')).not.toBeNull();
    expect(getByText('Transaction Hash')).not.toBeNull();
    expect(getByText('Quantity')).not.toBeNull();
    expect(getByText('Sender')).not.toBeNull();
    expect(getByText('Receiver')).not.toBeNull();
    expect(getByText('Age')).not.toBeNull();
    expect(getByText('Block Number')).not.toBeNull();

    await finishPromises();

    expect(getByText(TRANSACTION_HASH)).not.toBeNull();
    expect(getByText(SENDER)).not.toBeNull();
    expect(getByText(RECEIVER)).not.toBeNull();
    expect(getByText(BLOCK_NUMBER.toString())).not.toBeNull();
  });
});
