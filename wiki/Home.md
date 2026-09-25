# Wiki — 05-astro-http-db-turso

Blog con API HTTP para el curso **DevTalles**: Astro 6, Astro DB, Turso y despliegue en Cloudflare Workers.

## Enlaces rápidos

| Página | Contenido |
| :----- | :-------- |
| [[Stack-y-requisitos]] | Versiones, dependencias y Node |
| [[Desarrollo]] | Comandos `pnpm`, local vs remoto |
| [[Turso-y-Astro-DB]] | Esquema, seed, parche Cloudflare |
| [[API-y-Postman]] | Endpoints y colecciones |
| [[Despliegue]] | Wrangler, CI y secrets |
| [[Estructura-del-proyecto]] | Carpetas y convenciones |
| [[Publicar-en-GitHub]] | Sincronizar esta carpeta con GitHub Wiki |

## URLs del proyecto

| Entorno | URL |
| :------ | :-- |
| Producción (Worker) | https://devtalles-antonydev-astro-05-astro-http-db-turso.antonicut.workers.dev |
| Repositorio | https://github.com/AntoniCut/02-devtalles--astro--05-astro-http-db-turso |

## Flujo típico (Turso)

1. Configura `.env` con `ASTRO_DB_REMOTE_URL` y `ASTRO_DB_APP_TOKEN`.
2. `pnpm db:push` → esquema en Turso.
3. `pnpm db:seed` → datos de prueba (`Clients`, `Posts` con likes).
4. `pnpm dev` → servidor en `:4321` contra Turso.
5. Prueba **Likes** con Postman (`postman/likes.postman_collection.json`).

Documentación extendida en el [README](https://github.com/AntoniCut/02-devtalles--astro--05-astro-http-db-turso/blob/master/README.md) del repositorio.
