import TransactionDetails from '@/components/TransactionDetails';
import { fireEvent, render } from '@testing-library/vue';
import { finishPromises } from '@/utils/utils';
import { BLOCKCHAIN_PATHS } from '@/utils/constants';

const TRANSACTION_HASH = '0x123456';
const TRANSACTION_HASH_LABEL = 'Transaction Hash';

const SENDER_ADDRESS = '0xaaaaa';
const RECEIVER_ADDRESS = '0xbbbbb';

const BLOCK_NUMBER = '0x0';
const BLOCK_NUMBER_LABEL = 'Block Number';

const GAS = 0;
const GAS_LABEL = 'Gas';

describe('Transaction Details', () => {
  it('Renders transaction details correctly for correct hash', async () => {
    const { getByText } = render(TransactionDetails, {
      props: {
        hash: {
          label: TRANSACTION_HASH_LABEL,
          value: TRANSACTION_HASH,
        },
        sender: SENDER_ADDRESS,
        receiver: RECEIVER_ADDRESS,
        blockNumber: {
          label: BLOCK_NUMBER_LABEL,
          value: BLOCK_NUMBER,
        },
        gas: {
          label: GAS_LABEL,
          value: GAS,
        },
      },
    });

    expect(getByText(`${TRANSACTION_HASH_LABEL}`)).not.toBeNull();
    expect(getByText('Sender')).not.toBeNull();
    expect(getByText('Receiver')).not.toBeNull();
    expect(getByText(`${BLOCK_NUMBER_LABEL}`)).not.toBeNull();
    expect(getByText(`${GAS_LABEL}`)).not.toBeNull();

    // Finish all promises
    await finishPromises();
    expect(getByText(TRANSACTION_HASH)).not.toBeNull();
    expect(getByText(SENDER_ADDRESS)).not.toBeNull();
    expect(getByText(RECEIVER_ADDRESS)).not.toBeNull();
    expect(getByText(BLOCK_NUMBER)).not.toBeNull();
    expect(getByText(GAS.toString())).not.toBeNull();
  });

  it('Links to sender and receiver with blockchain awareness', async () => {
    const router = [];
    const route = { path: `/transaction/${TRANSACTION_HASH}`};

    const { getByText } = render(TransactionDetails, {
      props: {
        hash: {
          label: TRANSACTION_HASH_LABEL,
          value: TRANSACTION_HASH,
        },
        sender: SENDER_ADDRESS,
        receiver: RECEIVER_ADDRESS,
        blockNumber: {
          label: BLOCK_NUMBER_LABEL,
          value: BLOCK_NUMBER,
        },
        gas: {
          label: GAS_LABEL,
          value: GAS,
        },
      },
      mocks: {
        $router: router,
        $route: route,
      },
    });

    // Finish all promises
    await finishPromises();

    const senderLink = getByText(SENDER_ADDRESS);
    const receiverLink = getByText(RECEIVER_ADDRESS);

    for (const path of BLOCKCHAIN_PATHS) {
      route.path = path;
      await finishPromises();

      await fireEvent.click(senderLink);
      expect(router[router.length - 1].path).toEqual(`${path}/address/${SENDER_ADDRESS}`);
      await fireEvent.click(receiverLink);
      expect(router[router.length - 1].path).toEqual(`${path}/address/${RECEIVER_ADDRESS}`);
    }
    
    expect(router.length).toBe(6);
  });
});
