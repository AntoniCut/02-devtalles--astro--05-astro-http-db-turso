/*
    *  -----------------------------------------------------------------------------------------  *
    *  -----  get-post-likes.actions.ts  --  /src/actions/posts/get-post-likes.actions.ts  -----  *
    *  -----------------------------------------------------------------------------------------  *
 */

import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { readPostLikes } from "@/src/actions/posts/post-likes.helpers";


/**
 * ----------------------------
 * -----  `getPostLikes`  -----
 * ----------------------------
 * - Devuelve los likes actuales de un post.
 */
export const getPostLikes = defineAction({
    input: z.string(),

    /**
     * -------------------------------
     * -----  `handler(postId)`  -----
     * -------------------------------
     * - Lee los likes del post indicado.
     */
    handler: async (postId) => readPostLikes(postId),
});
