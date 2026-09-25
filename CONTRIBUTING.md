# Contributing to Drive Curaçao

This project uses a small, safe branch-and-PR workflow so changes can be reviewed and checked before they reach production.

## Standard workflow

1. Create a branch from `main`.
2. Make one focused change per branch.
3. Open a pull request into `main`.
4. Wait for CI to pass.
5. Review the change and merge only after approval.

Avoid direct pushes to `main` for normal work.

## Required checks

Every pull request should pass the GitHub Actions CI workflow:

- `npm ci --no-audit --no-fund`
- `npm audit --audit-level=moderate`
- `npm run build`

The audit check blocks moderate-or-higher dependency advisories before they reach `main`.

## Local validation

Before opening a PR, run:

```sh
npm ci --no-audit --no-fund
npm audit --audit-level=moderate
npm run build
```

## Security and secrets

- Do not commit secrets, API keys, credentials, or `.env` files.
- Keep public API usage intentional; the marketplace API is public/keyless by design.
- Use GitHub pull requests for dependency upgrades so CI validates the result.

## Recommended branch protection

Repository admins should protect `main` with these rules:

- Require a pull request before merging.
- Require status check `Typecheck and build` to pass.
- Block direct pushes to `main`.
- Optionally require conversation resolution before merge.

Partner currently has write access, not admin access, so an admin such as Jaïr may need to enable these rules in GitHub settings.
