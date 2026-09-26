/*
    *  -------------------------------------------------------------------  *
    *  -----  _helpers.ts  --  /src/pages/api/posts/_helpers.ts  -----  *
    *  -------------------------------------------------------------------  *
 */

import type { CollectionEntry } from "astro:content";
import { getEntry } from "astro:content";


/**
 * -------------------------------
 * -----  `JSON_HEADERS {}`  -----
 * -------------------------------
 * - `cabeceras json para las respuestas de la api`
 */
const JSON_HEADERS = {
    "Content-Type": "application/json",
};



/**
 * -----------------------------------
 * -----  `isJsonObject(value)`  -----
 * -----------------------------------
 * - Comprueba si el valor es un objeto json plano.
 */
const isJsonObject = (value: unknown): value is Record<string, unknown> => {

    //  -----  devolver si el valor es un objeto json  -----
    return typeof value === "object" && value !== null && !Array.isArray(value);

};



/**
 * ------------------------------------------
 * -----  `jsonResponse(data, status)`  -----
 * ------------------------------------------
 * - Devuelve una respuesta json con el status indicado.
 */
export const jsonResponse = (data: unknown, status = 200): Response => {

    //  -----  devolver la respuesta json  -----
    return new Response(JSON.stringify(data), {
        status,
        headers: JSON_HEADERS,
    });

};



/**
 * ----------------------------------------------
 * -----  `errorResponse(message, status)`  -----
 * ----------------------------------------------
 * - Devuelve una respuesta json de error.
 */
export const errorResponse = (message: string, status: number): Response => {

    //  -----  devolver la respuesta de error  -----
    return jsonResponse({ error: message }, status);

};



/**
 * --------------------------------------
 * -----  `parseJsonBody(request)`  -----
 * --------------------------------------
 * - Parsea el body json del request o devuelve un error 400.
 */
export const parseJsonBody = async (
    request: Request,
): Promise<Record<string, unknown> | Response> => {

    //  -----  intentar leer el body como json  -----
    try {
        /** - `cuerpo de la petición ya parseado` */
        const body: unknown = await request.json();

        //  -----  si el body no es un objeto json, devolver error 400  -----
        if (!isJsonObject(body)) {
            //  -----  responder que el body no es un objeto  -----
            return errorResponse("Invalid JSON body", 400);
        }

        //  -----  devolver el body parseado  -----
        return body;
    } catch {
        //  -----  si el json no se puede leer, devolver error 400  -----
        //  -----  responder que el json no se puede leer  -----
        return errorResponse("Invalid JSON body", 400);
    }

};



/**
 * -----------------------------------
 * -----  `getPostBySlug(slug)`  -----
 * -----------------------------------
 * - Obtiene un post por slug o devuelve una respuesta de error.
 */
export const getPostBySlug = async (
    slug: string | undefined,
): Promise<CollectionEntry<"blog"> | Response> => {

    //  -----  si falta el slug, devolver error 400  -----
    if (slug === undefined) {
        //  -----  responder que el slug es obligatorio  -----
        return errorResponse("Slug is required", 400);
    }

    /** - `post de la colección blog con ese slug` */
    const post = await getEntry("blog", slug);

    //  -----  si el post no existe, devolver error 404  -----
    if (!post) {
        //  -----  responder que el post no existe  -----
        return errorResponse(`Post "${slug}" not found`, 404);
    }

    //  -----  devolver el post encontrado  -----
    return post;

};
