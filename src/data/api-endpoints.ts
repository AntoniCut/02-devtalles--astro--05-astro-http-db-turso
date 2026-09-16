/*
    *  ---------------------------------------------------------------------  *
    *  -----  api-endpoints.ts  --  /src/data/api-endpoints.ts  -----  *
    *  ---------------------------------------------------------------------  *
 */

import type { ApiUseCase } from "@/src/interfaces/types";


/** - `casos de uso de la api del proyecto` */
export const API_USE_CASES: ApiUseCase[] = [
    {
        title: "01 — Lectura (GET estático)",
        description:
            "Endpoints prerenderizados en build. Puedes abrirlos directamente en el navegador.",
        endpoints: [
            {
                method: "GET",
                path: "/api/posts/list",
                title: "Listar todos los posts",
                description: "Devuelve la colección completa del blog en JSON.",
                mode: "static",
            },
            {
                method: "GET",
                path: "/api/posts/:slug",
                title: "Obtener post por slug",
                description: "Devuelve un post concreto por su slug.",
                mode: "static",
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
        description:
            "Requiere servidor Node en runtime. Prueba con Postman o curl.",
        endpoints: [
            {
                method: "POST",
                path: "/api/posts/mutate",
                title: "Crear post",
                description:
                    "Simula la creación de un post (demo, sin persistencia).",
                mode: "ssr",
                bodyExample: `{
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
                path: "/api/posts/mutations/first-post",
                title: "Actualizar post completo (PUT)",
                description: "Reemplaza los campos enviados en el body.",
                mode: "ssr",
                bodyExample: `{
  "title": "Título actualizado",
  "description": "Descripción actualizada"
}`,
            },
            {
                method: "PATCH",
                path: "/api/posts/mutations/first-post",
                title: "Actualizar post parcial (PATCH)",
                description: "Actualiza solo los campos enviados en el body.",
                mode: "ssr",
                bodyExample: `{
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
                path: "/api/posts/mutations/first-post",
                title: "Eliminar post",
                description: "No requiere body. El slug va en la URL.",
                mode: "ssr",
            },
        ],
    },
];
