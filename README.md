# Multi-sig Approval API

A backend service for managing Stellar multi-signature transaction workflows.

## Setup

1. Clone repo, install dependencies:

npm install

2. Copy `.env.example` to `.env` and adjust if needed.
3. Run migrations (automatically on first start).
4. Start dev server:


npm run dev

## API Endpoints

- `POST /proposals` – create a proposal (body: `{ txXdr, threshold }`)
- `GET /proposals/:id` – get proposal + signatures
- `POST /signatures` – add a signature (body: `{ proposalId, signerPublicKey, signatureB64 }`)

## Contributing

Check the Issues tab for tasks. Common improvements:
- Add authentication (API keys)
- Implement retry logic for submission failures
- Add webhook notifications on status changes
- Support for multiple networks
- Add pagination on proposals list

## Licensing

MIT