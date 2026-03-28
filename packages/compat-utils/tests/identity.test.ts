import { describe, it, expect } from 'vitest';
import { PublicKey } from '@solana/web3.js';
import { publicKeyToAddress, addressToPublicKey } from '../src/identity.js';
import type { Address } from '@solana/kit';

describe('identity conversions', () => {
  const SYSTEM_PROGRAM = '11111111111111111111111111111111';

  describe('publicKeyToAddress', () => {
    it('converts PublicKey to Address string', () => {
      const pk = new PublicKey(SYSTEM_PROGRAM);
      const address = publicKeyToAddress(pk);
      expect(address).toBe(SYSTEM_PROGRAM);
      expect(typeof address).toBe('string');
    });

    it('handles arbitrary valid public keys', () => {
      const pk = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
      const address = publicKeyToAddress(pk);
      expect(address).toBe('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    });
  });

  describe('addressToPublicKey', () => {
    it('converts Address string to PublicKey', () => {
      const pk = addressToPublicKey(SYSTEM_PROGRAM as Address);
      expect(pk).toBeInstanceOf(PublicKey);
      expect(pk.toBase58()).toBe(SYSTEM_PROGRAM);
    });

    it('round-trips correctly', () => {
      const original = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
      const address = publicKeyToAddress(original);
      const backToPk = addressToPublicKey(address);
      expect(backToPk.equals(original)).toBe(true);
    });
  });
});
