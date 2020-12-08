import { USDC_SOLANA_CONTRACT_ADDRESS } from '@/utils/constants';

export const SOLANA_TRANSACTION_SCHEMA = [
  {
    name: 'Transaction Signature',
    getter(t) {
      return t.signature;
    },
    link(t) {
      return `transaction/${t.signature}`;
    },
  },
  {
    name: 'Fee',
    getter(t) {
      return t.fee;
    },
  },
  {
    name: 'Slot',
    getter(t) {
      return t.slot;
    },
  },
  {
    name: 'Age',
    getter(t) {
      return t.age;
    },
  },
];

// Getting token information
export const getTokenInformation = async () => {
  const response = await fetch('https://api.mainnet-beta.solana.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'getAccountInfo',
      params:[USDC_SOLANA_CONTRACT_ADDRESS, {
        encoding: 'jsonParsed',
        commitment: 'single',
      }],
    }),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error('Unable to fetch Solana token information');
  }
};


// Getting recent transactions on the token
export const getRecentTransactions = async (limit = 25) => {
  const response = await fetch('https://api.mainnet-beta.solana.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'getConfirmedSignaturesForAddress2',
      params: [USDC_SOLANA_CONTRACT_ADDRESS, { limit }],
    }),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error('Unable to fetch Solana recent transactions');
  }
};

export const getBlockTime = async (slot) => {
  const response = await fetch('https://api.mainnet-beta.solana.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'getBlockTime',
      params: [slot],
    }),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error('Unable to fetch Solana block time');
  }
};

export const getTransactionInfo = async (txn) => {
  const response = await fetch('https://api.mainnet-beta.solana.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'getConfirmedTransaction',
      params: [txn.signature, 'jsonParsed'],
    }),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error('Unable to fetch Solana transaction details');
  }
};

// Getting top accounts by balance on the token
export const getTopAccounts = async () => {
  const response = await fetch('https://api.mainnet-beta.solana.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'getTokenLargestAccounts',
      params: [USDC_SOLANA_CONTRACT_ADDRESS, {
        commitment: 'single',
      }],
    }),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error('Unable to fetch Solana largest accounts');
  }
};

export const getBalance = async (account) => {
  const response = await fetch('https://api.mainnet-beta.solana.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }, 
    body: JSON.stringify({
      jsonrpc: '2.0', 
      id: 1,
      method: 'getBalance', 
      params: [account],
    }),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error('Unable to fetch balance of this address');
  }
};
