import { getDb } from '../db';
import { Proposal, Signature } from '../models/proposal.model';
import { submitTransaction, verifySignature } from './stellar.service';

export async function createProposal(txXdr: string, threshold: number): Promise<Proposal> {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO proposals (tx_xdr, threshold, status) VALUES (?, ?, ?)',
    txXdr,
    threshold,
    'pending'
  );
  const id = result.lastID as number;
  const proposal = await getProposal(id);
  if (!proposal) throw new Error('Failed to create proposal');
  return proposal;
}

export async function getProposal(id: number): Promise<Proposal | null> {
  const db = await getDb();
  const row = await db.get<Proposal>('SELECT * FROM proposals WHERE id = ?', id);
  return row || null;
}

export async function addSignature(
  proposalId: number,
  signerPublicKey: string,
  signatureB64: string
): Promise<Signature> {
  const db = await getDb();
  const proposal = await getProposal(proposalId);
  if (!proposal) throw new Error('Proposal not found');
  const isValid = verifySignature(proposal.tx_xdr, signerPublicKey, signatureB64);
  if (!isValid) throw new Error('Invalid signature');

  const result = await db.run(
    `INSERT INTO signatures (proposal_id, signer_public_key, signature_b64)
     VALUES (?, ?, ?)`,
    proposalId,
    signerPublicKey,
    signatureB64
  );
  const sigId = result.lastID as number;

  await tryAutoSubmit(proposalId);

  return {
    id: sigId,
    proposal_id: proposalId,
    signer_public_key: signerPublicKey,
    signature_b64: signatureB64,
    created_at: new Date().toISOString(),
  };
}

async function tryAutoSubmit(proposalId: number) {
  const proposal = await getProposal(proposalId);
  if (!proposal || proposal.status !== 'pending') return;

  const db = await getDb();
  const sigs = await db.all<{
    map(arg0: (s: any) => any): Iterable<unknown> | null | undefined; signer_public_key: string 
}>(
    'SELECT signer_public_key FROM signatures WHERE proposal_id = ?',
    proposalId
  );
  const distinctSigners = new Set(sigs.map(s => s.signer_public_key));
  if (distinctSigners.size >= proposal.threshold) {
    try {
      const txHash = await submitTransaction(proposal.tx_xdr);
      await db.run(
        'UPDATE proposals SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        'submitted',
        proposalId
      );
      console.log(`Proposal ${proposalId} submitted with hash ${txHash}`);
    } catch (err) {
      console.error(`Failed to submit proposal ${proposalId}:`, err);
      await db.run(
        'UPDATE proposals SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        'failed',
        proposalId
      );
      throw err;
    }
  }
}