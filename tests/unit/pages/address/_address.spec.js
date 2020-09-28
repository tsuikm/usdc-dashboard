import { mount } from "@vue/test-utils";
import Address, { getLogs, TRANSACTION_TOPIC } from '@/pages/address/_address.vue';
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
  test('getLogs fetches correct logs 1', async () => {
    const res = await getLogs(MOCK_WALLET_ADDRESS, 4)
    expect(res[0]).toBe(MOCK_RECEIVER_TXNS[1])
    expect(res[1]).toBe(MOCK_RECEIVER_TXNS[2])
    expect(res[2]).toBe(MOCK_SENDER_TXNS[2])
  })

  test('getLogs fetches correct logs 2', async () => {
    const res = await getLogs(MOCK_WALLET_ADDRESS, 2)
    expect(res[0]).toBe(MOCK_SENDER_TXNS[0])
    expect(res[1]).toBe(MOCK_SENDER_TXNS[1])
    expect(res[2]).toBe(MOCK_RECEIVER_TXNS[1])
    expect(res[3]).toBe(MOCK_RECEIVER_TXNS[2])
    expect(res[4]).toBe(MOCK_SENDER_TXNS[2])
  })

  it("renders correctly", async () => {
    const wrapper = mount(Address, {
      mocks: {
        $route: {
          path: '/address/' + MOCK_WALLET_ADDRESS,
          params: {
            address: MOCK_WALLET_ADDRESS
          }
        }
      }
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const table = wrapper.findComponent({ name: 'md-table' })
    expect(table.exists()).toBeTruthy()

    const rows = wrapper.findAllComponents({ name: 'md-table-row' })
    expect(rows.length).toBe(7)

    const row1Entries = rows.at(1).findAllComponents({ name: 'md-table-cell' })
    expect(row1Entries.at(0).text()).toBe(MOCK_SENDER_TXNS[2].transactionHash)
    expect(row1Entries.at(1).text()).toBe(MOCK_SENDER_TXNS[2].topics[1])
    expect(row1Entries.at(2).text()).toBe(MOCK_SENDER_TXNS[2].topics[2])
    expect(row1Entries.at(3).text()).toBe((parseInt(MOCK_SENDER_TXNS[2].data, 16) / 10 ** 6).toString())

    const row6Entries = rows.at(6).findAllComponents({ name: 'md-table-cell' })
    expect(row6Entries.at(0).text()).toBe(MOCK_RECEIVER_TXNS[0].transactionHash)
    expect(row6Entries.at(1).text()).toBe(MOCK_RECEIVER_TXNS[0].topics[1])
    expect(row6Entries.at(2).text()).toBe(MOCK_RECEIVER_TXNS[0].topics[2])
    expect(row6Entries.at(3).text()).toBe((parseInt(MOCK_RECEIVER_TXNS[0].data, 16) / 10 ** 6).toString())
  });

  it("paginates correctly", async () => {
    // Push more transactions to have over 25 and enable pagination
    for (let i = 0; i < 21; i++) {
      MOCK_RECEIVER_TXNS.push({
        data: '0x300011',
        transactionHash: `0x${i.toString(16)}`,
        blockNumber: `0x5`,
        topics: [TRANSACTION_TOPIC, `0x24690`, MOCK_WALLET_ADDRESS]
      })
    }

    // MOCK_RECEIVER_TXNS now has 24 transactions (8 copies of the same 3 original items)
    // for a total of 27 transactions with the 3 in MOCK_SENDER_TXNS

    const wrapper = mount(Address, {
      mocks: {
        $route: {
          path: '/address/' + MOCK_WALLET_ADDRESS,
          params: {
            address: MOCK_WALLET_ADDRESS
          }
        }
      }
    });

    // This works we don't know why
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const table = wrapper.findComponent({ name: 'md-table' })
    expect(table.exists()).toBeTruthy()

    const rows = wrapper.findAllComponents({ name: 'md-table-row' })
    expect(rows.length).toBe(26)

    // First row should be latest txn with block number 6
    const row1Entries = rows.at(1).findAllComponents({ name: 'md-table-cell' })
    expect(row1Entries.at(0).text()).toBe(MOCK_SENDER_TXNS[2].transactionHash)
    expect(row1Entries.at(1).text()).toBe(MOCK_SENDER_TXNS[2].topics[1])
    expect(row1Entries.at(2).text()).toBe(MOCK_SENDER_TXNS[2].topics[2])
    expect(row1Entries.at(3).text()).toBe((parseInt(MOCK_SENDER_TXNS[2].data, 16) / 10 ** 6).toString())

    // Go to next page
    const paginationButtons = wrapper.findAllComponents({ name: 'md-button' })
    await paginationButtons.at(2).trigger('click')

    await wrapper.vm.$nextTick();

    const nextRows = wrapper.findAllComponents({ name: 'md-table-row' })
    expect(nextRows.length).toBe(3)

    // Last row should be earliest txn with block number 1
    const lastRowEntries = nextRows.at(2).findAllComponents({ name: 'md-table-cell' })
    expect(lastRowEntries.at(0).text()).toBe(MOCK_RECEIVER_TXNS[0].transactionHash)
    expect(lastRowEntries.at(1).text()).toBe(MOCK_RECEIVER_TXNS[0].topics[1])
    expect(lastRowEntries.at(2).text()).toBe(MOCK_RECEIVER_TXNS[0].topics[2])
    expect(lastRowEntries.at(3).text()).toBe((parseInt(MOCK_RECEIVER_TXNS[0].data, 16) / 10 ** 6).toString())
  });
});