const API_KEY = 'b8bedc0e21794975befedd1ed3ac29a6'
const BASE_URL = `https://ropsten.infura.io/v3/${API_KEY}`

export const getTransactionsForAddress = async (address, fromBlock, toBlock) => {
  let receiverTransactions = [];
  let senderTransactions = [];

  const receiverRes = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Accept': '*/*'
    },
    body: JSON.stringify({
      "jsonrpc": "2.0",
      "id": 0,
      "method": "eth_getLogs",
      "params": [
        {
          "fromBlock": fromBlock,
          "toBlock": toBlock,
          "address": "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            null,
            address,
          ]
        }
      ]
    })
  })

  const senderRes = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Accept': '*/*'
    },
    body: JSON.stringify({
      "jsonrpc": "2.0",
      "id": 0,
      "method": "eth_getLogs",
      "params": [
        {
          "fromBlock": fromBlock,
          "toBlock": toBlock,
          "address": "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            address,
            null,
          ]
        }
      ]
    })
  })

  if (senderRes.status === 200 && receiverRes.status === 200) {
    receiverTransactions = (await receiverRes.json()).result;
    senderTransactions = (await senderRes.json()).result;

    // TODO: For now, remove any internal (self to self) transactions
    receiverTransactions = receiverTransactions.filter(t => t.topics[1] !== t.topics[2])
    senderTransactions = senderTransactions.filter(t => t.topics[1] !== t.topics[2])

    return { receiverTransactions, senderTransactions }
  } else {
    console.error('Failed to fetch transactions for address', address);
  }
}
