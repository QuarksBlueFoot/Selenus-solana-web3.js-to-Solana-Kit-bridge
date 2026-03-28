import { describe, it, expect } from 'vitest';
import { PublicKey } from '@solana/web3.js';
import { createMockWalletAdapter } from '../src/mockWalletAdapter.js';

describe('createMockWalletAdapter', () => {
  it('creates a connected wallet by default', () => {
    const mock = createMockWalletAdapter();
    expect(mock.connected).toBe(true);
    expect(mock.publicKey).toBeInstanceOf(PublicKey);
    expect(mock.signTransaction).toBeDefined();
    expect(mock.signAllTransactions).toBeDefined();
  });

  it('creates a disconnected wallet', () => {
    const mock = createMockWalletAdapter({ connected: false });
    expect(mock.connected).toBe(false);
    expect(mock.publicKey).toBeNull();
  });

  it('can disable signTransaction', () => {
    const mock = createMockWalletAdapter({ supportsSignTransaction: false });
    expect(mock.signTransaction).toBeUndefined();
  });

  it('can disable signAllTransactions', () => {
    const mock = createMockWalletAdapter({ supportsSignAllTransactions: false });
    expect(mock.signAllTransactions).toBeUndefined();
  });

  it('can enable signMessage', () => {
    const mock = createMockWalletAdapter({ supportsSignMessage: true });
    expect(mock.signMessage).toBeDefined();
  });

  it('has wallet adapter metadata', () => {
    const mock = createMockWalletAdapter();
    expect(mock.wallet.adapter.name).toBe('Mock Wallet');
  });
});
