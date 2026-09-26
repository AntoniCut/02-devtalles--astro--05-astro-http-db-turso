/*
    *  ---------------------------------------------------  *
    *  -----  rss.xml.js  --  /src/pages/rss.xml.js  -----  *
    *  ---------------------------------------------------  *
 */

/// <reference path="../interfaces/types.d.js" />
/// <reference path="../interfaces/global.d.ts" />

import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/src/consts";


/**
 * ----------------------------
 * -----  `GET(context)`  -----
 * ----------------------------
 * - Genera el feed RSS del blog a partir de la colección de posts.
 * @param {import("astro").APIContext} context - Contexto de la API route de Astro.
 * @return {Promise<Response>} - Response con el feed RSS.
 */
export const GET = async (context) => {

    /** - `posts publicados en la colección blog` */
    const posts = await getCollection("blog");

    //  -----  devolver el feed rss  -----
    return rss({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: context.site,
        items: posts.map((post) => ({
            ...post.data,
            link: `/blog/${post.id}/`,
        })),
    });

};
