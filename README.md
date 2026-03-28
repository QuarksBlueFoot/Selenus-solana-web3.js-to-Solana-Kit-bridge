# Selenus Kit Bridge

> Bridge `@solana/wallet-adapter` to `@solana/kit`. Adopt Kit incrementally without rewriting your wallet integration.

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

## Why

The Solana ecosystem is moving from `@solana/web3.js` to `@solana/kit` (formerly web3.js v2). Many production dApps use `@solana/wallet-adapter-react` for wallet connections. There is no official wallet-adapter-to-Kit bridge package.

This library gives you a `TransactionModifyingSigner` (Kit's signer interface) backed by your existing wallet-adapter connection. One hook. No rewrites.

```tsx
import { useKitSigner } from '@selenus/kit-bridge-react';

function SendButton() {
  const signer = useKitSigner(); // Kit signer from wallet-adapter

  const send = async () => {
    const tx = pipe(
      createTransaction({ version: 0 }),
      tx => appendTransactionMessageInstruction(transferSolInstruction, tx),
      tx => setTransactionMessageFeePayerSigner(signer!, tx),
    );
    await signAndSendTransaction(signer!, tx);
  };

  return <button onClick={send} disabled={!signer}>Send SOL</button>;
}
```

## Packages

| Package | Description | Status |
| ------- | ----------- | ------ |
| [`@selenus/kit-bridge-core`](packages/bridge-core/) | Core signer adapter, capability detection, error normalization | v0.1.0 |
| [`@selenus/kit-bridge-react`](packages/bridge-react/) | React hooks (`useKitSigner`, `useKitWallet`) | v0.1.0 |
| [`@selenus/kit-compat-utils`](packages/compat-utils/) | Legacy/Kit type conversion helpers | v0.1.0 |
| [`@selenus/test-wallet-mocks`](packages/test-wallet-mocks/) | Mock wallets for testing | v0.1.0 |

## Quick Start

### Install

```bash
# Core + React hooks (most common)
pnpm add @selenus/kit-bridge-core @selenus/kit-bridge-react

# Conversion utilities (optional)
pnpm add @selenus/kit-compat-utils
```

### Prerequisites

You need wallet-adapter already set up:

```bash
pnpm add @solana/wallet-adapter-react @solana/wallet-adapter-base @solana/web3.js
```

And Kit:

```bash
pnpm add @solana/kit
```

### Usage

#### 1. Get a Kit Signer (React)

```tsx
import { useKitSigner, useKitWallet } from '@selenus/kit-bridge-react';

function MyComponent() {
  // Just the signer
  const signer = useKitSigner();

  // Or: signer + address + capabilities in one call
  const { signer, address, connected, capabilities } = useKitWallet();
}
```

#### 2. Get a Kit Signer (Vanilla JS)

```ts
import { createKitSignerFromWalletAdapter } from '@selenus/kit-bridge-core';

const signer = createKitSignerFromWalletAdapter({
  publicKey: wallet.publicKey,
  signTransaction: wallet.signTransaction,
  signAllTransactions: wallet.signAllTransactions,
  connected: wallet.connected,
});
```

#### 3. Convert Types

```ts
import { publicKeyToAddress, legacyTxToKit } from '@selenus/kit-compat-utils';

const address = publicKeyToAddress(somePublicKey); // Kit Address
const kitTx = legacyTxToKit(someVersionedTransaction); // Kit Transaction
```

## Examples

[`examples/basic-react`](examples/basic-react/) is a minimal Vite + React app that connects a wallet and exposes a Kit signer. It shows the bridge surface (connect, read capabilities, get signer), not a full transaction flow.

```bash
cd examples/basic-react
pnpm install
pnpm dev
```

## Docs

- [Compatibility Guide](docs/compatibility.md): wallet support, SDK version matrix, architecture
- [Known Limitations](docs/known-limitations.md): signer types, branded types, error surface

## Architecture

```text
+--------------------------------------------------+
|                    Your dApp                      |
|                                                   |
|  +------------------+  +---------------------+   |
|  | wallet-adapter   |  |  @solana/kit APIs   |   |
|  | (existing)       |  |  (new)              |   |
|  +--------+---------+  +---------+-----------+   |
|           |                      |                |
|           +--------+  +----------+                |
|                    v  v                           |
|           +--------------------+                  |
|           |  Kit Bridge Core   |                  |
|           |  (signer adapter)  |                  |
|           +--------------------+                  |
+--------------------------------------------------+
```

## Why TransactionModifyingSigner?

Wallets like Phantom may modify transactions before signing (e.g. injecting compute budget instructions). The bridge cannot guarantee the transaction stays untouched, so it uses `TransactionModifyingSigner` instead of `TransactionPartialSigner`. This matches what `@solana/react` does.

## Non-Goals

This bridge does **not**:

- **Replace wallet-adapter.** It wraps it. You still need wallet-adapter for connection management.
- **Support Wallet Standard directly.** It targets the legacy wallet-adapter interface. Wallet Standard wallets work through their adapter compatibility layer.
- **Bridge `signMessage`.** Message signing is not part of the Kit signer interface.
- **Handle multi-signer flows.** The bridge assumes the wallet is the sole signer.
- **Preserve Kit branded type markers.** `TransactionWithLifetime` and similar brands are stripped during the wallet round-trip.

See [Known Limitations](docs/known-limitations.md) for details.

## Development

```bash
pnpm install     # Install dependencies
pnpm build       # Build all packages
pnpm test        # Run all tests
pnpm typecheck   # Type check
pnpm format      # Format
```

## License

Apache-2.0. See [LICENSE](LICENSE).

Built by [Selenus](https://github.com/QuarksBlueFoot/Selenus-solana-web3.js-to-Solana-Kit-bridge).
