# 05-astro-http-db-turso

Blog con API HTTP, basado en [05-astro-http](../05-astro-http/), preparado para el curso de **Astro DB** y **Turso**.

## Stack

- **Astro** 6.4.x (requerido para `@astrojs/db`)
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

## Estructura

```text
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
├── wrangler.jsonc
└── package.json
```

## Comandos

| Comando              | Acción                                              |
| :------------------- | :-------------------------------------------------- |
| `pnpm install`       | Instala dependencias                                |
| `pnpm dev`           | Servidor de desarrollo en `http://localhost:4321` |
| `pnpm build`         | Build de producción en `./dist/`                    |
| `pnpm preview`       | Preview local en `http://localhost:4322`            |
| `pnpm deploy`        | Build + despliegue a Cloudflare Workers             |
| `pnpm format`        | Formatea código con Prettier                        |
| `pnpm format:check`  | Comprueba formato sin modificar archivos            |

## Despliegue

- **Worker:** `devtalles-antonydev-astro-05-astro-http-db-turso`
- **URL:** https://devtalles-antonydev-astro-05-astro-http-db-turso.antonicut.workers.dev

Variables de entorno de producción (`.env.production`):

- `SITE` — URL canónica del sitio
- `BASE` — subruta de despliegue (`/` para workers.dev)

Despliegue manual:

```bash
pnpm deploy
```

Despliegue automático en push a `master` vía GitHub Actions (requiere `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` en los secrets del repositorio).

## Astro DB + Turso (curso)

Este proyecto está preparado para añadir la base de datos cuando empieces el módulo correspondiente:

```bash
pnpm astro add db
```

Crea un archivo `.env` en la raíz con las credenciales de Turso:

```env
ASTRO_DB_REMOTE_URL=
ASTRO_DB_APP_TOKEN=
```

Comandos habituales del curso:

```bash
pnpm astro db push
pnpm astro db seed
pnpm astro build --remote
```

## Requisitos

- Node.js >= 22.12.0
- pnpm

## Créditos

Tema basado en [Bear Blog](https://github.com/HermanMartinus/bearblog/).
