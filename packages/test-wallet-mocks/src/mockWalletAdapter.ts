import { PublicKey, VersionedTransaction, Keypair } from '@solana/web3.js';

export interface MockWalletAdapterConfig {
  /** If not provided, a random Keypair is generated */
  keypair?: Keypair;
  /** Whether the mock wallet is "connected". Default: true */
  connected?: boolean;
  /** Whether signTransaction is available. Default: true */
  supportsSignTransaction?: boolean;
  /** Whether signAllTransactions is available. Default: true */
  supportsSignAllTransactions?: boolean;
  /** Whether signMessage is available. Default: false */
  supportsSignMessage?: boolean;
  /** If provided, signTransaction will throw this error */
  signTransactionError?: Error;
  /** If true, the wallet will return a different transaction (simulating mutation) */
  mutatesTransactions?: boolean;
}

/**
 * Creates a mock wallet adapter for testing purposes.
 * Mimics the shape that wallet-adapter-react provides via useWallet().
 */
export function createMockWalletAdapter(config: MockWalletAdapterConfig = {}) {
  const keypair = config.keypair ?? Keypair.generate();
  const connected = config.connected ?? true;

  const signTransaction = config.supportsSignTransaction !== false
    ? async (tx: VersionedTransaction): Promise<VersionedTransaction> => {
        if (config.signTransactionError) {
          throw config.signTransactionError;
        }
        // In a real wallet this would actually sign. We just return as-is.
        return tx;
      }
    : undefined;

  const signAllTransactions = config.supportsSignAllTransactions !== false
    ? async (txs: VersionedTransaction[]): Promise<VersionedTransaction[]> => {
        if (config.signTransactionError) {
          throw config.signTransactionError;
        }
        return txs;
      }
    : undefined;

  const signMessage = config.supportsSignMessage
    ? async (message: Uint8Array): Promise<Uint8Array> => {
        // Return a dummy 64-byte "signature"
        return new Uint8Array(64);
      }
    : undefined;

  return {
    publicKey: connected ? keypair.publicKey : null,
    connected,
    signTransaction,
    signAllTransactions,
    signMessage,
    wallet: {
      adapter: {
        name: 'Mock Wallet' as const,
        url: 'https://mock.wallet',
        icon: 'data:image/svg+xml,' as const,
      },
    },
  };
}
