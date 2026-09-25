# Stack y requisitos

## Stack

| Capa | Tecnología |
| :--- | :--------- |
| Framework | **Astro 6.4.x** (necesario para `@astrojs/db`) |
| Base de datos | **Astro DB** + libSQL / **Turso** |
| Runtime producción | **Cloudflare Workers** (`@astrojs/cloudflare`) |
| UI parcial | **Vue 3** (contadores de likes) |
| Contenido | Content Collections (Markdown / MDX), RSS, sitemap |
| CI/CD | GitHub Actions + Wrangler |

> El proyecto hermano [05-astro-http](https://github.com/AntoniCut) usa Astro 7, donde `@astrojs/db` ya no está disponible. Este repo mantiene la misma idea del curso en Astro 6.

## Requisitos locales

- **Node.js** ≥ 22.12.0 (`package.json` → `engines`)
- **pnpm** (lockfile en el repo)
- Cuenta **Turso** para desarrollo remoto y producción
- Cuenta **Cloudflare** para deploy (token + account id)

## Dependencias destacadas

- `astro`, `@astrojs/db`, `@astrojs/cloudflare`, `@astrojs/vue`, `@astrojs/mdx`
- `wrangler` para deploy manual y CI
- Parche obligatorio: `patches/@astrojs__db@0.21.3.patch` (ver [[Turso-y-Astro-DB]])

## Alias y tipos

- TypeScript: alias `@/*` → raíz del proyecto (`tsconfig.json`)
- Tipos de dominio: `src/interfaces/types.ts`
- JavaScript con comprobación: `jsconfig.json` (`checkJs` en parte de `src/`)
