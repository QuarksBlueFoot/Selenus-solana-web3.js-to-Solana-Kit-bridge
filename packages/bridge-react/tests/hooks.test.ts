import { describe, it, expect, vi } from 'vitest';

// We test the hook logic by verifying functions exist and types are correct.
// Full React rendering tests require jsdom + @testing-library/react which we set up
// but keep lightweight for unit tests.

describe('bridge-react exports', () => {
  it('can import useKitSigner', async () => {
    // Verify the module structure exists
    const mod = await import('../src/useKitSigner.js');
    expect(mod.useKitSigner).toBeDefined();
    expect(typeof mod.useKitSigner).toBe('function');
  });

  it('can import useKitWallet', async () => {
    const mod = await import('../src/useKitWallet.js');
    expect(mod.useKitWallet).toBeDefined();
    expect(typeof mod.useKitWallet).toBe('function');
  });

  it('can import useWalletBridgeCapabilities', async () => {
    const mod = await import('../src/useWalletBridgeCapabilities.js');
    expect(mod.useWalletBridgeCapabilities).toBeDefined();
    expect(typeof mod.useWalletBridgeCapabilities).toBe('function');
  });

  it('can import KitBridgeProvider', async () => {
    const mod = await import('../src/KitBridgeProvider.js');
    expect(mod.KitBridgeProvider).toBeDefined();
    expect(mod.useKitBridgeContext).toBeDefined();
  });

  it('barrel exports all hooks', async () => {
    const mod = await import('../src/index.js');
    expect(mod.useKitSigner).toBeDefined();
    expect(mod.useKitWallet).toBeDefined();
    expect(mod.useWalletBridgeCapabilities).toBeDefined();
    expect(mod.KitBridgeProvider).toBeDefined();
    expect(mod.useKitBridgeContext).toBeDefined();
  });
});
