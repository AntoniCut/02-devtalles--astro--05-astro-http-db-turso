/*
    *  -----------------------------------------------------------  *
    *  -----  [slug].ts  --  /src/pages/api/posts/[slug].ts  -----  *
    *  -----------------------------------------------------------  *
 */

import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { getPostBySlug, jsonResponse } from "@/src/pages/api/posts/_helpers";


//  -----  modo estático: prerender true (por defecto) + getStaticPaths  -----

/**
 * --------------------------------
 * -----  `getStaticPaths()`  -----
 * --------------------------------
 * - Genera en build una ruta json por cada post del blog.
 */
export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getCollection("blog");

    return posts.map((post) => ({
        params: { slug: post.id },
    }));
};

/**
 * -------------------------------
 * -----  `GET({ params })`  -----
 * -------------------------------
 * - Devuelve un post concreto en formato json (generado en build).
 */
export const GET: APIRoute = async ({ params }) => {
    const post = await getPostBySlug(params.slug);

    if (post instanceof Response) {
        return post;
    }

    return jsonResponse(post);
};
