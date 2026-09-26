## Desarrollo

Para arrancar el servidor en segundo plano:

```
astro dev --background
```

Gestiónalo con `astro dev stop`, `astro dev status` y `astro dev logs`.

Este proyecto expone estos scripts en `package.json` (puerto 4321):

| Script | Destino |
| :----- | :------ |
| `pnpm dev` | Turso (`astro dev --remote`). Requiere `.env` |
| `pnpm dev:local` | SQLite local (`.astro/content.db`) en Node, sin adapter Cloudflare |

El worker de Cloudflare no abre URLs `file:`. `pnpm dev:local` omite el adapter y usa Node para que libSQL lea el archivo local. `db({ mode: "web" })` se usa en `astro dev --remote`, `build --remote` y en el deploy.

## Contexto del proyecto

- **Astro 6.4.x** con `@astrojs/db` (deprecado en 6.4, eliminado en Astro 7)
- **Adapter:** `@astrojs/cloudflare`
- **Base de datos:** libSQL / Turso vía Astro DB
- **Esquema:** `db/config.ts`
- **Seed:** `db/seed.dev.ts`, a mano con `pnpm db:seed` o `pnpm db:seed:local`
- **Parche:** `patches/@astrojs__db@0.21.3.patch`, necesario para `build:remote` con Cloudflare

### Seed de Astro DB

El seed vive solo en `db/seed.dev.ts`. Un archivo `db/seed.ts` hace que Astro DB lo ejecute al arrancar `dev` y falle en Astro 6.4 (`environment.runner` es `undefined`).

### Scripts de base de datos

| Script | Qué hace |
| :----- | :------- |
| `pnpm db:push:local` | Esquema en la base local |
| `pnpm db:seed:local` | Ejecuta `db/seed.dev.ts` en la base local |
| `pnpm db:push` | Esquema en Turso (`--remote`) |
| `pnpm db:seed` | Ejecuta `db/seed.dev.ts` en Turso (`--remote`) |
| `pnpm build:remote` | Build de producción contra Turso |

Los comandos remotos llevan `--remote` (por ejemplo `pnpm astro db push --remote`). `pnpm db:push` y `pnpm db:seed` ya lo incluyen. Esos comandos y `build:remote` necesitan las credenciales de Turso en `.env`.

### API

Rutas SSR (`prerender = false`). Los helpers viven en `_helpers.ts` y Astro no los publica como endpoint.

| Recurso | Colección | Elemento |
| :------ | :-------- | :------- |
| Clients | `GET` y `POST` `/api/clients` (`index.ts`) | `GET`, `PUT`, `PATCH` y `DELETE` `/api/clients/:id` (`[id].ts`) |
| Posts | `GET` y `POST` `/api/posts` (`index.ts`) | `GET`, `PUT`, `PATCH` y `DELETE` `/api/posts/:slug` (`[slug].ts`) |
| Likes | | `GET` y `POST` `/api/posts/likes/:slug` |

Las mutaciones de posts son una demo y no persisten. Likes y clients sí escriben en Astro DB. La documentación de la app está en `src/data/api-endpoints.ts` (página `/api`). Las colecciones de Postman están en `postman/`.

### Turso

La base está en [Turso Cloud](https://app.turso.tech). Créala en el panel (o con la CLI `turso`) y copia:

- `ASTRO_DB_REMOTE_URL` — `libsql://...turso.io`
- `ASTRO_DB_APP_TOKEN` — desde **Create Token** en el panel de la base

| Archivo | Uso |
| :------ | :-- |
| `.env` | Comandos locales contra Turso: `db push --remote`, `build:remote`, `deploy` |
| `.env.production` | Build de producción: `SITE`, `BASE` y credenciales Turso |

Estas variables van sin el prefijo `PUBLIC_`.

### Parche de build en Cloudflare

`astro build --remote` falla con `@astrojs/db@0.21.3` y `@astrojs/cloudflare` (`Invalid URL string`, [#16738](https://github.com/withastro/astro/issues/16738)). `db push --remote` puede funcionar igual: el fallo es del build, y las credenciales pueden estar bien.

Este repo aplica el arreglo de [#16939](https://github.com/withastro/astro/pull/16939) con `pnpm patch`:

- Parche: `patches/@astrojs__db@0.21.3.patch`
- Configuración: `pnpm-workspace.yaml` → `patchedDependencies`

Se aplica solo con `pnpm install`. Quita el parche cuando una versión publicada de `@astrojs/db` incluya el arreglo.

### CI / deploy

GitHub Actions (`.github/workflows/deploy.yml`) en cada push a `master`:

1. `pnpm install --frozen-lockfile`
2. `pnpm build:remote` con los secrets de Turso
3. Comprueba que `wrangler.jsonc` y `dist/server/wrangler.json` despliegan el mismo worker
4. `wrangler deploy`

Secrets del repositorio:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `ASTRO_DB_REMOTE_URL`
- `ASTRO_DB_APP_TOKEN`

Antes del primer deploy, sincroniza el esquema remoto una vez: `pnpm astro db push --remote`.

## Documentación

Documentación de Astro: https://docs.astro.build

Consulta estas guías antes de tareas relacionadas:

- [Astro DB (docs v5)](https://v5.docs.astro.build/en/guides/astro-db/)
- [Turso y Astro](https://docs.astro.build/en/guides/backend/turso/)
- [Páginas, rutas dinámicas y middleware](https://docs.astro.build/en/guides/routing/)
- [Componentes de Astro](https://docs.astro.build/en/basics/astro-components/)
- [Componentes de React, Vue, Svelte u otros](https://docs.astro.build/en/guides/framework-components/)
- [Contenido y content collections](https://docs.astro.build/en/guides/content-collections/)
- [Estilos y Tailwind](https://docs.astro.build/en/guides/styling/)
- [Varios idiomas](https://docs.astro.build/en/guides/internationalization/)
