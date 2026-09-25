# Turso y Astro DB

## Esquema

Definido en `db/config.ts`:

| Tabla | Columnas | Uso en el curso |
| :---- | :------- | :-------------- |
| `Clients` | `id`, `name`, `age`, `isActive` | API CRUD `/api/clients/*` |
| `Posts` | `id` (slug), `title`, `likes` | Likes en runtime `/api/posts/likes/:slug` |

Referencia oficial (Astro 5, aún útil): [Astro DB](https://v5.docs.astro.build/en/guides/astro-db/).

## Turso Cloud

1. Crea la base en [app.turso.tech](https://app.turso.tech).
2. Copia **Database URL** (`libsql://…`).
3. Genera **token** (Create Token en el panel).

Sincroniza el esquema remoto (una vez o tras cambios en `db/config.ts`):

```bash
pnpm db:push
```

## Seed manual (`db/seed.dev.ts`)

En Astro 6.4, **no** uses `db/seed.ts`: Astro DB intenta ejecutarlo al arrancar `dev` y puede fallar (`environment.runner` undefined).

Este proyecto usa:

```bash
pnpm db:seed        # Turso
pnpm db:seed:local  # SQLite local
```

El seed inserta clientes de ejemplo y posts alineados con el blog, con likes aleatorios.

## Parche `@astrojs/db` + Cloudflare

`astro build --remote` puede fallar con `Invalid URL string` ([#16738](https://github.com/withastro/astro/issues/16738)). `db push --remote` puede seguir funcionando.

Fix aplicado vía `pnpm patch`:

- Archivo: `patches/@astrojs__db@0.21.3.patch`
- Registro: `pnpm-workspace.yaml` → `patchedDependencies`

Se aplica en cada `pnpm install`. Elimina el parche cuando una versión publicada de `@astrojs/db` incluya el fix ([#16939](https://github.com/withastro/astro/pull/16939)).

## Modo `web` de la integración DB

En `astro.config.mjs`, `db({ mode: "web" })` se usa cuando **no** es `dev:local` (Turso / worker). En dev local sin `--remote`, la integración va sin `mode: "web"` para SQLite en Node.
