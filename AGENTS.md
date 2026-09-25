## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

This project also exposes `pnpm dev` (port 4321) via `package.json`.

## Project context

- **Astro 6.4.x** with `@astrojs/db` (deprecated in 6.4, removed in Astro 7)
- **Adapter:** `@astrojs/cloudflare`
- **Database:** libSQL / Turso via Astro DB
- **Schema:** `db/config.ts`
- **Seed:** `db/seed.dev.ts` — run manually with `pnpm db:seed`
- **Patch:** `patches/@astrojs__db@0.21.3.patch` — required for `build:remote` with Cloudflare

### Astro DB seed workaround

Do **not** create `db/seed.ts`. Astro DB auto-runs that filename on `dev` startup and crashes on Astro 6.4 (`environment.runner` is undefined). Keep seed logic in `db/seed.dev.ts` and use `pnpm db:seed`.

### Database scripts

| Script           | Command                              |
| :--------------- | :----------------------------------- |
| `pnpm db:push`   | Sync table schema to local DB        |
| `pnpm db:seed`   | Run `db/seed.dev.ts` manually        |
| `pnpm build:remote` | Production build against Turso    |

Remote Turso commands append `--remote` (e.g. `pnpm astro db push --remote`).

Local dev (`pnpm dev`, `pnpm db:push`) uses a local SQLite file and does **not** need Turso. Remote commands and `build:remote` require Turso credentials in `.env`.

### Turso setup

The database is hosted on [Turso Cloud](https://app.turso.tech), not locally. Create it in the dashboard (or via `turso` CLI), then copy:

- `ASTRO_DB_REMOTE_URL` — `libsql://...turso.io`
- `ASTRO_DB_APP_TOKEN` — from **Create Token** in the database panel

| File | Purpose |
| :--- | :------ |
| `.env` | Local remote commands: `db push --remote`, `build:remote`, `deploy` |
| `.env.production` | Production build vars: `SITE`, `BASE`, plus Turso credentials |

Do not use the `PUBLIC_` prefix for Turso vars.

### Cloudflare build patch

`astro build --remote` fails on `@astrojs/db@0.21.3` + `@astrojs/cloudflare` with `Invalid URL string` ([#16738](https://github.com/withastro/astro/issues/16738)). `db push --remote` may still succeed — this is not a credentials issue.

This repo applies the upstream fix ([#16939](https://github.com/withastro/astro/pull/16939)) via `pnpm patch`:

- Patch file: `patches/@astrojs__db@0.21.3.patch`
- Config: `pnpm-workspace.yaml` → `patchedDependencies`

Applied automatically on `pnpm install`. Remove the patch when a released `@astrojs/db` version includes the fix.

### CI / deploy

GitHub Actions (`.github/workflows/deploy.yml`) on push to `master`:

1. `pnpm install --frozen-lockfile`
2. `pnpm build:remote` with Turso secrets
3. `wrangler deploy`

Required GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `ASTRO_DB_REMOTE_URL`
- `ASTRO_DB_APP_TOKEN`

Run `pnpm astro db push --remote` once before the first deploy to sync the remote schema.

`db({ mode: "web" })` solo con `astro dev --remote`, `build --remote` y deploy. `pnpm dev:local` (`astro dev` sin `--remote`) omite el adapter Cloudflare y usa SQLite en Node (`.astro/content.db`); el worker no soporta URLs `file:`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Astro DB (v5 docs)](https://v5.docs.astro.build/en/guides/astro-db/)
- [Turso & Astro](https://docs.astro.build/en/guides/backend/turso/)
- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
