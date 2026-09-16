/*
    *  -------------------------------------------------------  *
    *  -----  list.ts  --  /src/pages/api/posts/list.ts  -----  *
    *  -------------------------------------------------------  *
 */

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { jsonResponse } from "@/src/pages/api/posts/_helpers";


//  -----  modo estático: prerender true (por defecto)  -----

/**
 * ----------------------------------------
 * -----  `GET()`  -----
 * ----------------------------------------
 * - Devuelve todos los posts del blog en formato json (generado en build).
 */
export const GET: APIRoute = async () => {
    const posts = await getCollection("blog");

    return jsonResponse(posts);
};
