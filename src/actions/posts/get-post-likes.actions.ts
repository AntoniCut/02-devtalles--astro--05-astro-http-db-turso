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
 * Action para obtener los likes de un post.
 */
export const getPostLikes = defineAction({
    
    input: z.string(),
    
    handler: async (postId) => readPostLikes(postId),

});
