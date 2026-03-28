# Compatibility

## Wallet Support

The bridge works with any wallet that exposes `signTransaction` from `@solana/wallet-adapter-base`.

| Wallet | Status | Basis | Notes |
| ------ | ------ | ----- | ----- |
| Phantom | Expected | wallet-adapter interface | signTransaction + signAllTransactions |
| Solflare | Expected | wallet-adapter interface | signTransaction + signAllTransactions |
| Backpack | Expected | wallet-adapter interface | signTransaction + signAllTransactions |
| Ledger (via adapter) | Expected | wallet-adapter interface | signTransaction only, no batch |
| Other adapters | Expected | wallet-adapter interface | Any adapter exposing `signTransaction` |

"Expected" means compatibility is inferred from the wallet-adapter interface contract, not tested against specific wallet versions. If you hit a wallet-specific issue, [open an issue](https://github.com/QuarksBlueFoot/Selenus-solana-web3.js-to-Solana-Kit-bridge/issues).

`signAllTransactions` is not required. If the wallet provides it, the bridge uses it for batch signing (fewer round-trips). Otherwise it signs one transaction at a time.

## SDK Version Matrix

| Dependency | Required Version | Notes |
| ---------- | ---------------- | ----- |
| `@solana/kit` | `^6.5.0` | Transaction codec APIs |
| `@solana/compat` | `^6.5.0` | `fromLegacyPublicKey` |
| `@solana/web3.js` | `^1.98.0` | Legacy `VersionedTransaction` |
| `@solana/wallet-adapter-base` | `^0.9.23` | Wallet adapter types |
| `@solana/wallet-adapter-react` | `^0.15.35` | React hooks (bridge-react only) |
| React | `^18.0 \|\| ^19.0` | Peer dependency for bridge-react |

## How the Bridge Works

```text
+-----------------------------+
| createKitSignerFromWallet   |
| Adapter()                   |
|                             |
| 1. encodeTransaction()      |  Kit -> wire bytes
| 2. VersionedTransaction     |  wire bytes -> legacy tx
|    .deserialize()           |
| 3. wallet.signTransaction() |  wallet signs legacy tx
| 4. signedTx.serialize()     |  legacy tx -> wire bytes
| 5. decodeTransaction()      |  wire bytes -> Kit
+-----------------------------+
```

The round-trip through wire bytes is lossless. The same bytes go in and come out, plus any signatures the wallet adds. Kit's branded type markers (`TransactionWithLifetime`, `TransactionWithinSizeLimit`) are stripped during the round-trip because they only exist at the TypeScript level. This is why the signer uses `TransactionModifyingSigner` instead of `TransactionSigner`.

## Wallet Standard

The bridge targets the legacy wallet-adapter interface (`@solana/wallet-adapter-base`). It does not accept Wallet Standard (`@wallet-standard/base`) directly. Most wallets expose both interfaces, so this is rarely an issue in practice.

If Kit adds first-class Wallet Standard signer support, the bridge may add native support for it.
