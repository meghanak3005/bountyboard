import { http, createConfig } from "wagmi";
import { defineChain } from "viem";
import { injected, metaMask } from "wagmi/connectors";

export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        "https://testnet-rpc.monad.xyz",
        "https://rpc.testnet.monad.xyz",
      ],
    },
  },
  blockExplorers: {
    default: { name: "MonadScan", url: "https://testnet.monadscan.com" },
  },
});

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  connectors: [
    metaMask(),
    injected(),
  ],
  transports: {
    [monadTestnet.id]: http(),
  },
  ssr: true,
});
