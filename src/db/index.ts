import * as sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import * as path from 'path';

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!db) {
    const dbPath = process.env.DATABASE_URL || './data/db.sqlite';
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    await runMigrations(db);
  }
  return db;
}

async function runMigrations(db: Database) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS proposals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tx_xdr TEXT NOT NULL,
      threshold INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS signatures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      proposal_id INTEGER NOT NULL,
      signer_public_key TEXT NOT NULL,
      signature_b64 TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE
    );
  `);
}