import { describe, it, expect } from 'vitest';
import {
  WalletBridgeError,
  WalletBridgeDisconnectedError,
  WalletBridgeUnsupportedOperationError,
  WalletBridgeAccountChangedError,
  WalletBridgeTransactionMutationError,
  WalletBridgeConversionError,
  normalizeWalletBridgeError,
} from '../src/errors.js';

describe('WalletBridgeError hierarchy', () => {
  it('WalletBridgeError has code and message', () => {
    const err = new WalletBridgeError('test', 'TEST_CODE');
    expect(err.message).toBe('test');
    expect(err.code).toBe('TEST_CODE');
    expect(err.name).toBe('WalletBridgeError');
    expect(err).toBeInstanceOf(Error);
  });

  it('WalletBridgeDisconnectedError defaults', () => {
    const err = new WalletBridgeDisconnectedError();
    expect(err.code).toBe('WALLET_DISCONNECTED');
    expect(err.name).toBe('WalletBridgeDisconnectedError');
    expect(err).toBeInstanceOf(WalletBridgeError);
  });

  it('WalletBridgeUnsupportedOperationError includes operation', () => {
    const err = new WalletBridgeUnsupportedOperationError('signMessage');
    expect(err.code).toBe('UNSUPPORTED_OPERATION');
    expect(err.operation).toBe('signMessage');
    expect(err.message).toContain('signMessage');
  });

  it('WalletBridgeAccountChangedError defaults', () => {
    const err = new WalletBridgeAccountChangedError();
    expect(err.code).toBe('ACCOUNT_CHANGED');
  });

  it('WalletBridgeTransactionMutationError defaults', () => {
    const err = new WalletBridgeTransactionMutationError();
    expect(err.code).toBe('TRANSACTION_MUTATED');
  });

  it('WalletBridgeConversionError has message', () => {
    const err = new WalletBridgeConversionError('bad bytes');
    expect(err.code).toBe('CONVERSION_ERROR');
    expect(err.message).toBe('bad bytes');
  });
});

describe('normalizeWalletBridgeError', () => {
  it('passes through existing WalletBridgeError', () => {
    const original = new WalletBridgeDisconnectedError();
    const normalized = normalizeWalletBridgeError(original);
    expect(normalized).toBe(original);
  });

  it('wraps unknown Error', () => {
    const original = new TypeError('oops');
    const normalized = normalizeWalletBridgeError(original);
    expect(normalized).toBeInstanceOf(WalletBridgeError);
    expect(normalized.code).toBe('WALLET_ERROR');
    expect(normalized.message).toBe('oops');
    expect(normalized.cause).toBe(original);
  });

  it('wraps string', () => {
    const normalized = normalizeWalletBridgeError('something broke');
    expect(normalized).toBeInstanceOf(WalletBridgeError);
    expect(normalized.message).toBe('something broke');
  });

  it('wraps null', () => {
    const normalized = normalizeWalletBridgeError(null);
    expect(normalized).toBeInstanceOf(WalletBridgeError);
    expect(normalized.message).toBe('Unknown wallet bridge error');
  });
});
