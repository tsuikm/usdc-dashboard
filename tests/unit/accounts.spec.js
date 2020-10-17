import { fireEvent, render } from '@testing-library/vue';
import { padHex, removeLeadingZeros, toHex } from '@/utils/utils';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import { WEB3_BALANCEOF_ADDRESS_LENGTH } from '@/utils/constants';
import Web3 from 'web3';
import accounts from '@/pages/accounts';

Vue.use(VueMaterial);

const MOCK_TRANSACTIONS = [];
for (let i = 0; i < 101; i++) {
  const randomQuantity = Math.random() * 109502;
  MOCK_TRANSACTIONS.push({
    data: toHex(randomQuantity),
    sender: padHex(toHex(i), WEB3_BALANCEOF_ADDRESS_LENGTH),
    blockNumber: 1,
  });
}

const MOCK_ACCOUNTS = {};
for (let transaction of MOCK_TRANSACTIONS) {
  let address = transaction.sender;
  if (!(address in MOCK_ACCOUNTS)) {
    MOCK_ACCOUNTS[address] = {
      balance: transaction.data,
    };
  } else {
    MOCK_ACCOUNTS[address].balance += transaction.data;
  }
}

Web3.MOCK_TRANSACTIONS = MOCK_TRANSACTIONS;
Web3.MOCK_ACCOUNTS = MOCK_ACCOUNTS;

describe('accounts', () => {
  it('accounts displays a table titled Accounts with columns for Address, Balance and Percentage', () => {
    const { getByText } = render(accounts);
    expect(getByText('Accounts')).not.toBeNull();
    expect(getByText('Address')).not.toBeNull();
    expect(getByText('Balance')).not.toBeNull();
    expect(getByText('Percentage')).not.toBeNull();
  });

  it('orders accounts by balance', async () => {
    const { getByText } = render(accounts);

    let addresses = [...Object.keys(MOCK_ACCOUNTS)].sort((a, b) => b[1] - a[1]);

    // top 25 accounts by balance
    for (let i = 0; i < 25; i++) {
      expect(getByText(removeLeadingZeros(addresses[i]))).not.toBeNull();
      expect(getByText(MOCK_ACCOUNTS[addresses[i]].balance)).not.toBeNull();
    }

    // go to page 2
    await fireEvent.click(getByText('navigate_next'));
    getByText('First');
    getByText('Page 2 of ' + Math.ceil(addresses.length / 25));
    getByText('Last');

    // next top 25 accounts by balance
    for (let i = 25; i < 50; i++) {
      expect(getByText(removeLeadingZeros(addresses[i]))).not.toBeNull();
      expect(getByText(MOCK_ACCOUNTS[addresses[i]].balance)).not.toBeNull();
    }
  });
});
