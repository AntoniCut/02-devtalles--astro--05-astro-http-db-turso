/*
    *  -----------------------------------------------------------------------------------------  *
    *  -----  get-post-likes.actions.ts  --  /src/actions/posts/get-post-likes.actions.ts  -----  *
    *  -----------------------------------------------------------------------------------------  *
*/


import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { db, eq, Posts } from "astro:db";


/**
 * ----------------------------
 * -----  `getPostLikes`  -----
 * ----------------------------  
 * Action para obtener los likes de un post.
 */
export const getPostLikes = defineAction({
    
    input: z.string(),
    
    handler: async (postId) => {
        
        const [posts] = await db
            .select()
            .from(Posts)
            .where(eq(Posts.id, postId))
            .limit(1);

        if (!posts) {
            return { likes: 0 };
        }

        return {
            likes: posts.likes,
        }
    },

});
