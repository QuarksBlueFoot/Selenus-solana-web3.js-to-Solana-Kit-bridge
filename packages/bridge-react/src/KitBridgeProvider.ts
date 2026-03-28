import React, { createContext, useContext, useMemo } from 'react';
import { fromLegacyPublicKey } from '@solana/compat';
import type { TransactionModifyingSigner, Address } from '@solana/kit';
import type { WalletBridgeCapabilities } from '@selenus/kit-bridge-core';
import { useKitSigner } from './useKitSigner.js';
import { useWalletBridgeCapabilities } from './useWalletBridgeCapabilities.js';
import { useWallet } from '@solana/wallet-adapter-react';

interface KitBridgeContextValue {
  signer: TransactionModifyingSigner<Address> | null;
  address: Address | null;
  capabilities: WalletBridgeCapabilities;
  connected: boolean;
}

const KitBridgeContext = createContext<KitBridgeContextValue | null>(null);

/**
 * Optional provider for apps that prefer context over direct hook usage.
 * Wrap your app (inside WalletProvider) with this to make the Kit signer
 * available via useKitBridgeContext().
 *
 * @example
 * ```tsx
 * <ConnectionProvider endpoint={url}>
 *   <WalletProvider wallets={wallets}>
 *     <KitBridgeProvider>
 *       <App />
 *     </KitBridgeProvider>
 *   </WalletProvider>
 * </ConnectionProvider>
 * ```
 */
export function KitBridgeProvider({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  const signer = useKitSigner();
  const capabilities = useWalletBridgeCapabilities();

  const address: Address | null = useMemo(() => {
    if (!wallet.publicKey) return null;
    return fromLegacyPublicKey(wallet.publicKey) as Address;
  }, [wallet.publicKey?.toBase58()]);

  const value = useMemo(
    () => ({
      signer,
      address,
      capabilities,
      connected: wallet.connected,
    }),
    [signer, address, capabilities, wallet.connected]
  );

  return React.createElement(KitBridgeContext.Provider, { value }, children);
}

/**
 * Access the Kit bridge context. Must be used within a KitBridgeProvider.
 *
 * @throws If used outside of KitBridgeProvider.
 */
export function useKitBridgeContext(): KitBridgeContextValue {
  const ctx = useContext(KitBridgeContext);
  if (!ctx) {
    throw new Error('useKitBridgeContext must be used within a <KitBridgeProvider>');
  }
  return ctx;
}
