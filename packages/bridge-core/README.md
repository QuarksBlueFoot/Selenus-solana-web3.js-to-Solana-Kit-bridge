# @selenus/kit-bridge-core

> Core signer adapter bridging `@solana/wallet-adapter` to `@solana/kit` signers.

## Installation

```bash
pnpm add @selenus/kit-bridge-core
```

## API

### `createKitSignerFromWalletAdapter(wallet)`

Creates a Kit `TransactionModifyingSigner` from a wallet-adapter wallet. Returns `null` if the wallet is not connected or lacks `signTransaction`.

```ts
import { createKitSignerFromWalletAdapter } from '@selenus/kit-bridge-core';

const signer = createKitSignerFromWalletAdapter({
  publicKey: wallet.publicKey,
  signTransaction: wallet.signTransaction,
  signAllTransactions: wallet.signAllTransactions,
  connected: wallet.connected,
});
```

### `detectWalletCapabilities(wallet)`

Returns a `WalletBridgeCapabilities` object describing what the wallet supports.

```ts
import { detectWalletCapabilities } from '@selenus/kit-bridge-core';

const caps = detectWalletCapabilities(wallet);
if (caps.canSignTransaction) { /* safe to create signer */ }
```

### Error Types

All errors extend `WalletBridgeError` and carry a `.code` string:

| Error | Code | When |
|-------|------|------|
| `WalletBridgeDisconnectedError` | `WALLET_DISCONNECTED` | Wallet disconnected mid-operation |
| `WalletBridgeUnsupportedOperationError` | `UNSUPPORTED_OPERATION` | Wallet lacks required capability |
| `WalletBridgeAccountChangedError` | `ACCOUNT_CHANGED` | PublicKey changed since signer creation |
| `WalletBridgeTransactionMutationError` | `TRANSACTION_MUTATED` | (Reserved) Transaction was modified |
| `WalletBridgeConversionError` | `CONVERSION_ERROR` | Type conversion failed |

## License

Apache-2.0
