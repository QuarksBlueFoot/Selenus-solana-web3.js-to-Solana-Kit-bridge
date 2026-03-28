/**
 * Basic example: connect a wallet and obtain a Kit TransactionModifyingSigner
 * via the Kit Bridge hooks.
 *
 * This example demonstrates the bridge surface — connecting, reading capabilities,
 * and getting a Kit-compatible signer. It does not execute transactions.
 *
 * Wallet discovery relies on Wallet Standard auto-detection (wallets installed
 * as browser extensions register themselves automatically). The empty array
 * passed to WalletProvider means no legacy adapters are manually added —
 * Wallet Standard wallets (Phantom, Solflare, Backpack, etc.) appear
 * automatically when installed.
 *
 * Prerequisites:
 *   pnpm add @solana/wallet-adapter-react @solana/wallet-adapter-react-ui
 *   pnpm add @solana/wallet-adapter-wallets @solana/web3.js @solana/kit
 *   pnpm add @selenus/kit-bridge-react
 */
import { useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { useKitSigner, useKitWallet } from '@selenus/kit-bridge-react';
import '@solana/wallet-adapter-react-ui/styles.css';

const DEVNET_RPC = 'https://api.devnet.solana.com';

function BridgeDemo() {
  const signer = useKitSigner();
  const { address, connected, capabilities, walletName } = useKitWallet();

  if (!connected || !signer) {
    return <p>Connect a wallet to continue.</p>;
  }

  return (
    <div>
      <h2>Bridge Status</h2>
      <table>
        <tbody>
          <tr>
            <td>Wallet</td>
            <td>{walletName}</td>
          </tr>
          <tr>
            <td>Kit Address</td>
            <td><code>{address}</code></td>
          </tr>
          <tr>
            <td>Signer type</td>
            <td><code>TransactionModifyingSigner</code></td>
          </tr>
          <tr>
            <td>Batch signing</td>
            <td>{capabilities.canSignAllTransactions ? 'supported' : 'not supported'}</td>
          </tr>
        </tbody>
      </table>
      <p>
        The <code>signer</code> object is a Kit-compatible{' '}
        <code>TransactionModifyingSigner&lt;Address&gt;</code>. Pass it to any
        Kit transaction-building pipeline ({' '}
        <code>setTransactionMessageFeePayerSigner</code>,{' '}
        <code>signAndSendTransactionMessageWithSigners</code>, etc.).
      </p>
    </div>
  );
}

export default function App() {
  // Empty array: wallets are discovered via Wallet Standard auto-detection.
  // Any Wallet Standard-compatible browser extension (Phantom, Solflare, etc.)
  // will appear automatically in the wallet modal.
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={DEVNET_RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'system-ui' }}>
            <h1>Kit Bridge — Basic React Example</h1>
            <WalletMultiButton />
            <hr />
            <BridgeDemo />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
