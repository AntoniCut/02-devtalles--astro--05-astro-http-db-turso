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

### Variables de entorno

Crea un archivo `.env` en la raíz con las credenciales de Turso:

```env
ASTRO_DB_REMOTE_URL=
ASTRO_DB_APP_TOKEN=
```

No uses el prefijo `PUBLIC_` en estas variables.

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

Despliegue automático en push a `master` vía GitHub Actions. Secrets requeridos en el repositorio:

| Secret | Uso |
| :----- | :-- |
| `CLOUDFLARE_API_TOKEN` | Despliegue a Cloudflare Workers |
| `CLOUDFLARE_ACCOUNT_ID` | Cuenta de Cloudflare |
| `ASTRO_DB_REMOTE_URL` | URL de la base Turso |
| `ASTRO_DB_APP_TOKEN` | Token de acceso a Turso |

> Con Astro DB + Cloudflare, el build de CI usa `pnpm build:remote` y necesita las credenciales de Turso. Sin ellas, el workflow falla en el paso **Build**.

## Requisitos

- Node.js >= 22.12.0
- pnpm

## Créditos

Tema basado en [Bear Blog](https://github.com/HermanMartinus/bearblog/).
