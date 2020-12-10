import { render } from '@testing-library/vue';
import accounts from '@/pages/solana/accounts';

const MOCK_ACCOUNTS = [
  {
    address: 'gHiJkL',
    uiAmount: 20000,
  },
  {
    address: 'aBcDeF',
    uiAmount: 10000,
  },
];

const SUPPLY = 1000000000000;

global.fetch = async (_, { body }) => {
  return {
    json: async () => {
      if (body.includes('getAccountInfo')) {
        return {
          result: {
            value: {
              data: {
                parsed: {
                  info: {
                    supply: SUPPLY,
                  },
                },
              },
            },
          },
        };
      } else if (body.includes('getTokenLargestAccounts')) {
        return {
          result: {
            value: MOCK_ACCOUNTS,
          },
        };
      }
    },
    ok: true,
  };
};

describe('Solana Accounts', () => {
  it('accounts displays a table titled Accounts with columns for Address, Balance and Percentage', () => {
    const { getByText, getAllByText } = render(accounts);
    expect(getAllByText('Accounts')).toHaveLength(2);
    expect(getByText('Address')).not.toBeNull();
    expect(getByText('Balance')).not.toBeNull();
    expect(getByText('Percentage')).not.toBeNull();
  });

  it('Orders accounts by balance', async () => {
    const { getByText } = render(accounts);

    // Finish all promises
    await new Promise((resolve) => setTimeout(resolve, 0));

    // top 25 accounts by balance
    for (const account of MOCK_ACCOUNTS) {
      expect(getByText(account.address)).not.toBeNull();
      expect(getByText((account.uiAmount).toString())).not.toBeNull();
      expect(getByText((account.uiAmount / (SUPPLY / 10 ** 6) * 100).toFixed(2) + '%')).not.toBeNull();
    }
  });
});
