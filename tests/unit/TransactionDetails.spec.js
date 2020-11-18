import TransactionDetails from '@/components/TransactionDetails';
import { render } from '@testing-library/vue';
import Web3 from 'web3';

Web3.MOCK_TRANSACTIONS = [{
  transactionHash: '0x123456',
  from: '0xaaaaa',
  to: '0xbbbbb',
  blockNumber: 0,
  gas: 10,
}];

describe('Transaction Details', () => {
  it('Renders transaction details correctly for correct hash', async () => {
    const { getByText } = render(TransactionDetails, {
      props: {
        hash: Web3.MOCK_TRANSACTIONS[0].transactionHash,
      },
    });

    expect(getByText('Hash:')).not.toBeNull();
    expect(getByText('Sender:')).not.toBeNull();
    expect(getByText('Receiver:')).not.toBeNull();
    expect(getByText('Block:')).not.toBeNull();
    expect(getByText('Gas:')).not.toBeNull();

    // Finish all promises
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(getByText(Web3.MOCK_TRANSACTIONS[0].transactionHash)).not.toBeNull();
    expect(getByText(Web3.MOCK_TRANSACTIONS[0].from)).not.toBeNull();
    expect(getByText(Web3.MOCK_TRANSACTIONS[0].to)).not.toBeNull();
    expect(getByText(`${Web3.MOCK_TRANSACTIONS[0].blockNumber}`)).not.toBeNull();
    expect(getByText(`${Web3.MOCK_TRANSACTIONS[0].gas}`)).not.toBeNull();
  });

  it('Redirects to 404 with incorrect hash', async () => {
    const router = [];
    render(TransactionDetails, {
      props: {
        hash: 'invalid',
      },
      mocks: {
        $router: router,
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(router[0].path).toEqual('/404');
  });
});
