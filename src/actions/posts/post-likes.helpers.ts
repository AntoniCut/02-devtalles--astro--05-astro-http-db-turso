/*
    *  -------------------------------------------------------------------------------------  *
    *  -----  post-likes.helpers.ts  --  /src/actions/posts/post-likes.helpers.ts  -----  *
    *  -------------------------------------------------------------------------------------  *
 */


import { db, eq, Posts } from "astro:db";


/** - `estado de likes de un post en Turso` */
export interface PostLikesState {
    likes: number;
    exists: boolean;
}


/**
 * ---------------------------------
 * -----  `readPostLikes()`  -----
 * ---------------------------------
 * Lee likes de la tabla Posts por id/slug.
 */
export const readPostLikes = async (postId: string): Promise<PostLikesState> => {
    
    const [post] = await db
        .select()
        .from(Posts)
        .where(eq(Posts.id, postId))
        .limit(1);

    if (!post) {
        return {
            likes: 0,
            exists: false,
        };
    }

    return {
        likes: post.likes,
        exists: true,
    };
};
