import 'dotenv/config';
import * as StellarSDK from '@stellar/stellar-sdk';

const networkPassphrase =
  process.env.STELLAR_NETWORK === 'public'
    ? StellarSDK.Networks.PUBLIC
    : StellarSDK.Networks.TESTNET;

const HORIZON_URL =
  process.env.STELLAR_HORIZON_URL ||
  (process.env.STELLAR_NETWORK === 'public'
    ? 'https://horizon.stellar.org'
    : 'https://horizon-testnet.stellar.org');

const server = new StellarSDK.Horizon.Server(HORIZON_URL);

export async function buildTransaction(xdr: string): Promise<StellarSDK.Transaction> {
  const transaction = StellarSDK.TransactionBuilder.fromXDR(xdr, networkPassphrase);
  if (transaction instanceof StellarSDK.FeeBumpTransaction) {
    throw new Error('Fee bump transactions are not supported');
  }
  return transaction;
}

export async function submitTransaction(xdr: string): Promise<string> {
  const tx = StellarSDK.TransactionBuilder.fromXDR(xdr, networkPassphrase);
  const response = await server.submitTransaction(tx);
  return response.hash;
}

export function verifySignature(
  txXdr: string,
  publicKey: string,
  signatureB64: string
): boolean {
  try {
    const tx = StellarSDK.TransactionBuilder.fromXDR(txXdr, networkPassphrase);
    const keypair = StellarSDK.Keypair.fromPublicKey(publicKey);
    const signature = Buffer.from(signatureB64, 'base64');
    return keypair.verify(tx.signatureBase(), signature);
  } catch {
    return false;
  }
}