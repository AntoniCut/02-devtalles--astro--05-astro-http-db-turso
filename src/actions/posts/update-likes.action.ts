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
 * ---------------------------
 * -----  `updateLikes`  -----
 * ---------------------------
 * - Actualiza los likes de un post en Turso.
 */
export const updateLikes = defineAction({
    input: z.object({
        postId: z.string(),
        increment: z.number(),
    }),

    /**
     * ----------------------------------------------
     * -----  `handler({ postId, increment })`  -----
     * ----------------------------------------------
     * - Suma el incremento a los likes y crea el post si no existe.
     */
    handler: async ({ postId, increment }) => {

        /** - `likes actuales y si el post ya existe` */
        const { likes, exists } = await readPostLikes(postId);

        //  -----  si el post no existe, crear la fila  -----
        if (!exists) {
            /** - `fila nueva de post sin likes` */
            const newPost = {
                id: postId,
                title: "Post not found",
                likes: 0,
            };

            //  -----  crear la fila del post  -----
            await db.insert(Posts).values(newPost);
        }

        /** - `likes tras sumar el incremento` */
        const nextLikes = likes + increment;

        //  -----  guardar los likes actualizados  -----
        await db
            .update(Posts)
            .set({ likes: nextLikes })
            .where(eq(Posts.id, postId));

        //  -----  devolver los likes actualizados  -----
        return { likes: nextLikes };

    },
});
