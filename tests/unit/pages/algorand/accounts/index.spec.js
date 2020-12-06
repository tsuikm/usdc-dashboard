import { render, fireEvent } from '@testing-library/vue';
import { toHex, fromHex, finishPromises } from '@/utils/utils';
import AlgorandFetchFactory from '@/../tests/algorand-fetch-mock';
import AlgoAccounts from '@/pages/algorand/accounts';

const MOCK_TRANSACTIONS = [];

for (let i = 0; i < 101; i++) {
  const randomQuantity = Math.random() * 109502;
  MOCK_TRANSACTIONS.push({

    id: toHex(i),
    sender: toHex(i),
    ['asset-transfer-transaction']: {
        amount: randomQuantity,
        receiver: toHex(Math.floor(Math.random() * 101)),
    },
    ['confirmed-round']: 1,
  });
}

const MOCK_ACCOUNTS = {};
for (let transaction of MOCK_TRANSACTIONS) {
  let address = transaction.sender;
  if (!(address in MOCK_ACCOUNTS)) {
    MOCK_ACCOUNTS[address] = {
      amount: transaction['asset-transfer-transaction'].amount,
    };
  } else {
    MOCK_ACCOUNTS[address].amount += transaction['asset-transfer-transaction'].amount;
  }
}

AlgorandFetchFactory.MOCK_TRANSACTIONS = MOCK_TRANSACTIONS;
AlgorandFetchFactory.MOCK_ACCOUNTS = MOCK_ACCOUNTS;
AlgorandFetchFactory.DECIMALS = 6;

global.fetch = AlgorandFetchFactory.fetch;

describe('accounts', () => {
  it('accounts displays a table titled Accounts with columns for Address, Balance and Percentage', () => {
    const { getByText, getAllByText } = render(AlgoAccounts);
    expect(getAllByText('Accounts')).toHaveLength(2);
    expect(getByText('Address')).not.toBeNull();
    expect(getByText('Balance')).not.toBeNull();
    expect(getByText('Percentage')).not.toBeNull();
  });

  it('orders accounts by balance', async () => {
    const { getByText } = render(AlgoAccounts);

    let addresses = [...Object.keys(AlgorandFetchFactory.MOCK_ACCOUNTS)].sort((a, b) => {
      return AlgorandFetchFactory.MOCK_ACCOUNTS[b].amount - AlgorandFetchFactory.MOCK_ACCOUNTS[a].amount;
    });

    // Finish all promises
    await finishPromises();

    // top 25 accounts by balance
    for (let i = 0; i < 25; i++) {
      expect(getByText(addresses[i])).not.toBeNull();
      expect(getByText(`${AlgorandFetchFactory.MOCK_ACCOUNTS[addresses[i]].amount / 10 ** AlgorandFetchFactory.DECIMALS}`)).not.toBeNull();
    }

    // go to page 2
    await fireEvent.click(getByText('navigate_next'));
    getByText('First');
    getByText('Page 2 of ' + Math.ceil(addresses.length / 25));
    getByText('Last');

    // next top 25 accounts by balance
    for (let i = 25; i < 50; i++) {
      expect(getByText(addresses[i])).not.toBeNull();
      expect(getByText(`${AlgorandFetchFactory.MOCK_ACCOUNTS[addresses[i]].amount / 10 ** AlgorandFetchFactory.DECIMALS}`)).not.toBeNull();
    }
  });
});
