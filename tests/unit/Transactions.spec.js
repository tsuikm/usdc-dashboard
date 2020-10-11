import { mount } from "@vue/test-utils";
import Address, { getLogs, TRANSACTION_TOPIC } from '@/components/Transactions';
import { MOCK_WALLET_ADDRESS, MOCK_TRANSACTIONS } from './Transactions.data'
import Vue from 'vue'
import VueMaterial from 'vue-material'

Vue.use(VueMaterial);

jest.mock('web3', () => {
  const { MOCK_TRANSACTIONS } = require('./Transactions.data')
  const { Web3MockBuilder } = require('@/utils/test');
  return Web3MockBuilder(null, MOCK_TRANSACTIONS)
})

describe('_address.vue', () => {
  test('getLogs fetches correct logs 1', async () => {
    const res = await getLogs(MOCK_WALLET_ADDRESS, 4)
    expect(res[0]).toBe(MOCK_TRANSACTIONS[4])
    expect(res[1]).toBe(MOCK_TRANSACTIONS[5])
    expect(res[2]).toBe(MOCK_TRANSACTIONS[2])
  })

  test('getLogs fetches correct logs 2', async () => {
    const res = await getLogs(MOCK_WALLET_ADDRESS, 2)
    expect(res[0]).toBe(MOCK_TRANSACTIONS[0])
    expect(res[1]).toBe(MOCK_TRANSACTIONS[1])
    expect(res[2]).toBe(MOCK_TRANSACTIONS[4])
    expect(res[3]).toBe(MOCK_TRANSACTIONS[5])
    expect(res[4]).toBe(MOCK_TRANSACTIONS[2])
  })

  it("renders wallet transactions correctly", async () => {
    const wrapper = mount(Address, {
      propsData: {
        address: MOCK_WALLET_ADDRESS
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
    expect(row1Entries.at(0).text()).toBe(MOCK_TRANSACTIONS[2].transactionHash)
    expect(parseFloat(row1Entries.at(1).text())).toBe(MOCK_TRANSACTIONS[2].data)
    expect(row1Entries.at(2).text()).toBe(MOCK_TRANSACTIONS[2].topics[1])
    expect(row1Entries.at(3).text()).toBe(MOCK_TRANSACTIONS[2].topics[2])


    const row6Entries = rows.at(6).findAllComponents({ name: 'md-table-cell' })
    expect(row6Entries.at(0).text()).toBe(MOCK_TRANSACTIONS[3].transactionHash)
    expect(parseFloat(row6Entries.at(1).text())).toBe(MOCK_TRANSACTIONS[3].data)
    expect(row6Entries.at(2).text()).toBe(MOCK_TRANSACTIONS[3].topics[1])
    expect(row6Entries.at(3).text()).toBe(MOCK_TRANSACTIONS[3].topics[2])
  });

  it("renders all transactions correctly", async () => {
    const wrapper = mount(Address);

    // 9 promises get called in mounted() lifecycle hook
    for (let i = 0; i < 9; i++) {
      await wrapper.vm.$nextTick();
    }

    const table = wrapper.findComponent({ name: 'md-table' })
    expect(table.exists()).toBeTruthy()

    const rows = wrapper.findAllComponents({ name: 'md-table-row' })
    expect(rows.length).toBe(8)

    const row1Entries = rows.at(1).findAllComponents({ name: 'md-table-cell' })
    expect(row1Entries.at(0).text()).toBe(MOCK_TRANSACTIONS[6].transactionHash)
    expect(parseFloat(row1Entries.at(1).text())).toBe(MOCK_TRANSACTIONS[6].data)
    expect(row1Entries.at(2).text()).toBe(MOCK_TRANSACTIONS[6].topics[1])
    expect(row1Entries.at(3).text()).toBe(MOCK_TRANSACTIONS[6].topics[2])
  });

  it("paginates correctly", async () => {
    // Push more transactions to have over 25 and enable pagination
    for (let i = 0; i < 21; i++) {
      MOCK_TRANSACTIONS.push({
        data: '0x300011',
        transactionHash: `0x${i.toString(16)}`,
        blockNumber: `0x5`,
        topics: [TRANSACTION_TOPIC, `0x24690`, MOCK_WALLET_ADDRESS]
      })
    }

    // MOCK_RECEIVER_TXNS now has 24 transactions (8 copies of the same 3 original items)
    // for a total of 27 transactions with the 3 in MOCK_SENDER_TXNS

    const wrapper = mount(Address, {
      propsData: {
        address: MOCK_WALLET_ADDRESS
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
    expect(row1Entries.at(0).text()).toBe(MOCK_TRANSACTIONS[2].transactionHash)
    expect(parseFloat(row1Entries.at(1).text())).toBe(MOCK_TRANSACTIONS[2].data)
    expect(row1Entries.at(2).text()).toBe(MOCK_TRANSACTIONS[2].topics[1])
    expect(row1Entries.at(3).text()).toBe(MOCK_TRANSACTIONS[2].topics[2])

    // Go to next page
    const paginationButtons = wrapper.findAllComponents({ name: 'md-button' })
    await paginationButtons.at(2).trigger('click')

    await wrapper.vm.$nextTick();

    const nextRows = wrapper.findAllComponents({ name: 'md-table-row' })
    expect(nextRows.length).toBe(3)

    // Last row should be earliest txn with block number 1
    const lastRowEntries = nextRows.at(2).findAllComponents({ name: 'md-table-cell' })
    expect(lastRowEntries.at(0).text()).toBe(MOCK_TRANSACTIONS[3].transactionHash)
    expect(parseFloat(lastRowEntries.at(1).text())).toBe(MOCK_TRANSACTIONS[3].data)
    expect(lastRowEntries.at(2).text()).toBe(MOCK_TRANSACTIONS[3].topics[1])
    expect(lastRowEntries.at(3).text()).toBe(MOCK_TRANSACTIONS[3].topics[2])
  });
});
