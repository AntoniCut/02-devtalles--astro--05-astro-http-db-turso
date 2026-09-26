/*
    *  -----------------------------------------------------------------  *
    *  -----  [slug].ts  --  /src/pages/api/posts/likes/[slug].ts  -----  *
    *  -----------------------------------------------------------------  *
 */

import type { APIRoute } from "astro";
import { db, eq, Posts } from "astro:db";


/** - `modo ssr: los likes se leen y escriben en turso en cada request` */
export const prerender = false;



/**
 * -------------------------------------------------
 * -----  `incrementPostLikes(postId, likes)`  -----
 * -------------------------------------------------
 * - Incrementa los likes de un post en Turso y crea la fila si no existe.
 */
const incrementPostLikes = async (
    postId: string,
    likes: number,
): Promise<void> => {

    /** - `fila actual del post, como máximo una` */
    const posts = await db
        .select()
        .from(Posts)
        .where(eq(Posts.id, postId))
        .limit(1);

    //  -----  si el post no existe, crear la fila con cero likes  -----
    if (posts.length === 0) {
        /** - `fila nueva para un slug que aún no está en turso` */
        const newPost = {
            id: postId,
            title: "Post not found",
            likes: 0,
        };

        //  -----  crear la fila del post  -----
        await db.insert(Posts).values(newPost);

        //  -----  dejar la fila nueva en la lista local  -----
        posts.push(newPost);
    }

    /** - `post sobre el que se suman los likes` */
    const post = posts.at(0)!;

    post.likes = post.likes + likes;

    //  -----  guardar los likes actualizados  -----
    await db.update(Posts).set(post).where(eq(Posts.id, postId));

};



/**
 * -------------------------------
 * -----  `GET({ params })`  -----
 * -------------------------------
 * - Lee los likes de la tabla Posts por slug.
 */
export const GET: APIRoute = async ({ params }) => {

    /** - `slug del post pedido en la url` */
    const postId = params.slug ?? "";

    /** - `filas del post en turso` */
    const posts = await db.select().from(Posts).where(eq(Posts.id, postId));

    //  -----  si el post no existe, devolver una fila vacía  -----
    if (posts.length === 0) {
        /** - `respuesta cuando el slug aún no tiene fila` */
        const post = {
            id: postId,
            title: "Post not found",
            likes: 0,
        };

        //  -----  devolver la fila vacía  -----
        return new Response(JSON.stringify(post), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    //  -----  devolver los likes del post  -----
    return new Response(JSON.stringify(posts.at(0)), {
        headers: { "Content-Type": "application/json" },
    });

};



/**
 * -----------------------------------------
 * -----  `POST({ params, request })`  -----
 * -----------------------------------------
 * - Crea el post en Turso si no existe e incrementa los likes.
 */
export const POST: APIRoute = async ({ params, request }) => {

    /** - `slug del post pedido en la url` */
    const postId = params.slug ?? "";

    /** - `likes a sumar; cero si el body no los trae` */
    const { likes = 0 } = await request.json();

    //  -----  sumar los likes en turso  -----
    await incrementPostLikes(postId, likes);

    //  -----  confirmar el incremento  -----
    return new Response("Ok!", {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });

};



/**
 * ----------------------------------------
 * -----  `PUT({ params, request })`  -----
 * ----------------------------------------
 * - Incrementa los likes. Lo usa el contador del post.
 */
export const PUT: APIRoute = async ({ params, request }) => {

    /** - `slug del post pedido en la url` */
    const postId = params.slug ?? "";

    /** - `likes a sumar; cero si el body no los trae` */
    const { likes = 0 } = await request.json();

    //  -----  sumar los likes en turso  -----
    await incrementPostLikes(postId, likes);

    //  -----  confirmar el incremento  -----
    return new Response("Ok!", {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });

};
