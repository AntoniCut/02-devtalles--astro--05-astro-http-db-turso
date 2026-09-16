/*
    *  -----------------------------------------------------------  *
    *  -----  mutate.ts  --  /src/pages/api/posts/mutate.ts  -----  *
    *  -----------------------------------------------------------  *
 */

import type { APIRoute } from "astro";
import { jsonResponse, parseJsonBody } from "@/src/pages/api/posts/_helpers";


/** - `modo ssr: las mutaciones se ejecutan en el servidor en cada request` */
export const prerender = false;

/**
 * -----------------------------------------
 * -----  `POST({ request })`  -----
 * -----------------------------------------
 * - Simula la creación de un nuevo post (demo, sin persistencia).
 */
export const POST: APIRoute = async ({ request }) => {
    const body = await parseJsonBody(request);

    if (body instanceof Response) {
        return body;
    }

    return jsonResponse(
        {
            method: "POST",
            ...body,
        },
        201,
    );
};
