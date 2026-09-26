/*
    *  -------------------------------------------------------------------------------------  *
    *  -----  post-likes.helpers.ts  --  /src/actions/posts/post-likes.helpers.ts  -----  *
    *  -------------------------------------------------------------------------------------  *
 */

import { db, eq, Posts } from "astro:db";



/**
 * --------------------------------------------
 * -----  interface  -  `PostLikesState`  -----
 * --------------------------------------------
 * - `estado de likes de un post en turso`
 */
export interface PostLikesState {

    /** - `número de likes` */
    likes: number;

    /** - `true si el post ya existe` */
    exists: boolean;
}



/**
 * -------------------------------------
 * -----  `readPostLikes(postId)`  -----
 * -------------------------------------
 * - Lee los likes de un post en la tabla Posts.
 */
export const readPostLikes = async (
    postId: string,
): Promise<PostLikesState> => {

    /** - `fila del post, si ya existe en turso` */
    const [post] = await db
        .select()
        .from(Posts)
        .where(eq(Posts.id, postId))
        .limit(1);

    //  -----  si el post no existe, devolver cero likes  -----
    if (!post) {
        //  -----  devolver cero likes  -----
        return {
            likes: 0,
            exists: false,
        };
    }

    //  -----  devolver los likes guardados  -----
    return {
        likes: post.likes,
        exists: true,
    };

};
