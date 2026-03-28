import { TransactionInstruction } from '@solana/web3.js';
import { fromLegacyTransactionInstruction } from '@solana/compat';

/**
 * Convert a legacy TransactionInstruction to a Kit Instruction.
 *
 * **Lossless**: Yes. Program ID, accounts, and data are all preserved.
 *
 * **Caveats**:
 * - Account keys are converted from PublicKey to Kit Address (string).
 * - The isSigner and isWritable flags are preserved.
 *
 * @example
 * ```ts
 * import { SystemProgram } from '@solana/web3.js';
 * const legacyIx = SystemProgram.transfer({ fromPubkey, toPubkey, lamports });
 * const kitIx = legacyInstructionToKit(legacyIx);
 * ```
 */
export function legacyInstructionToKit(instruction: TransactionInstruction) {
  return fromLegacyTransactionInstruction(instruction);
}
