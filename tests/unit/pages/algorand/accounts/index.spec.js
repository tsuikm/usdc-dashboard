import { render, fireEvent } from '@testing-library/vue';
import { fromHex, padHex, toHex, removeLeadingZeros } from '@/utils/utils';
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import AlgoAccounts from '@/pages/algorand/accounts';

const MOCK_TRANSACTIONS = [];

for (let i = 0; i < 101; i++) {
  const randomQuantity = Math.random() * 109502;
  MOCK_TRANSACTIONS.push({

    id: toHex(i),
    sender: padHex(toHex(i), WEB3_BALANCEOF_ADDRESS_LENGTH),
    'asset-transfer-transaction': {
        amount: randomQuantity,
        receiver: padHex(toHex(Math.floor(Math.random() * 101)), WEB3_BALANCEOF_ADDRESS_LENGTH),
    },
    'confirmed-round': 1,
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

Web3.MOCK_TRANSACTIONS = MOCK_TRANSACTIONS;
Web3.MOCK_ACCOUNTS = MOCK_ACCOUNTS;

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
    const decimals = await (new (new Web3()).eth.Contract()).methods.decimals().call();

    let addresses = [...Object.keys(MOCK_ACCOUNTS)].sort((a, b) => {
      return MOCK_ACCOUNTS[b].balance - MOCK_ACCOUNTS[a].balance;
    });

    // Finish all promises
    await new Promise((resolve) => setTimeout(resolve, 0));

    // top 25 accounts by balance
    for (let i = 0; i < 25; i++) {
      expect(getByText(removeLeadingZeros(addresses[i]))).not.toBeNull();
      expect(getByText(`${MOCK_ACCOUNTS[addresses[i]].balance / 10 ** decimals}`)).not.toBeNull();
    }

    // go to page 2
    await fireEvent.click(getByText('navigate_next'));
    getByText('First');
    getByText('Page 2 of ' + Math.ceil(addresses.length / 25));
    getByText('Last');

    // next top 25 accounts by balance
    for (let i = 25; i < 50; i++) {
      expect(getByText(removeLeadingZeros(addresses[i]))).not.toBeNull();
      expect(getByText(`${MOCK_ACCOUNTS[addresses[i]].balance / 10 ** decimals}`)).not.toBeNull();
    }
  });
});
