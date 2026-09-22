/*
 *  -----------------------------------------------------------------  *
 *  -----  [slug].ts  --  /src/pages/api/posts/likes/[slug].ts  -----  *
 *  -----------------------------------------------------------------  *
 */

import type { APIRoute } from "astro";
import { db, eq, Posts } from "astro:db";

/** - deshabilitar la prerenderización (Turso en runtime) */
export const prerender = false;

/**
 * -------------------------------
 * -----  `GET: APIRoute`  -----
 * -------------------------------
 * Lee likes de la tabla Posts por slug/id.
 */
export const GET: APIRoute = async ({ params }) => {
    const postId = params.slug ?? "";

    const posts = await db.select().from(Posts).where(eq(Posts.id, postId));

    if (posts.length === 0) {
        const post = {
            id: postId,
            title: "Post not found",
            likes: 0,
        };

        return new Response(JSON.stringify(post), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(posts.at(0)), {
        headers: { "Content-Type": "application/json" },
    });
};

/**
 * --------------------------------
 * -----  `POST: APIRoute`  -----
 * --------------------------------
 * Crea el post en Turso si no existe e incrementa likes (body: `{ likes: number }`).
 */
export const POST: APIRoute = async ({ params, request }) => {
    const postId = params.slug ?? "";

    const posts = await db.select().from(Posts).where(eq(Posts.id, postId));

    const { likes = 0 } = await request.json();

    if (posts.length === 0) {
        const newPost = {
            id: postId,
            title: "Post not found",
            likes: 0,
        };

        await db.insert(Posts).values(newPost);
        posts.push(newPost);
    }

    const post = posts.at(0)!;

    post.likes = post.likes + likes;

    await db.update(Posts).set(post).where(eq(Posts.id, postId));

    return new Response("Ok!", {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
};
