/*
    *  ---------------------------------------------------------------------------  *
    *  -----  [slug].ts  --  /src/pages/api/posts/mutations/[slug].ts  -----  *
    *  ---------------------------------------------------------------------------  *
 */

import type { APIRoute } from "astro";
import {


    getPostBySlug,
    jsonResponse,
    parseJsonBody,
} from "@/src/pages/api/posts/_helpers";

/** - `modo ssr: las mutaciones se ejecutan en el servidor en cada request` */
export const prerender = false;

/**
 * -----------------------------------------
 * -----  `PUT({ params, request })`  -----
 * -----------------------------------------
 * - Simula la actualización completa de un post (demo, sin persistencia).
 */
export const PUT: APIRoute = async ({ params, request }) => {
    const post = await getPostBySlug(params.slug);

    if (post instanceof Response) {
        return post;
    }

    const body = await parseJsonBody(request);

    if (body instanceof Response) {
        return body;
    }

    return jsonResponse({
        method: "PUT",
        slug: post.id,
        ...body,
    });
};

/**
 * ------------------------------------------
 * -----  `PATCH({ params, request })`  -----
 * ------------------------------------------
 * - Simula la actualización parcial de un post (demo, sin persistencia).
 */
export const PATCH: APIRoute = async ({ params, request }) => {
    const post = await getPostBySlug(params.slug);

    if (post instanceof Response) {
        return post;
    }

    const body = await parseJsonBody(request);

    if (body instanceof Response) {
        return body;
    }

    return jsonResponse({
        method: "PATCH",
        slug: post.id,
        ...body,
    });
};

/**
 * ----------------------------------
 * -----  `DELETE({ params })`  -----
 * ----------------------------------
 * - Simula la eliminación de un post (demo, sin persistencia).
 */
export const DELETE: APIRoute = async ({ params }) => {
    const post = await getPostBySlug(params.slug);

    if (post instanceof Response) {
        return post;
    }

    return jsonResponse({
        method: "DELETE",
        slug: post.id,
        message: `Post "${post.id}" deleted`,
    });
};
