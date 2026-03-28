# Known Limitations

## 1. TransactionModifyingSigner, not TransactionSigner

The bridge returns `TransactionModifyingSigner<Address>`, not `TransactionSigner<Address>`. Wallets like Phantom may inject compute budget instructions before signing, which mutates the transaction. The conservative type makes downstream code aware of this.

**Impact:** APIs that require a strict `TransactionSigner` will not accept this signer directly. You can cast, but that is unsafe if the wallet actually mutates the transaction.

## 2. Branded Kit Types Are Stripped

Kit uses branded types (`TransactionWithLifetime`, `TransactionWithinSizeLimit`, etc.) that exist only at the TypeScript level. The wire-format round-trip preserves all data, but the brands are lost because `decodeTransaction()` returns an unbranded `Transaction`.

**Impact:** If your code narrows to branded subtypes, you may need `as` casts after signing. The data is correct. Only the type marker is missing.

## 3. No Direct Wallet Standard Support

The bridge wraps `@solana/wallet-adapter-react`. It does not accept a Wallet Standard `SignTransactionFeature` directly. Most wallets provide both interfaces.

## 4. signMessage Is Not Bridged

`signMessage` (arbitrary message signing) is not part of the Kit signer interface. Use the wallet adapter's `signMessage` directly if you need it.

## 5. No Partial Signing / Multi-Signer Flows

The bridge assumes the wallet is the sole signer. If your transaction requires multiple signers (fee payer + authority, etc.), handle the orchestration yourself before passing the transaction to the bridge signer.

## 6. Account Change Invalidates the Signer

The signer captures the wallet's public key at creation time. If the user switches accounts, the signer throws `WalletBridgeAccountChangedError`. Create a new signer after an account switch.

## 7. Batch Signing Requires signAllTransactions

Batch signing uses `wallet.signAllTransactions` if available. If the wallet does not support it, the bridge signs one transaction at a time. This fallback works but is slower (one wallet popup per transaction on some wallets).

## 8. Error Surface

All wallet errors are normalized into the `WalletBridgeError` hierarchy:

| Error Class | Code | When |
| ----------- | ---- | ---- |
| `WalletBridgeDisconnectedError` | `WALLET_DISCONNECTED` | Wallet disconnects mid-flow |
| `WalletBridgeAccountChangedError` | `ACCOUNT_CHANGED` | Account switches mid-flow |
| `WalletBridgeUnsupportedOperationError` | `UNSUPPORTED_OPERATION` | Missing capability |
| `WalletBridgeConversionError` | `CONVERSION_ERROR` | Encode/decode failure |
| `WalletBridgeError` | `WALLET_ERROR` | Catch-all for unknown errors |

The original wallet error is preserved as `cause` on the normalized error.
