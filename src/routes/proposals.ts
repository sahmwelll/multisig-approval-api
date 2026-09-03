import express from 'express';
import { createProposal, getProposal } from '../services/multisig.service';
import { proposeValidator } from '../validators/proposal.validator';

const router = express.Router();

// POST /proposals – create a new multi-sig proposal
router.post('/', async (req, res) => {
  try {
    const { txXdr, threshold } = proposeValidator.parse(req.body);
    const proposal = await createProposal(txXdr, threshold);
    res.status(201).json(proposal);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /proposals/:id – get proposal details with its signatures
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const proposal = await getProposal(id);
    if (!proposal) return res.status(404).json({ error: 'Not found' });
    // Fetch signatures (could be in a separate route)
    const db = await require('../db').getDb();
    const signatures = await db.all('SELECT * FROM signatures WHERE proposal_id = ?', id);
    res.json({ ...proposal, signatures });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;