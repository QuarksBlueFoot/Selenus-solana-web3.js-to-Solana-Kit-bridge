/**
 * @selenus/kit-bridge-react
 *
 * React hooks that bridge @solana/wallet-adapter-react to @solana/kit signers.
 * Zero UI components — these are pure logic hooks.
 *
 * Usage:
 * ```tsx
 * import { useKitSigner, useKitWallet } from '@selenus/kit-bridge-react';
 *
 * function MyComponent() {
 *   const signer = useKitSigner();
 *   const { capabilities, address, connected } = useKitWallet();
 *   // signer is a TransactionModifyingSigner<Address> | null
 * }
 * ```
 */
export { useKitSigner } from './useKitSigner.js';
export { useKitWallet } from './useKitWallet.js';
export { useWalletBridgeCapabilities } from './useWalletBridgeCapabilities.js';
export { KitBridgeProvider, useKitBridgeContext } from './KitBridgeProvider.js';
