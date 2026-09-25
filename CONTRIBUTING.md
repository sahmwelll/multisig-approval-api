# Contributing to Multi-Sig Approval API

Thank you for your interest in contributing! This is an open-source project and we welcome contributions of all kinds — bug fixes, new features, tests, documentation, and more.

---

## ✅ Before You Start

1. **Read the issue carefully.** Ask questions in the issue thread if anything is unclear.
2. **Check for existing PRs.** If someone else is already working on it, pick a different issue.
3. **Comment to claim it.** A short comment on the issue lets others know you're working on it.

---

## 🛠️ Development Workflow

### 1. Fork & clone

```bash
git clone https://github.com/sahmwelll/multisig-approval-api.git
cd multisig-approval-api
```

### 2. Install & configure

```bash
npm install
cp .env.example .env
```

### 3. Create a branch

```bash
git checkout -b feat/your-feature-name
```

**Branch naming:**

- `feat/` — new features
- `fix/` — bug fixes
- `docs/` — documentation
- `test/` — tests only
- `refactor/` — code restructuring

### 4. Make your changes

- Follow TypeScript strict mode.
- Keep changes focused — one issue per PR.
- Add tests for new functionality.

### 5. Verify locally

```bash
npm run build    # must compile without errors
npm test         # must pass all tests
npm run dev      # smoke test
```

### 6. Commit

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add webhook notifications on status change"
git commit -m "fix: correct signature verification for multisig threshold"
git commit -m "docs: update README with API examples"
```

### 7. Push & open a PR

```bash
git push origin feat/your-feature-name
```

Open a PR against `main` with:

- A clear **title** referencing the issue
- A **description** of what you did and how you tested it
- `Closes #<issue-number>` at the end

---

## 📋 PR Checklist

Before submitting, confirm:

- [ ] Code compiles (`npm run build` passes)
- [ ] Tests pass (`npm test` passes)
- [ ] Tests added or updated (if applicable)
- [ ] No `.env` or secrets committed
- [ ] PR references the issue (`Closes #123`)
- [ ] Branch is up to date with `main`
- [ ] Commit messages follow Conventional Commits

---

## 🎨 Code Style

- **TypeScript strict mode** — enabled in `tsconfig.json`
- **No `any` unless justified** — use proper types
- **Comments** — only where logic isn't self-explanatory
- **Prettier & ESLint** — will be enforced in CI as they land

---

## 🧪 Testing

Tests use [Vitest](https://vitest.dev). Run them with:

```bash
npm test         # run once
npm run test:watch   # watch mode (if configured)
```

When writing tests:

- Place them in `tests/` mirroring the `src/` structure
- Use descriptive names: `should submit transaction when threshold is met`
- Mock external dependencies (Stellar SDK, database) — see `tests/multisig.service.test.ts` for examples
- Prefer unit tests for services; integration tests for routes

---

## 🔀 Review Process

1. A maintainer reviews within **24–48 hours**
2. Reviewers may request changes — respond in the PR thread
3. Once approved, the PR is merged (usually squash-merged)
4. Your contribution is credited in the commit history

> ⚠️ If you claim an issue and go quiet for **3 days**, it may be released to other contributors.

---

## 🚫 What Not to Do

- Don't submit PRs for issues you haven't claimed
- Don't bundle multiple issues into one PR
- Don't include unrelated formatting or refactors
- Don't commit `node_modules`, `.env`, or `dist/`
- Don't plagiarize code without attribution

---

## 💬 Communication

- **GitHub Issues** — questions about specific tasks
- **PR Comments** — review feedback

---

## 📜 Code of Conduct

Be respectful. Follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

Harassment, discrimination, or toxic behavior will not be tolerated.

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

---

<div align="center">
  <sub>Happy building! 🚀</sub>
</div>