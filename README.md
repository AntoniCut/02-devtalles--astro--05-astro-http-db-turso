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

- Blog con posts en `src/content/blog/` y transiciones de vista (`ClientRouter`, `transition:name` en imágenes del listado → detalle)
- **Content Collections** para el blog; **Astro DB + Turso** para datos de runtime
- Tablas `Clients` y `Posts` en `db/config.ts`; seed manual en `db/seed.dev.ts` (clientes + posts del blog con likes aleatorios)
- API **Clients** (CRUD SSR) en `/api/clients/*`
- API **Posts** (lectura del blog + mutaciones demo) en `/api/posts/*`
- API **Likes** (lectura desde tabla `Posts`) en `GET /api/likes/:id` — endpoint principal del curso para este repo
- Colecciones Postman en `postman/` (Local y Cloudflare): **Likes**, Clients, Posts
- Alias `@/*` en TypeScript; formateo con Prettier + `prettier-plugin-astro`

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
│   │       ├── clients/
│   │       ├── likes/
│   │       └── posts/
│   └── styles/
├── postman/            # Colecciones y entornos Postman
├── scripts/
├── astro.config.mjs
├── pnpm-workspace.yaml # patchedDependencies de @astrojs/db
├── wrangler.jsonc
└── package.json
```

## Comandos

Los textos largos de cada script están también en `package.json` → `scriptsDoc`.

| Comando | Acción |
| :------ | :----- |
| `pnpm install` | Instala dependencias (aplica el parche de `@astrojs/db`) |
| `pnpm dev` | Dev en `http://localhost:4321` con **Turso** (`astro dev --remote`). Modo habitual para API y likes. Requiere `.env`. |
| `pnpm dev:local` | Dev en `:4321` con SQLite local (`.astro/content.db`), sin Turso |
| `pnpm db:push` | Sincroniza el esquema de `db/config.ts` en **Turso** (`astro db push --remote`) |
| `pnpm db:seed` | Ejecuta `db/seed.dev.ts` en **Turso** (Clients + Posts desde el blog) |
| `pnpm db:seed:local` | Mismo seed en la base **local** (`astro db execute db/seed.dev.ts`) |
| `pnpm build` | `astro build` sin `--remote`. Con Cloudflare + Astro DB suele fallar; no uses este comando para desplegar |
| `pnpm build:remote` | Build de producción contra **Turso** (`astro build --remote`) → `./dist/` |
| `pnpm preview` | Sirve el último build en `http://localhost:4322` |
| `pnpm deploy` | `pnpm build:remote` + `wrangler deploy` al worker de Cloudflare |
| `pnpm astro …` | CLI de Astro (ej. `pnpm astro db push --remote`) |
| `pnpm format` | Prettier + `scripts/post-prettier-style.mjs` |
| `pnpm format:check` | Comprueba formato sin modificar archivos |

### Postman

Importa desde `postman/`:

| Archivo | Uso |
| :------ | :-- |
| `likes.postman_collection.json` | **Principal:** `GET /api/likes/:id` (un request por cada slug del blog + post inexistente) |
| `clients.postman_collection.json` | CRUD Clients |
| `posts.postman_collection.json` | API del blog (content collections) |
| `local.postman_environment.json` | `baseUrl` → `http://localhost:4321` |
| `cloudflare.postman_environment.json` | `baseUrl` → worker `05-astro-http-db-turso` |

> No confundas el worker **`05-astro-http-db-turso`** con el proyecto antiguo **`05-astro-http`** (otra URL en `*.workers.dev`).

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

| Modo | Comandos | Base de datos |
| :--- | :------- | :------------ |
| Desarrollo habitual (API, Turso) | `pnpm dev`, `pnpm db:push`, `pnpm db:seed` | Remota (Turso) — requiere `.env` |
| Desarrollo solo local | `pnpm dev:local`, `pnpm db:seed:local` | `.astro/content.db` (el esquema local se recrea al arrancar `dev:local`; `db push` del CLI apunta a remoto en este repo) |
| Producción / CI | `pnpm build:remote`, `pnpm deploy` | Turso + Cloudflare Worker |

### Flujo de desarrollo

1. Define tablas en `db/config.ts`
2. Aplica el esquema en Turso: `pnpm db:push`
3. (Opcional) Datos de prueba en Turso: `pnpm db:seed`
4. Arranca con Turso: `pnpm dev`
5. Prueba la API con Postman (entorno Local o Cloudflare) — colección **Likes**

Para producción:

```bash
pnpm db:push
pnpm db:seed
pnpm build:remote
# o en un paso:
pnpm deploy
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

| Paso | Qué hace |
| :--- | :------- |
| Checkout + pnpm + Node 22 | Entorno de CI |
| `pnpm install --frozen-lockfile` | Dependencias y parche `@astrojs/db` |
| `pnpm build:remote` | Build SSR contra Turso; `SITE` fijado a la URL del worker `05-astro-http-db-turso` |
| **Verify Cloudflare worker target** | Comprueba que `wrangler.jsonc` y `dist/server/wrangler.json` despliegan el mismo nombre de worker (evita publicar en el proyecto equivocado) |
| `wrangler deploy` | Sube el worker a Cloudflare |

Lo que incluye cada deploy exitoso (estado actual del repo):

- Blog estático/SSR, APIs **clients**, **posts** y **`GET /api/likes/:id`**
- Astro DB en runtime apuntando a Turso (tablas `Clients` y `Posts`)
- Adaptador Cloudflare (imágenes, KV de sesión según config)

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
