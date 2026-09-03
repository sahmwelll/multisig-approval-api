export interface Proposal {
  id: number;
  tx_xdr: string;
  threshold: number;
  status: 'pending' | 'ready' | 'submitted' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface Signature {
  id: number;
  proposal_id: number;
  signer_public_key: string;
  signature_b64: string;
  created_at: string;
}