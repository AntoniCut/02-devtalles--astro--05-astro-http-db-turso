# Desarrollo

Los textos detallados de cada script están en `package.json` → `scriptsDoc`.

## Dos modos de base de datos

| Modo | Comandos | Dónde viven los datos |
| :--- | :------- | :-------------------- |
| **Local** | `pnpm dev:local`, `pnpm db:push:local`, `pnpm db:seed:local` | SQLite `.astro/content.db` |
| **Turso** | `pnpm dev`, `pnpm db:push`, `pnpm db:seed` | Turso Cloud (requiere `.env`) |

### Por qué existe `dev:local`

Con `pnpm dev:local`, Astro arranca **sin** `--remote` y **sin** adapter Cloudflare en dev: libSQL puede usar `file:` en Node. El worker de Cloudflare no soporta URLs `file:` con el cliente web de libSQL.

Con `pnpm dev` (`--remote`), el comportamiento se acerca a producción: Turso + adapter Cloudflare y `db({ mode: "web" })` en `astro.config.mjs`.

Tras cambiar `astro.config.mjs`, reinicia el servidor de desarrollo.

## Comandos habituales

| Comando | Acción |
| :------ | :----- |
| `pnpm install` | Dependencias + parche de `@astrojs/db` |
| `pnpm dev:local` | Dev `:4321`, SQLite local |
| `pnpm dev` | Dev `:4321`, Turso |
| `pnpm db:push:local` / `pnpm db:push` | Sincronizar esquema local / remoto |
| `pnpm db:seed:local` / `pnpm db:seed` | Ejecutar `db/seed.dev.ts` |
| `pnpm build:remote` | Build de producción contra Turso |
| `pnpm preview` | Previsualizar build en `:4322` |
| `pnpm format` | Prettier + `scripts/post-prettier-style.mjs` |

No uses `pnpm build` (sin `--remote`) para desplegar: con Cloudflare + Astro DB suele fallar o no refleja producción.

## Servidor en segundo plano (Astro 6.4+)

```bash
astro dev --background
astro dev status
astro dev logs
astro dev stop
```

En este repo también: `pnpm dev` / `pnpm dev:local` (puerto 4321).

## Variables de entorno

| Archivo | Uso |
| :------ | :-- |
| `.env` | Turso en local: `db push --remote`, `build:remote`, `deploy` |
| `.env.production` | `SITE`, `BASE`, credenciales Turso en build |

```env
ASTRO_DB_REMOTE_URL=libsql://tu-base.region.turso.io
ASTRO_DB_APP_TOKEN=tu-token
```

No uses prefijo `PUBLIC_` en credenciales de Turso.

## Formato de código

- Prettier + `prettier-plugin-astro`
- Post-proceso: `scripts/post-prettier-style.mjs` (banner, líneas en blanco, frontmatter `.astro`)

Guías para agentes y humanos: `AGENTS.md`, `CLAUDE.md` en la raíz del repo.
