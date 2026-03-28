import { VersionedTransaction, PublicKey } from '@solana/web3.js';
import { fromLegacyPublicKey } from '@solana/compat';
import type { Address, Transaction, TransactionModifyingSigner } from '@solana/kit';
import {
  WalletBridgeDisconnectedError,
  WalletBridgeUnsupportedOperationError,
  WalletBridgeAccountChangedError,
  normalizeWalletBridgeError,
} from './errors.js';
import { encodeTransaction, decodeTransaction } from './wire.js';

/**
 * The minimum wallet surface the bridge needs.
 *
 * This is deliberately a Pick — we don't require the full WalletContextState,
 * just the parts we actually use. Makes testing and wrapping easier.
 */
export type WalletAdapterSignerSource = {
  publicKey: PublicKey | null;
  signTransaction?: ((transaction: VersionedTransaction) => Promise<VersionedTransaction>) | undefined;
  signAllTransactions?: ((transactions: VersionedTransaction[]) => Promise<VersionedTransaction[]>) | undefined;
  connected?: boolean;
};

/**
 * Create a Kit-compatible TransactionModifyingSigner from a legacy wallet-adapter wallet.
 *
 * This is the core bridge primitive. It:
 * 1. Checks the wallet is connected and has signing capability
 * 2. Converts the wallet's public key to a Kit Address
 * 3. Returns a signer that converts Kit transactions → legacy for signing, then back
 *
 * Returns null if the wallet is not in a signable state.
 *
 * Why TransactionModifyingSigner?
 * Wallets like Phantom may add compute budget instructions before signing.
 * We cannot guarantee the transaction won't be modified, so we use the
 * conservative signer type. This is exactly what @solana/react does too.
 *
 * @example
 * ```ts
 * import { createKitSignerFromWalletAdapter } from '@selenus/kit-bridge-core';
 * import { useWallet } from '@solana/wallet-adapter-react';
 *
 * const wallet = useWallet();
 * const signer = createKitSignerFromWalletAdapter(wallet);
 * if (signer) {
 *   // Use signer with Kit transaction flows
 * }
 * ```
 */
export function createKitSignerFromWalletAdapter(
  wallet: WalletAdapterSignerSource,
): TransactionModifyingSigner<Address> | null {
  if (!wallet.publicKey || !wallet.signTransaction) {
    return null;
  }

  if (wallet.connected === false) {
    return null;
  }

  const signerAddress = fromLegacyPublicKey(wallet.publicKey) as Address;

  // Capture the public key at creation time for account-change detection
  const capturedPublicKey = wallet.publicKey.toBase58();

  // We use `as` here because the wallet adapter roundtrip (Kit → legacy → sign → Kit)
  // preserves transaction bytes but strips Kit's branded type markers
  // (TransactionWithLifetime, TransactionWithinSizeLimit). The actual data is valid;
  // the brands are a TypeScript-level concern only.
  return {
    address: signerAddress,

    async modifyAndSignTransactions<T extends Transaction>(
      transactions: readonly T[],
    ): Promise<readonly T[]> {
      // Guard: wallet still connected?
      if (!wallet.publicKey || wallet.connected === false) {
        throw new WalletBridgeDisconnectedError();
      }

      // Guard: same account?
      if (wallet.publicKey.toBase58() !== capturedPublicKey) {
        throw new WalletBridgeAccountChangedError();
      }

      // Guard: can sign?
      if (!wallet.signTransaction) {
        throw new WalletBridgeUnsupportedOperationError('signTransaction');
      }

      try {
        // Convert Kit transactions to legacy VersionedTransaction for wallet signing
        const legacyTxs = transactions.map((tx) =>
          VersionedTransaction.deserialize(encodeTransaction(tx)),
        );

        let signedLegacy: VersionedTransaction[];

        // Prefer batch signing if available (fewer round-trips to wallet)
        if (wallet.signAllTransactions && legacyTxs.length > 1) {
          signedLegacy = await wallet.signAllTransactions(legacyTxs);
        } else {
          // Fallback: sign one-by-one
          signedLegacy = [];
          for (const legacyTx of legacyTxs) {
            const signed = await wallet.signTransaction!(legacyTx);
            signedLegacy.push(signed);
          }
        }

        // Convert signed legacy transactions back to Kit format
        // The `as T` is safe: the wallet may have modified the tx, but it's still
        // the same structural type. TransactionModifyingSigner allows mutation by spec.
        return signedLegacy.map((stx) => decodeTransaction(stx.serialize()) as T);
      } catch (error) {
        throw normalizeWalletBridgeError(error);
      }
    },
  } as TransactionModifyingSigner<Address>;
}
