import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { createKitSignerFromWalletAdapter } from '@selenus/kit-bridge-core';
import type { Address, TransactionModifyingSigner } from '@solana/kit';

/**
 * Returns a Kit TransactionModifyingSigner backed by the current wallet-adapter wallet,
 * or null if no wallet is connected / ready.
 *
 * The signer is memoized — it only recreates when the wallet's publicKey changes.
 *
 * @example
 * ```tsx
 * const signer = useKitSigner();
 * if (signer) {
 *   // Use signer with Kit APIs
 * }
 * ```
 */
export function useKitSigner(): TransactionModifyingSigner<Address> | null {
  const { publicKey, signTransaction, signAllTransactions, connected } = useWallet();

  return useMemo(() => {
    if (!publicKey || !signTransaction || !connected) {
      return null;
    }

    return createKitSignerFromWalletAdapter({
      publicKey,
      signTransaction,
      signAllTransactions: signAllTransactions ?? undefined,
      connected,
    });
  }, [publicKey?.toBase58(), signTransaction, signAllTransactions, connected]);
}
