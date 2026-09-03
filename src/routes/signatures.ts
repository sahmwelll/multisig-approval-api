import express from 'express';
import { addSignature } from '../services/multisig.service';

const router = express.Router();

// POST /signatures – add a signature to a proposal
router.post('/', async (req, res) => {
  try {
    const { proposalId, signerPublicKey, signatureB64 } = req.body;
    if (!proposalId || !signerPublicKey || !signatureB64) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const sig = await addSignature(proposalId, signerPublicKey, signatureB64);
    res.status(201).json(sig);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;