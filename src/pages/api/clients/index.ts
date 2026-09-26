/*
    *  -----------------------------------------------------------  *
    *  -----  index.ts  --  /src/pages/api/clients/index.ts  -----  *
    *  -----------------------------------------------------------  *
 */

import type { APIRoute } from "astro";
import { Clients, db } from "astro:db";
import { parseClientInput } from "@/src/pages/api/clients/_helpers";
import { jsonResponse, parseJsonBody } from "@/src/pages/api/posts/_helpers";


/** - `modo ssr: la colección se ejecuta en el servidor en cada request` */
export const prerender = false;



/**
 * ---------------------
 * -----  `GET()`  -----
 * ---------------------
 * - Devuelve todos los clientes de la tabla Clients.
 */
export const GET: APIRoute = async () => {

    /** - `clientes leídos de la tabla clients` */
    const clients = await db.select().from(Clients);

    //  -----  devolver los clientes  -----
    return jsonResponse(clients);

};



/**
 * ---------------------------------
 * -----  `POST({ request })`  -----
 * ---------------------------------
 * - Crea un nuevo cliente en la tabla Clients.
 */
export const POST: APIRoute = async ({ request }) => {

    /** - `parsear el body de la request` */
    const body = await parseJsonBody(request);

    //  -----  si el body no es válido, devolver un error 400  -----
    if (body instanceof Response) {
        //  -----  devolver el error del body  -----
        return body;
    }

    /** - `parsear los datos del cliente` */
    const input = parseClientInput(body);

    //  -----  si los datos del cliente no son válidos, devolver un error 400  -----
    if (input instanceof Response) {
        //  -----  devolver el error de validación  -----
        return input;
    }

    /** - `crear el cliente` */
    const created = await db.insert(Clients).values(input).returning();

    //  -----  devolver el cliente creado  -----
    return jsonResponse(created[0], 201);

};
