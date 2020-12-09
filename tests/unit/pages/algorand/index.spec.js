import AlgoSummaryPage from '@/pages/algorand/index';
import AlgorandFetchFactory from '@/../tests/algorand-fetch-mock';
import { render } from '@testing-library/vue';
import { toHex, finishPromises } from '@/utils/utils';

AlgorandFetchFactory.MOCK_ACCOUNTS = {
  ['0x1']: {
    creator: true,
  },
  ['0x2']: {
    freeze: true,
  },
  ['0x3']: {
    clawback: true,
  },
  ['0x4']: {
    reserve: true,
  },
  ['0x5']: {
    manager: true,
  },
};

AlgorandFetchFactory.MOCK_TRANSACTIONS = [
  {
    id: '0x0999',
    ['confirmed-round']: 2,
  },
  {
    id: '0x01111',
    ['confirmed-round']: 3,
  },
  {
    id: '0x12345',
    ['confirmed-round']: 6,
  },
  {
    id: '0x13579',
    ['confirmed-round']: 1,
  },
];

AlgorandFetchFactory.CURRENT_ROUND = 10;

global.fetch = AlgorandFetchFactory.fetch;

describe('Algorand Summary Page', () => {

  it('Renders recent transactions', async () => {
    const { getByText } = render(AlgoSummaryPage);

    await finishPromises();

    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[0].id)).not.toBeNull();
    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[1].id)).not.toBeNull();
    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[2].id)).not.toBeNull();
    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[3].id)).not.toBeNull();
  });

  it('Renders latest blocks', async () => {
    const { getByText } = render(AlgoSummaryPage);

    await finishPromises();

    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[0]['confirmed-round'].toString() + ' / ' + toHex(AlgorandFetchFactory.MOCK_TRANSACTIONS[0]['confirmed-round']))).not.toBeNull();
    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[1]['confirmed-round'].toString() + ' / ' + toHex(AlgorandFetchFactory.MOCK_TRANSACTIONS[1]['confirmed-round']))).not.toBeNull();
    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[2]['confirmed-round'].toString() + ' / ' + toHex(AlgorandFetchFactory.MOCK_TRANSACTIONS[2]['confirmed-round']))).not.toBeNull();
    expect(getByText(AlgorandFetchFactory.MOCK_TRANSACTIONS[3]['confirmed-round'].toString() + ' / ' + toHex(AlgorandFetchFactory.MOCK_TRANSACTIONS[3]['confirmed-round']))).not.toBeNull();
  });

  it('Renders privileged roles', async () => {
    const { getByText } = render(AlgoSummaryPage);

    // Finish all promises
    await finishPromises();

    expect(getByText('Creator')).not.toBeNull();
    expect(getByText('Freeze')).not.toBeNull();
    expect(getByText('Clawback')).not.toBeNull();
    expect(getByText('Reserve')).not.toBeNull();
    expect(getByText('Manager')).not.toBeNull();

    // Finish all promises
    await finishPromises();

    for (const role of Object.keys(AlgorandFetchFactory.MOCK_ACCOUNTS)) {
      expect(getByText(role)).not.toBeNull();
    }
  });
});
