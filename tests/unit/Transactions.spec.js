import Address, { getLogs } from '@/components/Transactions';
import { fireEvent, render } from '@testing-library/vue';
import { padHex, removeLeadingZeros } from '@/utils/utils';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import Web3 from 'web3';

Vue.use(VueMaterial);

const MOCK_WALLET_ADDRESS = padHex('0x123456789abcdef', 64);
const MOCK_TRANSACTIONS = [
  {
    data: '0x010121',
    transactionHash: '0x0999',
    blockNumber: 2,
    sender: MOCK_WALLET_ADDRESS,
    receiver: padHex('0x232323', 64),
  },
  {
    data: '0x0109',
    transactionHash: '0x01111',
    blockNumber: 3,
    sender: MOCK_WALLET_ADDRESS,
    receiver: padHex('0x288765', 64),
  },
  {
    data: '0x087698',
    transactionHash: '0x12345',
    blockNumber: 6,
    sender: MOCK_WALLET_ADDRESS,
    receiver: padHex('0x2919191', 64),
  },
  {
    data: '0x100000',
    transactionHash: '0x13579',
    blockNumber: 1,
    sender: padHex('0x2468a', 64),
    receiver: MOCK_WALLET_ADDRESS,
  },
  {
    data: '0x200001',
    transactionHash: '0x1357a',
    blockNumber: 4,
    sender: padHex('0x2468a', 64),
    receiver: MOCK_WALLET_ADDRESS,
  },
  {
    data: '0x300011',
    transactionHash: '0x1357b',
    blockNumber: 5,
    sender: padHex('0x24690', 64),
    receiver: MOCK_WALLET_ADDRESS,
  },
  {
    data: '0x300011',
    transactionHash: '0xd0a69b',
    blockNumber: 7,
    sender: padHex('0x843935', 64),
    receiver: padHex('0x843934', 64),
  },
];

Web3.MOCK_TRANSACTIONS = MOCK_TRANSACTIONS;

describe('_address.vue', () => {
  test('getLogs fetches correct logs 1', async () => {
    const res = await getLogs(MOCK_WALLET_ADDRESS, 4);
    expect(res[0].transactionHash).toBe(MOCK_TRANSACTIONS[4].transactionHash);
    expect(res[1].transactionHash).toBe(MOCK_TRANSACTIONS[5].transactionHash);
    expect(res[2].transactionHash).toBe(MOCK_TRANSACTIONS[2].transactionHash);
  });

  test('getLogs fetches correct logs 2', async () => {
    const res = await getLogs(MOCK_WALLET_ADDRESS, 2);
    expect(res[0].transactionHash).toBe(MOCK_TRANSACTIONS[0].transactionHash);
    expect(res[1].transactionHash).toBe(MOCK_TRANSACTIONS[1].transactionHash);
    expect(res[2].transactionHash).toBe(MOCK_TRANSACTIONS[4].transactionHash);
    expect(res[3].transactionHash).toBe(MOCK_TRANSACTIONS[5].transactionHash);
    expect(res[4].transactionHash).toBe(MOCK_TRANSACTIONS[2].transactionHash);
  });

  it('renders wallet transactions correctly', async () => {
    const { getByTestId, getByText } = render(Address, {
      propsData: {
        address: MOCK_WALLET_ADDRESS,
      },
    });

    await Vue.nextTick();
    await Vue.nextTick();
    await Vue.nextTick();
    await Vue.nextTick();

    expect(getByTestId('md-table')).not.toBeNull();

    console.log(MOCK_TRANSACTIONS[2].transactionHash);
    console.log((parseInt(MOCK_TRANSACTIONS[2].data) / 10 ** 6).toString());

    expect(getByText(MOCK_TRANSACTIONS[2].transactionHash)).not.toBeNull();
    expect(getByText(parseInt(MOCK_TRANSACTIONS[2].data) / 10 ** 6)).not.toBeNull();
    expect(getByText(removeLeadingZeros(MOCK_TRANSACTIONS[2].sender))).not.toBeNull();
    expect(getByText(removeLeadingZeros(MOCK_TRANSACTIONS[2].receiver))).not.toBeNull();

    expect(getByText(MOCK_TRANSACTIONS[3].transactionHash)).not.toBeNull();
    expect(getByText(parseInt(MOCK_TRANSACTIONS[3].data) / 10 ** 6)).not.toBeNull();
    expect(getByText(removeLeadingZeros(MOCK_TRANSACTIONS[3].sender))).not.toBeNull();
    expect(getByText(removeLeadingZeros(MOCK_TRANSACTIONS[3].receiver))).not.toBeNull();
  });

  it('renders all transactions correctly', async () => {
    const { getByTestId, getByText } = render(Address);

    // 9 promises get called in mounted() lifecycle hook
    for (let i = 0; i < 9; i++) {
      await Vue.nextTick();
    }

    expect(getByTestId('md-table')).not.toBeNull();

    expect(getByText(MOCK_TRANSACTIONS[6].transactionHash)).not.toBeNull();
    expect(getByText(parseInt(MOCK_TRANSACTIONS[6].data) / 10 ** 6)).not.toBeNull();
    expect(getByText(removeLeadingZeros(MOCK_TRANSACTIONS[6].sender))).not.toBeNull();
    expect(getByText(removeLeadingZeros(MOCK_TRANSACTIONS[6].receiver))).not.toBeNull();
  });

  it('paginates correctly', async () => {
    // Push more transactions to have over 25 and enable pagination
    for (let i = 0; i < 21; i++) {
      Web3.MOCK_TRANSACTIONS.push({
        data: '0x300011',
        transactionHash: `0x${i.toString(16)}`,
        blockNumber: 5,
        sender: padHex('0x24690', 64),
        receiver: MOCK_WALLET_ADDRESS,
      });
    }

    // MOCK_RECEIVER_TXNS now has 24 transactions (8 copies of the same 3 original items)
    // for a total of 27 transactions with the 3 in MOCK_SENDER_TXNS

    const { getByTestId, getByText } = render(Address, {
      propsData: {
        address: MOCK_WALLET_ADDRESS,
      },
    });

    // This works we don't know why
    await Vue.nextTick();
    await Vue.nextTick();
    await Vue.nextTick();
    await Vue.nextTick();

    expect(getByTestId('md-table')).not.toBeNull();

    expect(getByText(MOCK_TRANSACTIONS[2].transactionHash)).not.toBeNull();
    expect(getByText(parseInt(MOCK_TRANSACTIONS[2].data) / 10 ** 6)).not.toBeNull();
    expect(getByText(removeLeadingZeros(MOCK_TRANSACTIONS[2].sender))).not.toBeNull();
    expect(getByText(removeLeadingZeros(MOCK_TRANSACTIONS[2].receiver))).not.toBeNull();

    // Go to next page
    await fireEvent.click(getByText('navigate_next'));

    await Vue.nextTick();

    expect(getByText(MOCK_TRANSACTIONS[3].transactionHash)).not.toBeNull();
    expect(getByText(parseInt(MOCK_TRANSACTIONS[3].data) / 10 ** 6)).not.toBeNull();
    expect(getByText(removeLeadingZeros(MOCK_TRANSACTIONS[3].sender))).not.toBeNull();
    expect(getByText(removeLeadingZeros(MOCK_TRANSACTIONS[3].receiver))).not.toBeNull();
  });
});
