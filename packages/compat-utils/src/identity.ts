import { PublicKey } from '@solana/web3.js';
import { fromLegacyPublicKey } from '@solana/compat';
import type { Address } from '@solana/kit';

/**
 * Convert a legacy PublicKey to a Kit Address.
 *
 * **Lossless**: Yes. A base58-encoded public key maps 1:1 to a Kit Address string.
 *
 * @example
 * ```ts
 * const address = publicKeyToAddress(new PublicKey('11111111111111111111111111111111'));
 * // => '11111111111111111111111111111111' (typed as Address)
 * ```
 */
export function publicKeyToAddress(publicKey: PublicKey): Address {
  return fromLegacyPublicKey(publicKey) as Address;
}

/**
 * Convert a Kit Address back to a legacy PublicKey.
 *
 * **Lossless**: Yes, as long as the address string is a valid base58-encoded
 * 32-byte value. This will throw if the address is malformed.
 *
 * @example
 * ```ts
 * const pubkey = addressToPublicKey('11111111111111111111111111111111' as Address);
 * ```
 */
export function addressToPublicKey(address: Address): PublicKey {
  return new PublicKey(address as string);
}
