import { describe, it, expect } from 'vitest';
import {
  detectWalletCapabilities,
  isWalletAdapterSignable,
  isWalletStandardSignable,
} from '../src/capabilities.js';

describe('detectWalletCapabilities', () => {
  it('returns all-false for null wallet', () => {
    const caps = detectWalletCapabilities(null);
    expect(caps.connected).toBe(false);
    expect(caps.hasIdentity).toBe(false);
    expect(caps.canSignTransaction).toBe(false);
    expect(caps.canSignAllTransactions).toBe(false);
    expect(caps.canSignMessage).toBe(false);
  });

  it('returns all-false for undefined wallet', () => {
    const caps = detectWalletCapabilities(undefined);
    expect(caps.connected).toBe(false);
    expect(caps.hasIdentity).toBe(false);
  });

  it('returns all-false for empty object', () => {
    const caps = detectWalletCapabilities({});
    expect(caps.connected).toBe(false);
    expect(caps.hasIdentity).toBe(false);
    expect(caps.canSignTransaction).toBe(false);
  });

  it('detects connected wallet with signing capabilities', () => {
    const mockWallet = {
      connected: true,
      publicKey: { toBase58: () => '11111111111111111111111111111111' },
      signTransaction: async () => ({}),
      signAllTransactions: async () => [],
      signMessage: async () => new Uint8Array(),
    };
    const caps = detectWalletCapabilities(mockWallet as any);
    expect(caps.connected).toBe(true);
    expect(caps.hasIdentity).toBe(true);
    expect(caps.canSignTransaction).toBe(true);
    expect(caps.canSignAllTransactions).toBe(true);
    expect(caps.canSignMessage).toBe(true);
    expect(caps.mayMutateTransactions).toBe('unknown');
  });

  it('detects wallet without signAllTransactions', () => {
    const mockWallet = {
      connected: true,
      publicKey: { toBase58: () => '11111111111111111111111111111111' },
      signTransaction: async () => ({}),
    };
    const caps = detectWalletCapabilities(mockWallet as any);
    expect(caps.canSignTransaction).toBe(true);
    expect(caps.canSignAllTransactions).toBe(false);
    expect(caps.canSignMessage).toBe(false);
  });
});

describe('isWalletAdapterSignable', () => {
  it('returns false for null', () => {
    expect(isWalletAdapterSignable(null)).toBe(false);
  });

  it('returns false for disconnected wallet', () => {
    const wallet = {
      connected: false,
      publicKey: { toBase58: () => '1111' },
      signTransaction: async () => ({}),
    };
    expect(isWalletAdapterSignable(wallet as any)).toBe(false);
  });

  it('returns false for wallet without publicKey', () => {
    const wallet = {
      connected: true,
      publicKey: null,
      signTransaction: async () => ({}),
    };
    expect(isWalletAdapterSignable(wallet as any)).toBe(false);
  });

  it('returns true for connected wallet with signing', () => {
    const wallet = {
      connected: true,
      publicKey: { toBase58: () => '1111' },
      signTransaction: async () => ({}),
    };
    expect(isWalletAdapterSignable(wallet as any)).toBe(true);
  });
});

describe('isWalletStandardSignable', () => {
  it('returns false for null', () => {
    expect(isWalletStandardSignable(null)).toBe(false);
  });

  it('returns false for object without features', () => {
    expect(isWalletStandardSignable({})).toBe(false);
  });

  it('returns true for wallet with solana:signTransaction feature', () => {
    const wallet = {
      features: {
        'solana:signTransaction': { version: '1.0.0' },
      },
    };
    expect(isWalletStandardSignable(wallet)).toBe(true);
  });

  it('returns true for wallet with solana:signAndSendTransaction feature', () => {
    const wallet = {
      features: {
        'solana:signAndSendTransaction': { version: '1.0.0' },
      },
    };
    expect(isWalletStandardSignable(wallet)).toBe(true);
  });

  it('returns false for wallet with unrelated features', () => {
    const wallet = {
      features: {
        'standard:connect': { version: '1.0.0' },
      },
    };
    expect(isWalletStandardSignable(wallet)).toBe(false);
  });
});
