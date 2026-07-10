# Explore Curaçao Cars — explorecuracaocars.com

White-label consumer car-rental marketplace for Curaçao. Lists car categories
from all rental companies that opted in on the SuaveCars platform; bookings are
category requests that land in the operating company's SuaveCars account.
Customers pay at pickup — the site never handles money.

Part of the SuaveCars marketplace program — see `MARKETPLACE_PLAN.md` in the
`suavecarssaas` repo for the full plan (fees, transparency, invoicing).

## Stack

- Vite + React + TypeScript, single hand-rolled stylesheet (design tokens in
  `src/styles.css` — rebrand = swap the tokens + wordmark).
- Backend: the public `marketplace-api` Supabase edge function
  (`lppyxeoskelndowurxay.supabase.co/functions/v1/marketplace-api`), keyless.
- Hosting: GitHub Pages via `.github/workflows/deploy.yml` (auto-deploys on
  push to `main`). For a custom domain later: add a `CNAME` file + configure
  the domain in repo Settings → Pages.

## Develop

```sh
npm install
npm run dev     # local dev server
npm run build   # type-check + production build to dist/
```
