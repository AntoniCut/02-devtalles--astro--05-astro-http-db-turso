/*
 *  -------------------------------------------------------  *
 *  -----  [id].ts  --  /src/pages/api/likes/[id].ts  -----  *
 *  -------------------------------------------------------  *
 */

import type { APIRoute } from "astro";
import { db, eq, Posts } from "astro:db";

export const prerender = false;


/** 
 *  -----------------------------
 *  -----  `GET: APIRoute`  -----
 *  -----------------------------
 *  - Obtiene el post de la base de datos y retorna el post con el número de likes incrementado
 *  - Si el post no existe, se crea uno nuevo
 *  - Si el post existe, se retorna el post con el número de likes incrementado
 * @async
 */
export const GET: APIRoute = async ({ params, request }) => {
    
    /** - obtener el id del post del parámetro de la ruta */
    const postId = params.id ?? "";

    /** - obtener el post de la base de datos */
    const post = await db.select().from(Posts).where(eq(Posts.id, postId));

    //  -----  `Si el post no existe, se crea uno nuevo`  -----
    if (post.length === 0) {
        
        const post = {
            id: postId,
            title: "Post not found",
            likes: 0,
        };

        //  -----  `Se retorna el post creado`  -----
        return new Response(JSON.stringify(post), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    
    //  -----  `Si el post existe, se retorna el post con el número de likes incrementado`  -----
    return new Response(JSON.stringify(post.at(0)), {
        headers: { "Content-Type": "application/json" },
    });

};





/** 
 *  -----------------------------
 *  -----  `POST: APIRoute`  -----
 *  -----------------------------
 *  - Incrementa el número de likes del post
 *  - Si el post no existe, se crea uno nuevo
 *  - Si el post existe, se retorna el post con el número de likes incrementado
 * @async
 */
export const POST: APIRoute = async ({ params, request }) => {
    
     /** - obtener el id del post del parámetro de la ruta */
     const postId = params.id ?? "";

     const { likes = 0} = await request.json();

     /** - obtener el post de la base de datos */
     const posts = await db
         .select()
         .from(Posts)
         .where(eq(Posts.id, postId));

     if (posts.length === 0) {

        const newPost = {
            id: postId,
            title: "Post not found",
            likes: 0,
        };

        //  -----  Insertar el nuevo post en la base de datos  -----
        await db.insert(Posts).values(newPost);

        //  -----  Insertar el nuebo post en el arreglo de posts  -----
        posts.push(newPost);
       
     }

     /** - obtener el post de la base de datos */
     const post = posts.at(0)!;

     
     //  -----  Incrementar el número de likes del post  -----
     post.likes = post.likes + likes;

      //  -----  Actualizar el post en la base de datos  -----
      await db
        .update(Posts)
        .set({ likes: post.likes + likes })
        .where(eq(Posts.id, postId));

     return new Response(
        'Ok!',
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
     );

};