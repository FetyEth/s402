import { defineChain } from 'viem';

export const somnia = defineChain({
  id: 5031,
  name: 'Somnia Mainnet',
  nativeCurrency: {
    name: 'Somnia',
    symbol: 'SOM',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://api.infra.mainnet.somnia.network/'],
    },
    public: {
      http: ['https://api.infra.mainnet.somnia.network/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://explorer.somnia.network',
    },
  },
});
