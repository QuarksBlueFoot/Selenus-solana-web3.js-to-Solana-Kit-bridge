/**
 * @selenus/kit-compat-utils
 *
 * Helpers for converting between legacy @solana/web3.js types
 * and @solana/kit types.
 *
 * Important: Not all conversions are lossless. Each function documents
 * what is safe, what may fail, and what assumptions are made.
 */

// ─── Identity Conversion ───────────────────────────────────────────────────
export { publicKeyToAddress, addressToPublicKey } from './identity.js';

// ─── Transaction Conversion ────────────────────────────────────────────────
export { legacyTxToKit, kitTxToLegacy } from './transactions.js';

// ─── Instruction Conversion ────────────────────────────────────────────────
export { legacyInstructionToKit } from './instructions.js';

// ─── Re-exports from @solana/compat (convenience) ──────────────────────────
export {
  fromLegacyPublicKey,
  fromLegacyKeypair,
  fromVersionedTransaction,
  fromLegacyTransactionInstruction,
} from '@solana/compat';
