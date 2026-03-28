/**
 * @selenus/kit-bridge-core
 *
 * Core wallet bridge logic for incrementally adopting @solana/kit
 * without replacing @solana/wallet-adapter-react.
 *
 * This package provides:
 * - Kit-compatible signer creation from wallet-adapter wallets
 * - Wallet capability detection
 * - Normalized bridge error types
 * - Transaction adaptation between legacy and Kit formats
 */

export {
  createKitSignerFromWalletAdapter,
  type WalletAdapterSignerSource,
} from './signer.js';

export {
  detectWalletCapabilities,
  isWalletAdapterSignable,
  isWalletStandardSignable,
  type WalletBridgeCapabilities,
} from './capabilities.js';

export {
  WalletBridgeError,
  WalletBridgeDisconnectedError,
  WalletBridgeUnsupportedOperationError,
  WalletBridgeAccountChangedError,
  WalletBridgeTransactionMutationError,
  WalletBridgeConversionError,
  normalizeWalletBridgeError,
} from './errors.js';

export {
  encodeTransaction,
  decodeTransaction,
  toBase64Transaction,
} from './wire.js';
