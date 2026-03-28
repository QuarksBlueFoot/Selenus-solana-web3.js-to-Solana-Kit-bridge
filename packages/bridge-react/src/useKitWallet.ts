import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { fromLegacyPublicKey } from '@solana/compat';
import type { WalletBridgeCapabilities } from '@selenus/kit-bridge-core';
import type { Address, TransactionModifyingSigner } from '@solana/kit';
import { useKitSigner } from './useKitSigner.js';
import { useWalletBridgeCapabilities } from './useWalletBridgeCapabilities.js';

export interface KitWalletInfo {
  /** Kit Address of the connected wallet, or null */
  address: Address | null;
  /** Whether the wallet is connected */
  connected: boolean;
  /** Kit-compatible signer, or null if not available */
  signer: TransactionModifyingSigner<Address> | null;
  /** Detailed capability flags */
  capabilities: WalletBridgeCapabilities;
  /** The raw wallet name, e.g. "Phantom" */
  walletName: string | null;
}

/**
 * All-in-one hook: returns the Kit signer, address, capabilities, and connection status.
 * Composes useKitSigner + useWalletBridgeCapabilities for convenience.
 *
 * @example
 * ```tsx
 * const { signer, address, connected, capabilities } = useKitWallet();
 * ```
 */
export function useKitWallet(): KitWalletInfo {
  const wallet = useWallet();
  const signer = useKitSigner();
  const capabilities = useWalletBridgeCapabilities();

  const address: Address | null = useMemo(() => {
    if (!wallet.publicKey) return null;
    return fromLegacyPublicKey(wallet.publicKey) as Address;
  }, [wallet.publicKey?.toBase58()]);

  return useMemo(
    () => ({
      address,
      connected: wallet.connected,
      signer,
      capabilities,
      walletName: wallet.wallet?.adapter.name ?? null,
    }),
    [address, wallet.connected, signer, capabilities, wallet.wallet?.adapter.name]
  );
}
