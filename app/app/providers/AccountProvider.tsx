'use client';
import { WagmiConfig, createConfig } from 'wagmi';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { scrollTestnet, scroll } from 'viem/chains';
const chains = [scroll, scrollTestnet];

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID!,

    chains,
    // Required
    appName: 'zKubes',

    // Optional
    appDescription: 'P2P Grid Based ZK On-Chain Game',
  })
);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider theme="retro">{children}</ConnectKitProvider>
    </WagmiConfig>
  );
}
