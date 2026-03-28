import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { detectWalletCapabilities } from '@selenus/kit-bridge-core';
import type { WalletBridgeCapabilities } from '@selenus/kit-bridge-core';

/**
 * Returns the current wallet's bridge capabilities.
 * Refreshes when the wallet or its readiness changes.
 *
 * @example
 * ```tsx
 * const caps = useWalletBridgeCapabilities();
 * if (caps.canSignTransaction) {
 *   // Safe to create a signer
 * }
 * ```
 */
export function useWalletBridgeCapabilities(): WalletBridgeCapabilities {
  const wallet = useWallet();

  return useMemo(
    () => detectWalletCapabilities(wallet as unknown as Record<string, unknown>),
    [
      wallet.publicKey?.toBase58(),
      wallet.connected,
      wallet.signTransaction,
      wallet.signAllTransactions,
      wallet.signMessage,
    ]
  );
}
