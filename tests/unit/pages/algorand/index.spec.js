import AlgoSummaryPage from '@/pages/algorand/index';
import { render } from '@testing-library/vue';
import { toHex } from '@/utils/utils';

const MOCK_ACCOUNTS = {
  '0x1': {
    creator: true,
  },
  '0x2': {
    freeze: true,
  },
  '0x3': {
    clawback: true,
  },
  '0x4': {
    reserve: true,
  },
  '0x5': {
    manager: true,
  },

};
const MOCK_TRANSACTIONS = [
  {
    id: '0x0999',
    confirmedRound: 2,
  },
  {
    id: '0x01111',
    confirmedRound: 3,
  },
  {
    id: '0x12345',
    confirmedRound: 6,
  },
  {
    id: '0x13579',
    confirmedRound: 1,
  },
];

Algo.MOCK_TRANSACTIONS = MOCK_TRANSACTIONS;
Algo.MOCK_ACCOUNTS = MOCK_ACCOUNTS;

global.fetch = async () => {
  return {
    json: async () => MOCK_MINTERS,
  };
};

describe('Algorand Summary Page', () => {

  it('Renders recent transactions', async () => {
    const { getByText } = render(AlgoSummaryPage);

    // Finish all promises
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getByText(MOCK_TRANSACTIONS[0].transactionId)).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[1].transactionId)).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[2].transactionId)).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[3].transactionId)).not.toBeNull();
  });

  it('Renders latest blocks', async () => {
    const { getByText } = render(AlgoSummaryPage);

    // Finish all promises
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getByText(MOCK_TRANSACTIONS[0].confirmedRound.toString() + ' / ' + toHex(MOCK_TRANSACTIONS[0].confirmedRound))).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[1].confirmedRound.toString() + ' / ' + toHex(MOCK_TRANSACTIONS[1].confirmedRound))).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[2].confirmedRound.toString() + ' / ' + toHex(MOCK_TRANSACTIONS[2].confirmedRound))).not.toBeNull();
    expect(getByText(MOCK_TRANSACTIONS[3].confirmedRound.toString() + ' / ' + toHex(MOCK_TRANSACTIONS[3].confirmedRound))).not.toBeNull();
  });

  it('Renders privileged roles', async () => {
    const { getByText } = render(AlgoSummaryPage);

    // Finish all promises
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getByText('Creator')).not.toBeNull();
    expect(getByText('Freeze')).not.toBeNull();
    expect(getByText('Clawback')).not.toBeNull();
    expect(getByText('Reserve')).not.toBeNull();
    expect(getByText('Manager')).not.toBeNull();

    // Finish all promises
    await new Promise((resolve) => setTimeout(resolve, 0));

    for (const role of Object.keys(Algo.MOCK_ACCOUNTS)) {
      expect(getByText(role)).not.toBeNull();
    }

    for (const minter of MOCK_MINTERS) {
      expect(getByText(minter)).not.toBeNull();
    }
  });
});
