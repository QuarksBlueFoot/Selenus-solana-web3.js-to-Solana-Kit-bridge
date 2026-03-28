/**
 * Normalized bridge error hierarchy.
 *
 * These errors give downstream consumers a stable, inspectable error surface
 * instead of random wallet-specific spaghetti.
 */

export class WalletBridgeError extends Error {
  public readonly code: string;

  constructor(message: string, code: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'WalletBridgeError';
    this.code = code;
  }
}

export class WalletBridgeDisconnectedError extends WalletBridgeError {
  constructor(message = 'Wallet is not connected', options?: ErrorOptions) {
    super(message, 'WALLET_DISCONNECTED', options);
    this.name = 'WalletBridgeDisconnectedError';
  }
}

export class WalletBridgeUnsupportedOperationError extends WalletBridgeError {
  public readonly operation: string;

  constructor(operation: string, message?: string, options?: ErrorOptions) {
    super(
      message ?? `Wallet does not support operation: ${operation}`,
      'UNSUPPORTED_OPERATION',
      options,
    );
    this.name = 'WalletBridgeUnsupportedOperationError';
    this.operation = operation;
  }
}

export class WalletBridgeAccountChangedError extends WalletBridgeError {
  constructor(
    message = 'Wallet account changed — signer is invalidated',
    options?: ErrorOptions,
  ) {
    super(message, 'ACCOUNT_CHANGED', options);
    this.name = 'WalletBridgeAccountChangedError';
  }
}

export class WalletBridgeTransactionMutationError extends WalletBridgeError {
  constructor(
    message = 'Wallet mutated the transaction during signing',
    options?: ErrorOptions,
  ) {
    super(message, 'TRANSACTION_MUTATED', options);
    this.name = 'WalletBridgeTransactionMutationError';
  }
}

export class WalletBridgeConversionError extends WalletBridgeError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 'CONVERSION_ERROR', options);
    this.name = 'WalletBridgeConversionError';
  }
}

/**
 * Normalize an unknown error from a wallet into a WalletBridgeError.
 *
 * If the error is already a WalletBridgeError, it passes through.
 * Otherwise it wraps it with a generic code and preserves the cause.
 */
export function normalizeWalletBridgeError(error: unknown): WalletBridgeError {
  if (error instanceof WalletBridgeError) {
    return error;
  }

  const message =
    error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown wallet bridge error';

  return new WalletBridgeError(message, 'WALLET_ERROR', {
    cause: error instanceof Error ? error : undefined,
  });
}
