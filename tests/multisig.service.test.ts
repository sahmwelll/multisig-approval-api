import { describe, it, expect, vi } from 'vitest';
import { createProposal, getProposal, addSignature } from '../src/services/multisig.service';

// Mock the DB layer so tests don't need SQLite
vi.mock('../src/db', () => ({
  getDb: vi.fn().mockResolvedValue({
    run: vi.fn().mockResolvedValue({ lastID: 1 }),
    get: vi.fn().mockResolvedValue({
      id: 1,
      tx_xdr: 'AAAAAgAAAAA...',
      threshold: 2,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
    all: vi.fn().mockResolvedValue([]),
  }),
}));

// Mock the Stellar service so no real network calls happen
vi.mock('../src/services/stellar.service', () => ({
  submitTransaction: vi.fn().mockResolvedValue('FAKE_HASH'),
  verifySignature: vi.fn().mockReturnValue(true),
}));

describe('multisig.service', () => {
  it('should create a proposal with pending status', async () => {
    const proposal = await createProposal('AAAAAgAAAAA...', 2);
    expect(proposal).toBeDefined();
    expect(proposal.status).toBe('pending');
  });

  it('should retrieve a proposal by ID', async () => {
    const proposal = await getProposal(1);
    expect(proposal).toBeDefined();
    expect(proposal?.id).toBe(1);
  });

  it('should accept a valid signature', async () => {
    const sig = await addSignature(1, 'GABC...', 'MEUCIQ...');
    expect(sig).toBeDefined();
    expect(sig.proposal_id).toBe(1);
  });
});