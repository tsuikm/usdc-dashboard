import { render, fireEvent } from '@testing-library/vue';
import Transactions from '../../src/components/Transactions.vue';
import Vue from 'vue'
import VueMaterial from 'vue-material'

Vue.use(VueMaterial);

jest.mock('web3', () => class Web3 {
  get eth () {
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
            topics: [ '0x0', `0x00${i}00`, `0x${i}000`]
          });
        }
        return result;
      },
      getBlock: async (hash) => {
        return {
          timestamp: '0000000000'
        }
      }
    }
  }
} );

describe('Transactions', () => {

  it('Renders labels correctly', () => {
    const { getByText, getByPlaceholderText } = render(Transactions);

    getByText('Transactions');
    getByText('ID');
    getByText('TXN HASH');
    getByText('Age');
    getByText('Quantity');
    getByText('Sender');
    getByText('Receiver');
  });

  it('Renders entries correctly', () => {

// 3
// 0x0003
// 0
// 0x00300
// 0x3000

  });




});
