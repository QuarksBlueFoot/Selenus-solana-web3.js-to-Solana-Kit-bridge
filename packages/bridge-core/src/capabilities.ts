/**
 * Inspected capabilities of a wallet for bridge compatibility.
 *
 * Every field has an explicit value — no guessing, no vibes.
 */
export type WalletBridgeCapabilities = {
  /** Whether the wallet reports itself as connected. */
  connected: boolean;
  /** Whether the wallet exposes a public key / account identity. */
  hasIdentity: boolean;
  /** Whether signTransaction is available. */
  canSignTransaction: boolean;
  /** Whether signAllTransactions is available for batching. */
  canSignAllTransactions: boolean;
  /** Whether signMessage is available. */
  canSignMessage: boolean;
  /**
   * Whether the wallet may mutate transactions before signing.
   * "unknown" means we cannot determine this from the adapter surface.
   * We default to assuming mutation is possible (conservative).
   */
  mayMutateTransactions: boolean | 'unknown';
  /**
   * Whether versioned (v0) transactions are supported.
   * "unknown" if the adapter doesn't expose this information.
   */
  supportsVersionedTransactions: boolean | 'unknown';
};

/**
 * Detect the capabilities of a wallet adapter for bridge compatibility.
 *
 * This inspects the adapter's surface area without calling any methods.
 * It does NOT test whether the wallet actually works — only what it advertises.
 *
 * Accepts any object with wallet-like properties (WalletAdapter, WalletContextState, etc.)
 */
export function detectWalletCapabilities(
  wallet: Record<string, unknown> | null | undefined,
): WalletBridgeCapabilities {
  if (!wallet) {
    return {
      connected: false,
      hasIdentity: false,
      canSignTransaction: false,
      canSignAllTransactions: false,
      canSignMessage: false,
      mayMutateTransactions: 'unknown',
      supportsVersionedTransactions: 'unknown',
    };
  }

  const connected = typeof wallet.connected === 'boolean' ? wallet.connected : false;
  const hasIdentity = wallet.publicKey != null;
  const canSignTransaction = typeof wallet.signTransaction === 'function';
  const canSignAllTransactions = typeof wallet.signAllTransactions === 'function';
  const canSignMessage = typeof wallet.signMessage === 'function';

  return {
    connected,
    hasIdentity,
    canSignTransaction,
    canSignAllTransactions,
    canSignMessage,
    // Conservative: assume wallets may mutate (e.g. Phantom adds compute budget).
    // Kit uses TransactionModifyingSigner for this reason.
    mayMutateTransactions: 'unknown',
    // Most modern wallets support VersionedTransaction, but we can't know for sure
    // from the adapter interface alone.
    supportsVersionedTransactions: 'unknown',
  };
}

/**
 * Quick check: can this wallet-adapter wallet create a Kit signer?
 * Requires: connected, has public key, and can sign transactions.
 */
export function isWalletAdapterSignable(
  wallet: Record<string, unknown> | null | undefined,
): boolean {
  const caps = detectWalletCapabilities(wallet);
  return caps.connected && caps.hasIdentity && caps.canSignTransaction;
}

/**
 * Placeholder for Wallet Standard signer detection.
 * Wallet Standard wallets use the `standard:` feature namespace.
 * This will be expanded when @solana/react integration is added.
 */
export function isWalletStandardSignable(
  wallet: unknown,
): boolean {
  if (!wallet || typeof wallet !== 'object') return false;
  const w = wallet as Record<string, unknown>;
  // Wallet Standard wallets expose a `features` object
  if (!w.features || typeof w.features !== 'object') return false;
  const features = w.features as Record<string, unknown>;
  return (
    'solana:signTransaction' in features || 'solana:signAndSendTransaction' in features
  );
}
