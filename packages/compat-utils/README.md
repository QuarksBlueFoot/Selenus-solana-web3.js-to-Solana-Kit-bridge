# @selenus/kit-compat-utils

> Conversion helpers between legacy `@solana/web3.js` and `@solana/kit` types.

## Installation

```bash
pnpm add @selenus/kit-compat-utils
```

## API

### Identity

```ts
import { publicKeyToAddress, addressToPublicKey } from '@selenus/kit-compat-utils';

const address = publicKeyToAddress(new PublicKey('...')); // → Kit Address
const pubkey = addressToPublicKey(address);               // → PublicKey
```

### Transactions

```ts
import { legacyTxToKit, kitTxToLegacy } from '@selenus/kit-compat-utils';

const kitTx = legacyTxToKit(versionedTransaction);   // → Kit Transaction
const legacyTx = kitTxToLegacy(kitTransaction);       // → VersionedTransaction
```

### Instructions

```ts
import { legacyInstructionToKit } from '@selenus/kit-compat-utils';

const kitIx = legacyInstructionToKit(legacyInstruction);
```

### Re-exports

For convenience, `@solana/compat` functions are re-exported:
- `fromLegacyPublicKey`
- `fromLegacyKeypair`
- `fromVersionedTransaction`
- `fromLegacyTransactionInstruction`

## Safety Notes

All conversions document whether they are lossless, lossy, or partial. Check each function's JSDoc for caveats.

## License

Apache-2.0
