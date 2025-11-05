import { defineChain } from 'viem';

// Somnia Testnet Chain Configuration
export const somniaTestnet = defineChain({
  id: 50311,
  name: 'Somnia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ankr.com/somnia_testnet'],
    },
    public: {
      http: ['https://rpc.ankr.com/somnia_testnet'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://somnia-testnet.socialscan.io' },
  },
  testnet: true,
});

// Contract Configuration
export const S8004_ADDRESS = '0x9d4422E8E1DE1E6032d0b4f450d6227255FA20b4' as const;

export const S8004_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "NotOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "onlyOwnerCanUpdate",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "agentId",
        "type": "uint256"
      }
    ],
    "name": "AddAgent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "agentId",
        "type": "uint256"
      }
    ],
    "name": "ReputationInc",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_type",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_image",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_endpoint",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_version",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "_tasks",
        "type": "string[]"
      },
      {
        "internalType": "bool",
        "name": "_isX402enabled",
        "type": "bool"
      }
    ],
    "name": "createAgent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "agentId",
        "type": "uint256"
      }
    ],
    "name": "getAgent",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_type",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "image",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "endpoint",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "version",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "tasks",
            "type": "string[]"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "reputation",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isX404",
            "type": "bool"
          }
        ],
        "internalType": "struct IS8004.Agent",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "listAgents",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_type",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "image",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "endpoint",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "version",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "tasks",
            "type": "string[]"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "reputation",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isX404",
            "type": "bool"
          }
        ],
        "internalType": "struct IS8004.Agent[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "listUserAgents",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "agentId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "responseTime",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "response",
        "type": "bool"
      }
    ],
    "name": "queriedAgent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export interface Agent {
  id: bigint;
  _type: string;
  name: string;
  description: string;
  image: string;
  endpoint: string;
  version: string;
  tasks: string[];
  owner: string;
  reputation: bigint;
  isX404: boolean;
}