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

### Astro DB seed workaround

Do **not** create `db/seed.ts`. Astro DB auto-runs that filename on `dev` startup and crashes on Astro 6.4 (`environment.runner` is undefined). Keep seed logic in `db/seed.dev.ts` and use `pnpm db:seed`.

### Database scripts

| Script           | Command                              |
| :--------------- | :----------------------------------- |
| `pnpm db:push`   | Sync table schema to local DB        |
| `pnpm db:seed`   | Run `db/seed.dev.ts` manually        |
| `pnpm build:remote` | Production build against Turso    |

Remote Turso commands append `--remote` (e.g. `pnpm astro db push --remote`).

Turso env vars in `.env`:

```env
ASTRO_DB_REMOTE_URL=
ASTRO_DB_APP_TOKEN=
```

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
