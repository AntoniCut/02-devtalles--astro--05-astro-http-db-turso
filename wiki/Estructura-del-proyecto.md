# Estructura del proyecto

```text
├── db/
│   ├── config.ts          # Esquema Astro DB
│   └── seed.dev.ts        # Seed manual (no seed.ts)
├── patches/               # Parche @astrojs/db
├── postman/               # Colecciones y entornos
├── scripts/
│   ├── post-prettier-style.mjs
│   └── sync-github-wiki.sh
├── wiki/                  # Fuente del GitHub Wiki (esta documentación)
├── src/
│   ├── actions/           # Astro Actions
│   ├── components/
│   ├── content/blog/      # Posts del blog
│   ├── data/              # api-endpoints.ts (doc UI)
│   ├── interfaces/        # Tipos TS / JSDoc
│   ├── layouts/
│   ├── pages/
│   │   ├── api/           # Routes API
│   │   └── blog/
│   └── styles/
├── astro.config.mjs
├── wrangler.jsonc
├── AGENTS.md / CLAUDE.md  # Contexto para desarrollo asistido
└── README.md
```

## Convenciones

- **TypeScript** en lógica de servidor, actions y DB; **Astro** en páginas.
- Alias `@/*` para imports desde la raíz.
- Banners de archivo en `.ts`, `.js`, `.astro`, `.mjs` (ver skill de formato del autor).
- Blog: Content Collections; likes y clientes: Turso en runtime.

## Archivos de configuración clave

| Archivo | Rol |
| :------ | :-- |
| `astro.config.mjs` | Integraciones, adapter Cloudflare condicional, `db()` |
| `src/content.config.ts` | Colección del blog |
| `pnpm-workspace.yaml` | `patchedDependencies` |
| `.github/workflows/deploy.yml` | CI deploy |

## Extensiones `.mjs`

El repo usa `"type": "module"`. Los `.mjs` (p. ej. `astro.config.mjs`) marcan explícitamente ESM; con `"type": "module"`, `.js` también sería ESM. Ver nota en README / conversación del equipo sobre convención Astro + Node.
