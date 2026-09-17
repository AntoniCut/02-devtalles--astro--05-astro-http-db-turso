# 05-astro-http-db-turso

Blog con API HTTP, basado en [05-astro-http](../05-astro-http/), con **Astro DB** y **Turso** para el curso.

## Stack

- **Astro** 6.4.x (requerido para `@astrojs/db`)
- **Base de datos:** `@astrojs/db` + libSQL / Turso
- **Adapter:** Cloudflare Workers (`@astrojs/cloudflare`)
- **Contenido:** Markdown, MDX, Content Collections, RSS, sitemap
- **Despliegue:** Wrangler + GitHub Actions

> El proyecto original [05-astro-http](../05-astro-http/) usa **Astro 7**, donde `@astrojs/db` ya no está disponible. Este clon mantiene la misma funcionalidad en Astro 6 para seguir el curso.

## Características

- Blog con posts en `src/content/blog/`
- APIs JSON estáticas en `/api/posts/*`
- `ClientRouter` para transiciones de vista
- Alias `@/*` en TypeScript
- Formateo con Prettier + `prettier-plugin-astro`
- Astro DB instalado (`@astrojs/db`)

## Estructura

```text
├── db/
│   ├── config.ts       # Esquema de tablas
│   └── seed.dev.ts     # Datos iniciales (seed manual)
├── patches/
│   └── @astrojs__db@0.21.3.patch   # Fix build remoto + Cloudflare
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   ├── data/
│   ├── interfaces/
│   ├── layouts/
│   ├── pages/
│   │   └── api/
│   └── styles/
├── scripts/
├── astro.config.mjs
├── pnpm-workspace.yaml # patchedDependencies de @astrojs/db
├── wrangler.jsonc
└── package.json
```

## Comandos

| Comando              | Acción                                              |
| :------------------- | :-------------------------------------------------- |
| `pnpm install`       | Instala dependencias                                |
| `pnpm dev`           | Servidor de desarrollo en `http://localhost:4321` |
| `pnpm build`         | Build de producción en `./dist/`                    |
| `pnpm build:remote`  | Build conectado a Turso (`--remote`)                |
| `pnpm preview`       | Preview local en `http://localhost:4322`            |
| `pnpm deploy`        | Build + despliegue a Cloudflare Workers             |
| `pnpm db:push`       | Sincroniza el esquema de tablas con la BD local     |
| `pnpm db:seed`       | Inserta datos de prueba desde `db/seed.dev.ts`      |
| `pnpm format`        | Formatea código con Prettier                        |
| `pnpm format:check`  | Comprueba formato sin modificar archivos            |

## Astro DB + Turso

### Instalación

Astro DB ya está instalado en este proyecto. Si partieras de cero:

```bash
pnpm astro add db --yes
```

### Turso (base remota)

La base de datos vive en [Turso Cloud](https://app.turso.tech) (no en tu máquina). Crea la base desde el panel web o con la CLI de Turso y obtén:

- **Database URL** — formato `libsql://nombre-db-usuario.region.turso.io`
- **Token** — desde **Create Token** en el panel de la base

### Variables de entorno

| Archivo | Uso |
| :------ | :-- |
| `.env` | Comandos locales con Turso: `db push --remote`, `build:remote`, `deploy` |
| `.env.production` | Build de producción: `SITE`, `BASE` y credenciales Turso |

Ejemplo de `.env`:

```env
ASTRO_DB_REMOTE_URL=libsql://tu-base-usuario.region.turso.io
ASTRO_DB_APP_TOKEN=tu-token-aqui
```

No uses el prefijo `PUBLIC_` en estas variables.

> Los comandos `pnpm db:push` y `pnpm dev` usan una SQLite **local** y no necesitan Turso. Solo los comandos con `--remote` o `build:remote` requieren `.env`.

### Flujo de desarrollo

1. Define tablas en `db/config.ts`
2. Aplica el esquema: `pnpm db:push`
3. (Opcional) Carga datos de prueba: `pnpm db:seed`
4. Arranca el servidor: `pnpm dev`

Para producción con Turso:

```bash
pnpm astro db push --remote
pnpm db:seed -- --remote
pnpm build:remote
```

### Seed manual (Astro 6.4)

`@astrojs/db` está deprecado en Astro 6.4. Si existe un archivo `db/seed.ts`, Astro DB intenta ejecutarlo al arrancar `pnpm dev` y falla por incompatibilidad con Vite 7.

**Solución adoptada en este proyecto:** el seed vive en `db/seed.dev.ts` y se ejecuta manualmente con `pnpm db:seed`. No renombres ese archivo a `seed.ts`.

Documentación de referencia (Astro 5): https://v5.docs.astro.build/en/guides/astro-db/

### Parche `@astrojs/db` + Cloudflare

`astro build --remote` falla con `@astrojs/cloudflare` en `@astrojs/db@0.21.3` con el error `Invalid URL string` ([issue #16738](https://github.com/withastro/astro/issues/16738)). No es un problema de credenciales: `db push --remote` puede funcionar mientras el build remoto falla.

Este proyecto aplica el fix oficial ([PR #16939](https://github.com/withastro/astro/pull/16939)) mediante `pnpm patch`:

- `patches/@astrojs__db@0.21.3.patch`
- `pnpm-workspace.yaml` → `patchedDependencies`

Tras `pnpm install`, el parche se aplica automáticamente. Cuando `@astrojs/db` publique una versión con el fix, elimina el parche y actualiza la dependencia.

## Despliegue

- **Worker:** `devtalles-antonydev-astro-05-astro-http-db-turso`
- **URL:** https://devtalles-antonydev-astro-05-astro-http-db-turso.antonicut.workers.dev

Variables de entorno de producción (`.env.production`):

- `SITE` — URL canónica del sitio
- `BASE` — subruta de despliegue (`/` para workers.dev)
- `ASTRO_DB_REMOTE_URL` y `ASTRO_DB_APP_TOKEN` — credenciales Turso (también en `.env` para pruebas locales)

Despliegue manual:

```bash
pnpm deploy
```

Despliegue automático en push a `master` vía GitHub Actions (`.github/workflows/deploy.yml`):

1. `pnpm install --frozen-lockfile` (aplica el parche de `@astrojs/db`)
2. `pnpm build:remote` con credenciales Turso
3. `wrangler deploy`

Secrets requeridos en el repositorio:

| Secret | Uso |
| :----- | :-- |
| `CLOUDFLARE_API_TOKEN` | Despliegue a Cloudflare Workers |
| `CLOUDFLARE_ACCOUNT_ID` | Cuenta de Cloudflare |
| `ASTRO_DB_REMOTE_URL` | URL `libsql://...` de la base Turso |
| `ASTRO_DB_APP_TOKEN` | Token de acceso a Turso |

Antes del primer deploy, sincroniza el esquema remoto:

```bash
pnpm astro db push --remote
```

## Requisitos

- Node.js >= 22.12.0
- pnpm

## Créditos

Tema basado en [Bear Blog](https://github.com/HermanMartinus/bearblog/).
