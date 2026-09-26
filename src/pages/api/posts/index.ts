/*
    *  ---------------------------------------------------------  *
    *  -----  index.ts  --  /src/pages/api/posts/index.ts  -----  *
    *  ---------------------------------------------------------  *
 */

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { jsonResponse, parseJsonBody } from "@/src/pages/api/posts/_helpers";


/** - `modo ssr: el listado y el alta se ejecutan en el servidor en cada request` */
export const prerender = false;

/**
 * ---------------------
 * -----  `GET()`  -----
 * ---------------------
 * - Devuelve todos los posts del blog en formato json.
 */
export const GET: APIRoute = async () => {
    /** - `colección blog` */
    const posts = await getCollection("blog");

    return jsonResponse(posts);
};

/**
 * ---------------------------------
 * -----  `POST({ request })`  -----
 * ---------------------------------
 * - Simula la creación de un nuevo post (demo, sin persistencia).
 */
export const POST: APIRoute = async ({ request }) => {
    /** - `parsear el body de la request` */
    const body = await parseJsonBody(request);

    //  -----  si el body no es válido, devolver un error 400  -----
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
