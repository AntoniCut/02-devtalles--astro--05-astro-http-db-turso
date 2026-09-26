# API y Postman

Documentación viva en la app: ruta `/api` (datos en `src/data/api-endpoints.ts`).

## Enfoque del curso (Likes)

| Método | Ruta | Descripción |
| :----- | :--- | :---------- |
| GET | `/api/posts/likes/:slug` | Lee likes desde tabla `Posts` (Turso) |
| POST | `/api/posts/likes/:slug` | Actualiza likes (SSR + Astro Actions opcional en UI) |

Colección principal: `postman/likes.postman_collection.json`.

## Clients (Astro DB)

CRUD SSR bajo `/api/clients/`:

- `GET /api/clients`
- `POST /api/clients`
- `GET|PUT|PATCH|DELETE /api/clients/:id`

Colección: `postman/clients.postman_collection.json`.

## Posts (contenido del blog)

Mezcla de endpoints estáticos (build) y mutaciones demo SSR:

- `GET /api/posts`, `POST /api/posts`
- `GET|PUT|PATCH|DELETE /api/posts/:slug`

Colección: `postman/posts.postman_collection.json`.

## Entornos Postman

| Archivo | `baseUrl` |
| :------ | :-------- |
| `local.postman_environment.json` | `http://localhost:4321` |
| `cloudflare.postman_environment.json` | Worker `05-astro-http-db-turso` |

> No confundir el worker **05-astro-http-db-turso** con el proyecto antiguo **05-astro-http**.

## Astro Actions

Acciones en `src/actions/` (likes, greeting). Snippets VS Code: `.vscode/astro-actions.code-snippets`.

## Componentes de likes

- `LikeCounter.vue` — fetch directo a la API
- `LikeCounterAction.vue` — vía Astro Actions

Ambos en entradas del blog según el layout/página.
