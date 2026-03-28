import { VersionedTransaction } from '@solana/web3.js';
import { fromVersionedTransaction } from '@solana/compat';
import { getTransactionEncoder } from '@solana/kit';
import type { Transaction } from '@solana/kit';

const encoder = getTransactionEncoder();

/**
 * Convert a legacy VersionedTransaction to a Kit Transaction.
 *
 * **Safe**: This uses @solana/compat's fromVersionedTransaction under the hood.
 *
 * **Caveats**:
 * - Only VersionedTransaction is supported (not the old Transaction class).
 *   If you have a legacy Transaction, convert it to VersionedTransaction first.
 * - The conversion preserves all data but the resulting Kit Transaction type
 *   may have different generic type parameters than a transaction built natively in Kit.
 *
 * @throws If the transaction bytes cannot be decoded.
 */
export function legacyTxToKit(legacyTx: VersionedTransaction): Transaction {
  return fromVersionedTransaction(legacyTx) as unknown as Transaction;
}

/**
 * Convert a Kit Transaction back to a legacy VersionedTransaction.
 *
 * **Partial**: This encodes the Kit transaction to wire format bytes,
 * then deserializes into a VersionedTransaction. The round-trip is byte-identical
 * for signed transactions; for unsigned transactions the signature placeholder
 * behavior may differ.
 *
 * **Caveats**:
 * - Fee payer and recent blockhash must already be set on the Kit transaction.
 * - Signatures are preserved.
 * - Address lookup tables are preserved in the wire format.
 *
 * @throws If the Kit transaction cannot be encoded to wire format.
 */
export function kitTxToLegacy(kitTx: Transaction): VersionedTransaction {
  const bytes = new Uint8Array(encoder.encode(kitTx));
  return VersionedTransaction.deserialize(bytes);
}
