# Despliegue

## Worker

| Campo | Valor |
| :---- | :---- |
| Nombre | `devtalles-antonydev-astro-05-astro-http-db-turso` |
| URL | https://devtalles-antonydev-astro-05-astro-http-db-turso.antonicut.workers.dev |
| Config | `wrangler.jsonc` |

## Despliegue manual

```bash
pnpm deploy
```

Equivalente a `pnpm build:remote && wrangler deploy`. Requiere `.env` con Turso y credenciales Cloudflare para Wrangler.

Antes del **primer** deploy:

```bash
pnpm db:push
pnpm db:seed   # opcional
```

## CI (GitHub Actions)

Workflow: `.github/workflows/deploy.yml`

- **Trigger:** push a `master`
- **Pasos:** install → `pnpm build:remote` (con secrets Turso + `SITE`) → verificación de nombre de worker → `wrangler deploy`

### Secrets del repositorio

| Secret | Uso |
| :----- | :-- |
| `CLOUDFLARE_API_TOKEN` | Deploy Workers |
| `CLOUDFLARE_ACCOUNT_ID` | Cuenta Cloudflare |
| `ASTRO_DB_REMOTE_URL` | URL libSQL Turso |
| `ASTRO_DB_APP_TOKEN` | Token Turso |

### Verificación de worker

El job **Verify Cloudflare worker target** comprueba que `wrangler.jsonc` y `dist/server/wrangler.json` apuntan al mismo nombre, para no publicar en otro proyecto.

## Variables de producción

En `.env.production` (y secrets de CI para el build):

- `SITE` — URL canónica del sitio
- `BASE` — subruta (`/` en workers.dev)
- `ASTRO_DB_REMOTE_URL`, `ASTRO_DB_APP_TOKEN`

## Cabeceras estáticas

`public/_headers` — reglas para assets en Cloudflare Pages/Workers según tu config.
