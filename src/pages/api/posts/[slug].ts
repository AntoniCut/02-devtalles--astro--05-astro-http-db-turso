/*
    *  -----------------------------------------------------------  *
    *  -----  [slug].ts  --  /src/pages/api/posts/[slug].ts  -----  *
    *  -----------------------------------------------------------  *
 */


import type { APIRoute } from "astro";
import {
    getPostBySlug,
    jsonResponse,
    parseJsonBody,
} from "@/src/pages/api/posts/_helpers";


/** - `modo ssr: el post se resuelve en el servidor en cada request` */
export const prerender = false;

/**
 * -------------------------------
 * -----  `GET({ params })`  -----
 * -------------------------------
 * - Devuelve un post concreto en formato json.
 */
export const GET: APIRoute = async ({ params }) => {
    /** - `obtener el post por slug` */
    const post = await getPostBySlug(params.slug);

    //  -----  si el post no existe, devolver un error 404  -----
    if (post instanceof Response) {
        return post;
    }

    return jsonResponse(post);
};

/**
 * ----------------------------------------
 * -----  `PUT({ params, request })`  -----
 * ----------------------------------------
 * - Simula la actualización completa de un post (demo, sin persistencia).
 */
export const PUT: APIRoute = async ({ params, request }) => {
    /** - `obtener el post por slug` */
    const post = await getPostBySlug(params.slug);

    //  -----  si el post no existe, devolver un error 404  -----
    if (post instanceof Response) {
        return post;
    }

    /** - `parsear el body de la request` */
    const body = await parseJsonBody(request);

    //  -----  si el body no es válido, devolver un error 400  -----
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
    /** - `obtener el post por slug` */
    const post = await getPostBySlug(params.slug);

    //  -----  si el post no existe, devolver un error 404  -----
    if (post instanceof Response) {
        return post;
    }

    /** - `parsear el body de la request` */
    const body = await parseJsonBody(request);

    //  -----  si el body no es válido, devolver un error 400  -----
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
    /** - `obtener el post por slug` */
    const post = await getPostBySlug(params.slug);

    //  -----  si el post no existe, devolver un error 404  -----
    if (post instanceof Response) {
        return post;
    }

    return jsonResponse({
        method: "DELETE",
        slug: post.id,
        message: `Post "${post.id}" deleted`,
    });
};
