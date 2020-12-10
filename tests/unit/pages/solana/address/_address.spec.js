import address from '@/pages/solana/address/_address';
import { render } from '@testing-library/vue';
import { finishPromises } from '@/utils/utils';

const MOCK_WALLET_ADDRESS = 'FAwRZwJgi7h81ZphYhLauZKvBHvkr3Dbhh6R8DsaD4Xv';
const BALANCE = 468237456520;
const SIGNATURE = '5LFrHZdyA3ar8nd73NNXRgjoKJz4n3UHuPgPjriMA16QiPrDAF4JK7oSBE7rAR66P8LtNfsXgzfSkzkKi8HHzYCE';
const FEE = 0.000005;
const SLOT = 54448824;
const BLOCK_TIME = 53;

global.fetch = async (_, { body }) => {
  return {
    json: async () => {
      if (body.includes('getBalance')) {
        return {
          result: {
            value: BALANCE,
          },
        };
      } else if (body.includes('getConfirmedSignaturesForAddress2')) {
        return {
          result: [
            { signature: SIGNATURE, slot: SLOT },
          ],
        };
      } else if (body.includes('getBlockTime')) {
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
      }
    },
    ok: true,
  };
};

describe('Solana address details page', () => {
  it('renders transaction correctly', async () => {
    const { getByTestId, getByText } = render(address, {
      mocks: {
        $route: {
          path: `/solana/address/${MOCK_WALLET_ADDRESS}`,
          params: {
            address: MOCK_WALLET_ADDRESS,
          },
          query: {
            page: 1, // Load with ?page=1
          },
        },
        $router: {
          replace: () => {},
        },
        $refs: {
          table: {
            pageLength: 1,
          },
        },
      },
    });

    await finishPromises();

    expect(getByText('Address Details')).not.toBeNull();
    expect(getByText('Wallet Address')).not.toBeNull();
    expect(getByText('Balance')).not.toBeNull();
    expect(getByText('$' + String(BALANCE))).not.toBeNull();
    expect(getByText(MOCK_WALLET_ADDRESS)).not.toBeNull();
    expect(getByText('Solana USDC Address Transactions')).not.toBeNull();
    expect(getByTestId('md-table')).not.toBeNull();
    expect(getByText(SIGNATURE)).not.toBeNull();
    expect(getByText(SLOT.toString())).not.toBeNull();
    expect(getByText((FEE / (10 ** 9)).toString())).not.toBeNull();
  });
});
