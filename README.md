# Multi-Sig Approval API

> A backend service for managing **Stellar multi-signature transaction workflows** — propose transactions, collect signatures from multiple signers, and auto-submit to the Stellar network once a threshold is met.

[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org)
[![Stellar](https://img.shields.io/badge/Stellar-SDK-purple)](https://stellar.org)
[![CI](https://github.com/sahmwelll/multisig-approval-api/actions/workflows/ci.yml/badge.svg)](https://github.com/sahmwelll/multisig-approval-api/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Overview

Managing a shared Stellar treasury requires multiple people to approve transactions before they're broadcast. Stellar supports multi-signature accounts natively, but there is no standard **API layer** to coordinate the process between team members.

**Multi-Sig Approval API** solves that. It lets you:

- **Create proposals** — submit a transaction XDR with a signature threshold
- **Collect signatures** — signers approve via API or UI
- **Auto-submit** — once the threshold is met, the transaction is broadcast to Stellar automatically
- **Track status** — `pending` → `ready` → `submitted` (or `failed`)

Built for DAOs, teams, and businesses managing shared Stellar accounts.

---

## 🌟 Why Stellar?

Stellar's native multi-signature support is powerful but **low-level**. There's no standard way for a team to:

- Propose a transaction and have others review it
- Collect approvals asynchronously over hours or days
- Auto-submit once enough signatures are gathered
- Track the status of each proposal

This project provides the **missing coordination layer**. It's not a wallet, not a UI — it's the **API infrastructure** that any Stellar app can build on top of.

**Concrete use cases:**

| Use case | How it helps |
|----------|--------------|
| **DAO treasury management** | 3-of-5 council approves every large transfer before it goes on-chain |
| **Enterprise payment workflows** | Finance team requires 2-of-3 approvals for payments over $10k |
| **Shared account security** | Distribute keys across team members — no single point of failure |
| **Escrow & dispute resolution** | Neutral third party holds a signing key for arbitration |

**Stellar standards referenced:**

- [Signatures and Multisig](https://developers.stellar.org/docs/learn/fundamentals/transactions/signatures-and-multisig) — the on-chain primitives this API wraps
- [SEP-10: Stellar Authentication](https://developers.stellar.org/docs/learn/fundamentals/stellar-ecosystem-proposals/sep-0010) — planned for wallet authentication
- [SEP-24: Hosted Deposit and Withdrawal](https://developers.stellar.org/docs/learn/fundamentals/stellar-ecosystem-proposals/sep-0024) — planned for anchor integration
- [SEP-31: Cross-Border Payments](https://developers.stellar.org/docs/learn/fundamentals/stellar-ecosystem-proposals/sep-0031) — planned for B2B multi-sig payments

---

## 🏗️ Architecture

```
┌────────────────┐    POST /proposals     ┌─────────────────────┐
│  Client / UI   │ ─────────────────────► │  Express API        │
│                │                        │                     │
│                │    POST /signatures    │  ┌───────────────┐  │
│                │ ─────────────────────► │  │ Multisig Svc  │  │
└────────────────┘                        │  └───────┬───────┘  │
                                          │          │          │
                                          │   ┌──────▼───────┐  │
                                          │   │  SQLite DB   │  │
                                          │   └──────────────┘  │
                                          │          │          │
                                          │   ┌──────▼───────┐  │
                                          │   │ Stellar Svc  │──┼──► Horizon
                                          │   └──────────────┘  │
                                          └─────────────────────┘
```

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ |
| Language | TypeScript 5 |
| Framework | Express 4 |
| Database | SQLite (`sqlite` + `sqlite3`) — PostgreSQL migration planned |
| Stellar | `@stellar/stellar-sdk` |
| Validation | Zod |
| Testing | Vitest |
| CI | GitHub Actions |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ — [download](https://nodejs.org)
- **npm** 9+ (bundled with Node)

### 1. Clone

```bash
git clone https://github.com/sahmwelll/multisig-approval-api.git
cd multisig-approval-api
```

### 2. Install

```bash
npm install
```

### 3. Configure

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
DATABASE_URL=./data/db.sqlite
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
```

### 4. Run (dev)

```bash
npm run dev
```

Expected output:

```
Multi-sig API running on port 3000
```

### 5. Build (production)

```bash
npm run build
npm start
```

---

## 📡 API Reference

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/proposals` | Create a proposal |
| `GET` | `/proposals/:id` | Get proposal + signatures |
| `POST` | `/signatures` | Add a signature |

### Example: create a proposal

```bash
curl -X POST http://localhost:3000/proposals \
  -H "Content-Type: application/json" \
  -d '{"txXdr": "AAAAAgAAAAA...", "threshold": 2}'
```

### Example: add a signature

```bash
curl -X POST http://localhost:3000/signatures \
  -H "Content-Type: application/json" \
  -d '{
    "proposalId": 1,
    "signerPublicKey": "GABC...",
    "signatureB64": "MEUCIQ..."
  }'
```

### Data model

```sql
-- proposals table
id            INTEGER PRIMARY KEY
tx_xdr        TEXT NOT NULL        -- base64-encoded transaction envelope
threshold     INTEGER NOT NULL     -- signatures required for auto-submit
status        TEXT NOT NULL        -- pending | ready | submitted | failed
created_at    DATETIME
updated_at    DATETIME

-- signatures table
id                INTEGER PRIMARY KEY
proposal_id       INTEGER NOT NULL  -- FK to proposals
signer_public_key TEXT NOT NULL     -- Stellar public key (G...)
signature_b64     TEXT NOT NULL     -- base64 Ed25519 signature
created_at        DATETIME
```

---

## 📂 Project Structure

```
multisig-approval-api/
├── src/
│   ├── app.ts                       # Express app setup
│   ├── server.ts                    # Entry point
│   ├── db/                          # SQLite + migrations
│   ├── models/                      # TypeScript interfaces
│   ├── routes/                      # API endpoints
│   ├── services/                    # Business logic
│   ├── validators/                  # Zod schemas
│   └── utils/                       # Config helpers
├── tests/                           # Vitest test suite
├── .github/workflows/ci.yml         # CI pipeline
├── dist/                            # Compiled JS (gitignored)
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with auto-reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run production build |
| `npm test` | Run Vitest test suite |
| `npm run migrate` | Run DB migrations manually |

---

## 🔐 Security Model

- **Signature verification** — every signature is verified against the transaction XDR and the signer's public key before being stored. Invalid signatures are rejected with `400 Bad Request`.
- **Threshold enforcement** — the transaction is only submitted once the number of distinct signers meets the threshold.
- **No private keys** — this API never touches private keys. Signers sign client-side (e.g., Freighter) and submit the resulting base64 signature.
- **Environment isolation** — `.env` is gitignored; testnet and mainnet configurations are separated via `STELLAR_NETWORK`.

---

## 🗺️ Roadmap

Tracked as GitHub issues (filter by `wave-9` label):

**Stellar-specific**
- [ ] SEP-10 challenge/response wallet authentication
- [ ] SEP-24 anchor integration for fiat on/off-ramp funding
- [ ] SEP-31 cross-border payment flows
- [ ] Soroban smart contract transaction support
- [ ] Multi-asset support (USDC, EURC, other Stellar assets)

**Core infrastructure**
- [ ] API key authentication + JWT hybrid auth
- [ ] Webhook notifications on status change
- [ ] PostgreSQL migration with connection pooling
- [ ] Real-time WebSocket updates
- [ ] Dead-letter queue for failed submissions

**Quality & tooling**
- [ ] Full test suite (unit + integration + e2e)
- [ ] OpenAPI / Swagger documentation
- [ ] Docker + Kubernetes manifests
- [ ] Prometheus metrics endpoint
- [ ] Structured logging (pino)

---

## 🧪 Testing

```bash
npm test
```

Tests use [Vitest](https://vitest.dev) with mocked database calls — no external services required.

CI runs on every push and PR via [GitHub Actions](.github/workflows/ci.yml).

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidance.

**TL;DR:**

1. Browse open issues (label: `wave-9`)
2. Comment to claim one
3. Fork, branch, implement, test
4. Open a PR referencing the issue

All merged PRs during a Wave cycle earn **Points** that convert to USDC via [Drips](https://drips.network).

---

## 📊 Project Status

| Metric | Status |
|--------|--------|
| Build | ✅ Passing |
| Tests | ✅ Passing |
| CI | ✅ Configured |
| License | ✅ MIT |
| Docs | ✅ README + CONTRIBUTING + API reference |

---

## 📜 License

[MIT](./LICENSE) © 2026 sahmwelll

---

## 🔗 Related

- **Stellar SDK** — [stellar/js-stellar-sdk](https://github.com/stellar/js-stellar-sdk)
- **Stellar Docs** — [developers.stellar.org](https://developers.stellar.org)
- **Stellar Laboratory** — [laboratory.stellar.org](https://laboratory.stellar.org) (for building transaction XDRs)
- **Drips Wave** — [drips.network/wave/stellar](https://drips.network/wave/stellar)

<div align="center">
  <sub>Built for the Stellar ecosystem</sub>
</div>