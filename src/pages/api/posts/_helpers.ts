/*
    *  -----------------------------------------------------------  *
    *  -----  _helpers.ts  --  /src/pages/api/posts/_helpers.ts  -----  *
    *  -----------------------------------------------------------  *
 */

import type { CollectionEntry } from "astro:content";
import { getEntry } from "astro:content";


/** - `cabeceras json para respuestas de la api` */
const JSON_HEADERS = {
    "Content-Type": "application/json",
};

/**
 * --------------------------------
 * -----  `isJsonObject(value)`  -----
 * --------------------------------
 * - Comprueba si el valor es un objeto json plano.
 */
const isJsonObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};

/**
 * --------------------------------
 * -----  `jsonResponse(data, status)`  -----
 * --------------------------------
 * - Devuelve una respuesta json con el status indicado.
 */
export const jsonResponse = (data: unknown, status = 200): Response => {
    return new Response(JSON.stringify(data), {
        status,
        headers: JSON_HEADERS,
    });
};

/**
 * --------------------------------------------
 * -----  `errorResponse(message, status)`  -----
 * --------------------------------------------
 * - Devuelve una respuesta json de error.
 */
export const errorResponse = (message: string, status: number): Response => {
    return jsonResponse({ error: message }, status);
};

/**
 * --------------------------------
 * -----  `parseJsonBody(request)`  -----
 * --------------------------------
 * - Parsea el body json del request o devuelve un error 400.
 */
export const parseJsonBody = async (
    request: Request,
): Promise<Record<string, unknown> | Response> => {
    try {
        const body: unknown = await request.json();

        if (!isJsonObject(body)) {
            return errorResponse("Invalid JSON body", 400);
        }

        return body;
    } catch {
        return errorResponse("Invalid JSON body", 400);
    }
};

/**
 * --------------------------------
 * -----  `getPostBySlug(slug)`  -----
 * --------------------------------
 * - Obtiene un post por slug o devuelve una respuesta de error.
 */
export const getPostBySlug = async (
    slug: string | undefined,
): Promise<CollectionEntry<"blog"> | Response> => {
    if (slug === undefined) {
        return errorResponse("Slug is required", 400);
    }

    const post = await getEntry("blog", slug);

    if (!post) {
        return errorResponse(`Post "${slug}" not found`, 404);
    }

    return post;
};
