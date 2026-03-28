# @selenus/test-wallet-mocks

> Mock wallet-adapter wallets for testing Kit Bridge integrations.

## Installation

```bash
pnpm add -D @selenus/test-wallet-mocks
```

## Usage

```ts
import { createMockWalletAdapter } from '@selenus/test-wallet-mocks';

// Connected wallet with all capabilities
const mock = createMockWalletAdapter();

// Disconnected wallet
const disconnected = createMockWalletAdapter({ connected: false });

// Wallet without batch signing
const noBatch = createMockWalletAdapter({ supportsSignAllTransactions: false });

// Wallet that throws on sign
const broken = createMockWalletAdapter({
  signTransactionError: new Error('User rejected'),
});
```

## License

Apache-2.0
