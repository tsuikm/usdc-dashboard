import { render, fireEvent } from '@testing-library/vue';
import Transactions from '../../src/components/Transactions.vue';
import Vue from 'vue'
import VueMaterial from 'vue-material'

Vue.use(VueMaterial);

jest.mock('web3', () => class Web3 {
  get eth() {
    return {
      getBlockNumber: async () => {
        return 1000;
      },
      getPastLogs: async (options) => {
        const fromHex = num => parseInt(num, 16);

        const from = fromHex(options.fromBlock);
        const to = fromHex(options.toBlock);

        const result = [];
        for (let i = 0; i < (from - to) / 1000 * 50; i++) {
          result.push({
            data: '0x0',
            transactionHash: `0x000${i}`,
            blockNumber: `0x000${i}0000`,
            topics: ['0x0', `0x00${i}00`, `0x${i}000`]
          });
        }
        return result;
      },
      getBlock: async () => {
        return {
          timestamp: '0000000000'
        }
      }
    }
  }
});

describe('Transactions', () => {

  it('Renders labels correctly', () => {
    const { getByText } = render(Transactions);

    getByText('Transaction Hash');
    getByText('Age');
    getByText('Quantity');
    getByText('Sender');
    getByText('Receiver');
  });

  it('Renders entries correctly', async () => {
    const { findByText } = render(Transactions);

    findByText('0x0003');
    findByText('0');
    findByText('0x00300');
    findByText('0x3000');
  });

  it('Pagination functionality', async () => {
    const { getByText, findByText } = render(Transactions);

    await fireEvent.click(getByText('navigate_next'));

    getByText('First');
    getByText('Page 2 of 300');
    getByText('Last');

    findByText('0x00051');
    findByText('0');
    findByText('0x005100');
    findByText('0x51000');
  });
});
