import { fireEvent, render } from '@testing-library/vue';
import { finishPromises } from '@/utils/utils';
import transactions from '@/pages/solana/transactions';

const SLOT = 987654321;
const SIGNATURE = 'aBcDeFgHiJkLmNoPqRsTuVwXyZ';
const BLOCK_TIME = 1234567890;
const FEE = 10000;

global.fetch = async (_, { body }) => {
  return {
    json: async () => {
      if (body.includes('getBlockTime')) {
        return {
          result: BLOCK_TIME,
        };
      } else if (body.includes('getConfirmedTransaction')) {
        return {
          result: {
            meta: {
              fee: FEE,
            },
          },
        };
      } else if (body.includes('getConfirmedSignaturesForAddress2')) {
        return {
          result: [
            { signature: SIGNATURE, slot: SLOT },
          ],
        };
      }
    },
    ok: true,
  };
};

describe('Solana transactions', () => {
  it('renders transaction correctly', async () => {
    const { getByTestId, getByText } = render(transactions);

    await finishPromises();

    expect(getByTestId('md-table')).not.toBeNull();

    expect(getByText(SIGNATURE)).not.toBeNull();
    expect(getByText(SLOT.toString())).not.toBeNull();
    expect(getByText((FEE / (10 ** 9)).toString())).not.toBeNull();
  });
});
