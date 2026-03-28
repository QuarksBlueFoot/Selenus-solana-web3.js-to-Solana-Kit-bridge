import {
  getTransactionEncoder,
  getTransactionDecoder,
  getBase64EncodedWireTransaction,
} from '@solana/kit';
import type { Transaction } from '@solana/kit';
import { WalletBridgeConversionError } from './errors.js';

const encoder = getTransactionEncoder();
const decoder = getTransactionDecoder();

/**
 * Encode a Kit Transaction to wire-format bytes (Uint8Array).
 *
 * This is a thin wrapper around Kit's getTransactionEncoder().
 * Use this when you need raw bytes for signing via legacy wallet adapters.
 */
export function encodeTransaction(transaction: Transaction): Uint8Array {
  try {
    return new Uint8Array(encoder.encode(transaction));
  } catch (error) {
    throw new WalletBridgeConversionError(
      `Failed to encode Kit transaction to wire format: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error instanceof Error ? error : undefined },
    );
  }
}

/**
 * Decode wire-format bytes back into a Kit Transaction.
 *
 * This is a thin wrapper around Kit's getTransactionDecoder().
 * Use this after signing with a legacy wallet to get back into Kit types.
 */
export function decodeTransaction(bytes: Uint8Array): Transaction {
  try {
    return decoder.decode(bytes);
  } catch (error) {
    throw new WalletBridgeConversionError(
      `Failed to decode wire-format bytes to Kit transaction: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error instanceof Error ? error : undefined },
    );
  }
}

/**
 * Encode a Kit Transaction to a base64 string suitable for RPC submission.
 *
 * Wraps Kit's getBase64EncodedWireTransaction().
 */
export function toBase64Transaction(transaction: Transaction): string {
  try {
    return getBase64EncodedWireTransaction(transaction);
  } catch (error) {
    throw new WalletBridgeConversionError(
      `Failed to encode Kit transaction to base64: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error instanceof Error ? error : undefined },
    );
  }
}
