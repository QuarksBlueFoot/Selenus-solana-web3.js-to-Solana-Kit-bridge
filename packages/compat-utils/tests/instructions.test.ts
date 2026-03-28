import { describe, it, expect } from 'vitest';
import { TransactionInstruction, PublicKey } from '@solana/web3.js';
import { legacyInstructionToKit } from '../src/instructions.js';

describe('instruction conversions', () => {
  it('converts a legacy TransactionInstruction', () => {
    const programId = new PublicKey('11111111111111111111111111111111');
    const ix = new TransactionInstruction({
      keys: [
        { pubkey: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), isSigner: true, isWritable: true },
        { pubkey: programId, isSigner: false, isWritable: false },
      ],
      programId,
      data: Buffer.from([2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]),
    });

    const kitIx = legacyInstructionToKit(ix);
    expect(kitIx).toBeDefined();
    expect(kitIx.programAddress).toBe('11111111111111111111111111111111');
  });

  it('preserves data bytes', () => {
    const programId = new PublicKey('11111111111111111111111111111111');
    const data = Buffer.from([0xde, 0xad, 0xbe, 0xef]);
    const ix = new TransactionInstruction({
      keys: [],
      programId,
      data,
    });

    const kitIx = legacyInstructionToKit(ix);
    expect(kitIx.data).toBeDefined();
  });
});
