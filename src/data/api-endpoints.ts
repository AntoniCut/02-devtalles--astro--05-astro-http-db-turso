/*
    *  ---------------------------------------------------------------------  *
    *  -----  api-endpoints.ts  --  /src/data/api-endpoints.ts  -----  *
    *  ---------------------------------------------------------------------  *
 */

import type { ApiSection, ApiUseCase } from "@/src/interfaces/types";


/** - `casos de uso de la api de posts` */
export const POSTS_USE_CASES: ApiUseCase[] = [
    {
        title: "01 — Lectura (GET SSR)",
        description:
            "Lectura de la colección del blog. Puedes abrir los GET en el navegador.",
        endpoints: [
            {
                method: "GET",
                path: "/api/posts",
                title: "Listar todos los posts",
                description: "Devuelve la colección completa del blog en JSON.",
                mode: "ssr",
            },
            {
                method: "GET",
                path: "/api/posts/:slug",
                title: "Obtener post por slug",
                description: "Devuelve un post concreto por su slug.",
                mode: "ssr",
                relatedLinks: [
                    { label: "first-post", path: "/api/posts/first-post" },
                    { label: "second-post", path: "/api/posts/second-post" },
                    { label: "third-post", path: "/api/posts/third-post" },
                    {
                        label: "markdown-style-guide",
                        path: "/api/posts/markdown-style-guide",
                    },
                    { label: "using-mdx", path: "/api/posts/using-mdx" },
                ],
            },
            {
                method: "GET",
                path: "/api/get-person.json",
                title: "Get person (demo)",
                description: "Endpoint de ejemplo con datos de una persona.",
                mode: "static",
            },
        ],
    },

    {
        title: "02 — Creación (POST SSR)",
        description: "Requiere servidor en runtime. Prueba con Postman o curl.",
        endpoints: [
            {
                method: "POST",
                path: "/api/posts",
                title: "Crear post",
                description:
                    "Simula la creación de un post (demo, sin persistencia).",
                mode: "ssr",
                bodyExample: `
                    {
                        "title": "Nuevo post",
                        "description": "Descripción de prueba"
                    }`,
            },
        ],
    },

    {
        title: "03 — Actualización (PUT / PATCH SSR)",
        description: "Actualiza un post existente por slug en la URL.",
        endpoints: [
            {
                method: "PUT",
                path: "/api/posts/first-post",
                title: "Actualizar post completo (PUT)",
                description: "Reemplaza los campos enviados en el body.",
                mode: "ssr",
                bodyExample: `
                    {
                        "title": "Título actualizado",
                        "description": "Descripción actualizada"
                    }`,
            },
            {
                method: "PATCH",
                path: "/api/posts/first-post",
                title: "Actualizar post parcial (PATCH)",
                description: "Actualiza solo los campos enviados en el body.",
                mode: "ssr",
                bodyExample: `
                    {
                        "description": "Solo cambio la descripción"
                    }`,
            },
        ],
    },

    {
        title: "04 — Eliminación (DELETE SSR)",
        description: "Simula el borrado de un post por slug.",
        endpoints: [
            {
                method: "DELETE",
                path: "/api/posts/first-post",
                title: "Eliminar post",
                description: "No requiere body. El slug va en la URL.",
                mode: "ssr",
            },
        ],
    },

    {
        title: "05 — Likes (GET / POST SSR + Astro DB)",
        description:
            "Likes persistidos en la tabla Posts (Turso). Requiere runtime (`pnpm dev --remote` o Worker). Usado por el componente LikeCounter en el blog.",
        endpoints: [
            {
                method: "GET",
                path: "/api/posts/likes/:slug",
                title: "Obtener likes de un post",
                description:
                    'Devuelve `{ id, title, likes }`. Si el slug no está en Turso, responde 200 con `title: "Post not found"` y `likes: 0` (sin insertar).',
                mode: "ssr",
                relatedLinks: [
                    {
                        label: "first-post",
                        path: "/api/posts/likes/first-post",
                    },
                    {
                        label: "second-post",
                        path: "/api/posts/likes/second-post",
                    },
                    {
                        label: "third-post",
                        path: "/api/posts/likes/third-post",
                    },
                    {
                        label: "markdown-style-guide",
                        path: "/api/posts/likes/markdown-style-guide",
                    },
                    {
                        label: "using-mdx",
                        path: "/api/posts/likes/using-mdx",
                    },
                    {
                        label: "no-existe (demo)",
                        path: "/api/posts/likes/no-existe",
                    },
                ],
            },
            {
                method: "POST",
                path: "/api/posts/likes/:slug",
                title: "Incrementar likes (o crear post en Turso)",
                description:
                    "Si el slug no existe en la tabla Posts, lo crea e incrementa likes. Respuesta: texto `Ok!`.",
                mode: "ssr",
                bodyExample: `
                    {
                        "likes": 1
                    }`,
            },
        ],
    },
];

