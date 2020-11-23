import { 
  WEB3_PROVIDER, 
  USDC_CONTRACT_ADDRESS, 
  WEB3_RESULT_TOO_LARGE_ERROR_CODE, 
  WEB3_BALANCEOF_ADDRESS_LENGTH,
  WEB3_MAX_TRANSACTIONS,
} from '@/utils/constants';
import { padHex, toHex } from '@/utils/utils';
import Web3 from 'web3';

export const abi = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: 'account', type: 'address' }],
    name: 'isMinter',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'pauser',
    outputs: [{ name: '', type: 'address' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: 'account', type: 'address' }],
    name: 'isContract',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    inputs: [{ name: '_account', type: 'address' }],
    name: 'isBlacklisted',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', type: 'bool'}],
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [{ name:'', type: 'bool' }],
    stateMutability: 'nonpayable',
    type:'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [{ name:'', type: 'bool' }],
    stateMutability: 'nonpayable',
    type:'function',
  },
  {
    inputs: [],
    name: 'pauseEvent',
    anonymous: false,
    type: 'event',
  },
  {
    inputs: [],
    name: 'unpauseEvent',
    anonymous: false,
    type: 'event',
  },
  {
    inputs: [],
    name: 'removeMinterEvent',
    anonymous: false,
    type: 'event',
  },
  {
    inputs: [],
    name: 'configureMinterEvent',
    anonymous: false,
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',

    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newPauser',
        type: 'address',
      },
    ],
    name: 'updatePauser',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_account', type: 'address' }],
    name: 'blacklist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_account', type: 'address' }],
    name: 'unBlacklist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_account', type: 'address' }],
    name: 'blacklistEvent',
    anonymous: false,
    type: 'event',
  },
  {
    inputs: [{ name: '_account', type: 'address' }],
    name: 'unBlacklistEvent',
    anonymous: false,
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newMasterMinter',
        type: 'address',
      },
    ],
    name: 'updateMasterMinter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newBlacklister',
        type: 'address',
      },
    ],
    name: 'updateBlacklister',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'blacklister',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'masterMinter',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name:'_minter', type: 'address'}, {name:'_amount', type:'uint256'}],
    name: 'configureMinter',
    outputs: [{ name:'', type: 'bool' }],
    stateMutability: 'nonpayable',
    type:'function',
  },
  {
    inputs: [{ name:'_minter', type: 'address'}],
    name: 'removeMinter',
    outputs: [{ name:'', type: 'bool' }],
    stateMutability: 'nonpayable',
    type:'function',
  },
  {
    inputs: [{ name:'_minter', type: 'address'}],
    name: 'minterAllowance',
    outputs: [{ name:'allowance', type: 'uint256' }],
    type:'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    constant: true,
    inputs: [{ name: 'account', type: 'address' }],
    name: 'isMinter',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    inputs: [{ name:'_to', type: 'address'}, {name:'_amount', type:'uint256'}],
    name: 'mint',
    outputs: [{ name:'', type: 'bool' }],
    stateMutability: 'nonpayable',
    type:'function',
  },
  {
    constant: true,
    inputs: [{ name: 'account', type: 'address' }],
    name: 'isMinter',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    inputs: [{ name:'_amount', type :'uint256' }],
    name: 'burn',
    outputs:[],
    stateMutability:'nonpayable',
    type:'function',
  },
];

export const web3 = new Web3(WEB3_PROVIDER || Web3.givenProvider);
export const contract = new web3.eth.Contract(abi, USDC_CONTRACT_ADDRESS);

export const getBalance = async (address) => {
  const balance = await contract.methods
    .balanceOf(padHex(address, WEB3_BALANCEOF_ADDRESS_LENGTH))
    .call();
  const decimals = await contract.methods.decimals().call();

  return balance / (10 ** decimals);
};

export const getTotalSupply = async () => {
  const decimals = await contract.methods.decimals().call();
  return await contract.methods.totalSupply().call() / (10 ** decimals);
};

export const getTransactions = async (fromBlock, toBlock='latest', topics=[null, null, null]) => {
  try {
    return await web3.eth.getPastLogs({
      fromBlock,
      toBlock,
      address: USDC_CONTRACT_ADDRESS,
      topics,
    });
  }
  catch (error) {
    if (error.code === WEB3_RESULT_TOO_LARGE_ERROR_CODE) {
      // More than MAX_TRANSACTIONS results
      return null;
    }
    throw error;
  }
};

export const getAllTransactions = async () => {
  const latest = await web3.eth.getBlockNumber();

  // Range of the possible 'from' block numbers that gets MAX_TRANSACTIONS.
  const range = [0, latest];
  let midpoint = Math.floor((range[0] + range[1]) / 2);
  let transactions = await getTransactions(toHex(midpoint));

  // Binary search to find the block number that gets MAX_TRANSACTIONS.
  while (transactions === null || transactions.length < WEB3_MAX_TRANSACTIONS - 1) {

    // If the range is too small, find the first non-null result.
    if (range[1] - range[0] <= 1) {
      let i = 0;
      while (transactions === null) {
        transactions = await getTransactions(midpoint + i++, latest);
      }
      break;
    }

    if (transactions === null) {
      // Still too many transactions.
      range[0] = midpoint;
    }
    else {
      // Not enough transactions.
      range[1] = midpoint;
    }
    midpoint = Math.floor((range[0] + range[1]) / 2);
    transactions = await getTransactions(midpoint, latest);
  }
  return transactions;
};
