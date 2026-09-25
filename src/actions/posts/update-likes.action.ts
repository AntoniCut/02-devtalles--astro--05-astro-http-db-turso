/*
    *  -----------------------------------------------------------------------------------  *
    *  -----  update-likes.action.ts  --  /src/actions/posts/update-likes.action.ts  -----  *
    *  -----------------------------------------------------------------------------------  *
 */

import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { readPostLikes } from "@/src/actions/posts/post-likes.helpers";
import { db, eq, Posts } from "astro:db";


/**
 * ----------------------------
 * -----  `updateLikes`  -----
 * ----------------------------
 * Action para actualizar los likes de un post.
 */
export const updateLikes = defineAction({
    input: z.object({
        postId: z.string(),
        increment: z.number(),
    }),

    handler: async ({ postId, increment }) => {
        const { likes, exists } = await readPostLikes(postId);

        if (!exists) {
            const newPost = {
                id: postId,
                title: "Post not found",
                likes: 0,
            };

            await db.insert(Posts).values(newPost);
        }

        const nextLikes = likes + increment;

        await db
            .update(Posts)
            .set({ likes: nextLikes })
            .where(eq(Posts.id, postId));

        return { likes: nextLikes };
    },
});