/** - `casos de uso de la api de clients` */
export const CLIENTS_USE_CASES: ApiUseCase[] = [
    {
        title: "01 — Lectura (GET SSR + Astro DB)",
        description:
            "Lectura real sobre la tabla Clients. Requiere servidor en runtime.",
        endpoints: [
            {
                method: "GET",
                path: "/api/clients",
                title: "Listar clientes",
                description:
                    "Devuelve todos los registros de la tabla Clients.",
                mode: "ssr",
            },
            {
                method: "GET",
                path: "/api/clients/:id",
                title: "Obtener cliente por id",
                description: "Devuelve un cliente concreto por su id numérico.",
                mode: "ssr",
                relatedLinks: [
                    { label: "cliente 1", path: "/api/clients/1" },
                    { label: "cliente 2", path: "/api/clients/2" },
                    { label: "cliente 3", path: "/api/clients/3" },
                    { label: "cliente 4", path: "/api/clients/4" },
                    { label: "cliente 5", path: "/api/clients/5" },
                ],
            },
        ],
    },

    {
        title: "02 — Creación (POST SSR + Astro DB)",
        description: "Inserta un cliente en Turso. Prueba con Postman o curl.",
        endpoints: [
            {
                method: "POST",
                path: "/api/clients",
                title: "Crear cliente",
                description: "Inserta un nuevo cliente en Astro DB.",
                mode: "ssr",
                bodyExample: `
                    {
                        "name": "Laura Martínez",
                        "age": 29,
                        "isActive": true
                    }`,
            },
        ],
    },

    {
        title: "03 — Actualización (PUT / PATCH SSR + Astro DB)",
        description: "Actualiza un cliente existente por id en la URL.",
        endpoints: [
            {
                method: "PUT",
                path: "/api/clients/1",
                title: "Reemplazar cliente (PUT)",
                description: "Actualiza todos los campos del cliente indicado.",
                mode: "ssr",
                bodyExample: `
                    {
                        "name": "Laura Martínez",
                        "age": 30,
                        "isActive": false
                    }`,
            },
            {
                method: "PATCH",
                path: "/api/clients/1",
                title: "Actualizar cliente parcial (PATCH)",
                description: "Actualiza solo los campos enviados en el body.",
                mode: "ssr",
                bodyExample: `
                    {
                        "isActive": true
                    }`,
            },
        ],
    },

    {
        title: "04 — Eliminación (DELETE SSR + Astro DB)",
        description: "Borra un cliente por id en la base de datos.",
        endpoints: [
            {
                method: "DELETE",
                path: "/api/clients/1",
                title: "Eliminar cliente",
                description: "No requiere body. El id va en la URL.",
                mode: "ssr",
            },
        ],
    },
];

/** - `secciones principales de la documentación api` */
export const API_SECTIONS: ApiSection[] = [
    {
        id: "posts",
        title: "Posts",
        description:
            "Endpoints del blog: lectura de content collections, mutaciones demo sin persistencia y likes en Turso bajo `/api/posts/likes/:slug`.",
        useCases: POSTS_USE_CASES,
    },

    {
        id: "clients",
        title: "Clients",
        description:
            "CRUD real sobre la tabla Clients con Astro DB y Turso. Todas las rutas requieren servidor en runtime.",
        useCases: CLIENTS_USE_CASES,
    },
];
