# @selenus/kit-bridge-react

> React hooks bridging `@solana/wallet-adapter-react` to `@solana/kit` signers. Zero UI, pure logic.

## Installation

```bash
pnpm add @selenus/kit-bridge-react @selenus/kit-bridge-core
```

## Hooks

### `useKitSigner()`

Returns a Kit `TransactionModifyingSigner` backed by the current wallet-adapter wallet, or `null` if not connected.

```tsx
const signer = useKitSigner();
```

### `useKitWallet()`

All-in-one: returns signer, address, capabilities, and connection status.

```tsx
const { signer, address, connected, capabilities, walletName } = useKitWallet();
```

### `useWalletBridgeCapabilities()`

Detailed capability flags for the current wallet.

```tsx
const caps = useWalletBridgeCapabilities();
if (caps.canSignAllTransactions) { /* batch signing available */ }
```

### `KitBridgeProvider` + `useKitBridgeContext()`

Optional React context provider for apps that prefer context over hooks.

```tsx
<KitBridgeProvider>
  <App />
</KitBridgeProvider>

// Inside App:
const { signer, address } = useKitBridgeContext();
```

## Requirements

Must be used inside a `WalletProvider` from `@solana/wallet-adapter-react`.

## License

Apache-2.0
