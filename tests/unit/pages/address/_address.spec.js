// import { render, fireEvent } from '@testing-library/vue';
import { getLogs, TRANSACTION_TOPIC } from '@/pages/address/_address.vue';
import Vue from 'vue'
import VueMaterial from 'vue-material'

Vue.use(VueMaterial);

// Mock data for mock web3 implementation
const MOCK_WALLET_ADDRESS = '0x123456789abcdef'
const MOCK_SENDER_TXNS = [
  {
    data: '0x010121',
    transactionHash: `0x0999`,
    blockNumber: `0x2`,
    topics: [TRANSACTION_TOPIC, MOCK_WALLET_ADDRESS, `0x232323`]
  },
  {
    data: '0x0109',
    transactionHash: `0x01111`,
    blockNumber: `0x3`,
    topics: [TRANSACTION_TOPIC, MOCK_WALLET_ADDRESS, `0x288765`]
  },
  {
    data: '0x087698',
    transactionHash: `0x12345`,
    blockNumber: `0x6`,
    topics: [TRANSACTION_TOPIC, MOCK_WALLET_ADDRESS, `0x2919191`]
  }
]

const MOCK_RECEIVER_TXNS = [
  {
    data: '0x100000',
    transactionHash: `0x13579`,
    blockNumber: `0x1`,
    topics: [TRANSACTION_TOPIC, `0x2468a`, MOCK_WALLET_ADDRESS]
  },
  {
    data: '0x200001',
    transactionHash: `0x1357a`,
    blockNumber: `0x4`,
    topics: [TRANSACTION_TOPIC, `0x2468a`, MOCK_WALLET_ADDRESS]
  },
  {
    data: '0x300011',
    transactionHash: `0x1357b`,
    blockNumber: `0x5`,
    topics: [TRANSACTION_TOPIC, `0x24690`, MOCK_WALLET_ADDRESS]
  }
]

jest.mock('web3', () => class Web3 {
  get eth() {
    return {
      getBlockNumber: async function () {
        return "0x7";
      },
      getPastLogs: async function ({ fromBlock, toBlock, address, topics }) {
        if (toBlock === 'latest') toBlock = await this.getBlockNumber()

        if (topics[1]) {
          // Return mock sender txns
          return MOCK_SENDER_TXNS.filter(t => {
            return parseInt(t.blockNumber) <= parseInt(toBlock) && parseInt(t.blockNumber) >= parseInt(fromBlock)
          })
        } else if (topics[2]) {
          // Return mock receiver txns
          return MOCK_RECEIVER_TXNS.filter(t => {
            return parseInt(t.blockNumber) <= parseInt(toBlock) && parseInt(t.blockNumber) >= parseInt(fromBlock)
          })
        }
      },
    }
  }
});

describe('_address.vue', () => {
  it('getLogs fetches correct logs', async () => {
    const res = await getLogs(MOCK_WALLET_ADDRESS, 4)
    expect(res[0]).toBe(MOCK_RECEIVER_TXNS[1])
    expect(res[1]).toBe(MOCK_RECEIVER_TXNS[2])
    expect(res[2]).toBe(MOCK_SENDER_TXNS[2])
  })
});