import { create } from "domain";
import {createPublicClient, http, createWalletClient} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { somniaTestnet } from "viem/chains";

export const publicClient = createPublicClient({
  chain: somniaTestnet,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: somniaTestnet,
  account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`),
  transport: http(),
});