import { describe, it, expect, vi } from 'vitest';
import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import { createKitSignerFromWalletAdapter, type WalletAdapterSignerSource } from '../src/signer.js';
import {
  WalletBridgeDisconnectedError,
  WalletBridgeAccountChangedError,
} from '../src/errors.js';

// Helpers to create minimal mock wallets
function createMockWallet(overrides: Partial<WalletAdapterSignerSource> = {}): WalletAdapterSignerSource {
  return {
    publicKey: new PublicKey('11111111111111111111111111111111'),
    connected: true,
    signTransaction: vi.fn(async (tx: VersionedTransaction) => tx),
    signAllTransactions: vi.fn(async (txs: VersionedTransaction[]) => txs),
    ...overrides,
  };
}

describe('createKitSignerFromWalletAdapter', () => {
  it('returns null for wallet without publicKey', () => {
    const wallet = createMockWallet({ publicKey: null });
    expect(createKitSignerFromWalletAdapter(wallet)).toBeNull();
  });

  it('returns null for wallet without signTransaction', () => {
    const wallet = createMockWallet({ signTransaction: undefined });
    expect(createKitSignerFromWalletAdapter(wallet)).toBeNull();
  });

  it('returns null for disconnected wallet', () => {
    const wallet = createMockWallet({ connected: false });
    expect(createKitSignerFromWalletAdapter(wallet)).toBeNull();
  });

  it('returns a signer with the correct address', () => {
    const wallet = createMockWallet();
    const signer = createKitSignerFromWalletAdapter(wallet);
    expect(signer).not.toBeNull();
    expect(signer!.address).toBe('11111111111111111111111111111111');
  });

  it('signer has modifyAndSignTransactions method', () => {
    const wallet = createMockWallet();
    const signer = createKitSignerFromWalletAdapter(wallet);
    expect(signer).not.toBeNull();
    expect(typeof signer!.modifyAndSignTransactions).toBe('function');
  });

  it('throws WalletBridgeDisconnectedError if wallet disconnects after signer creation', async () => {
    const wallet = createMockWallet();
    const signer = createKitSignerFromWalletAdapter(wallet)!;
    // Simulate disconnect after signer creation
    wallet.publicKey = null;
    await expect(signer.modifyAndSignTransactions([])).rejects.toThrow(
      WalletBridgeDisconnectedError,
    );
  });

  it('throws WalletBridgeAccountChangedError if account changes', async () => {
    const wallet = createMockWallet();
    const signer = createKitSignerFromWalletAdapter(wallet)!;
    // Simulate account switch
    wallet.publicKey = new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111');
    await expect(signer.modifyAndSignTransactions([])).rejects.toThrow(
      WalletBridgeAccountChangedError,
    );
  });
});
