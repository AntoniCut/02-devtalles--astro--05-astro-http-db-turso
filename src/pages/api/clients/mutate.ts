/*
    *  -------------------------------------------------------------  *
    *  -----  mutate.ts  --  /src/pages/api/clients/mutate.ts  -----  *
    *  -------------------------------------------------------------  *
 */

import type { APIRoute } from "astro";
import { Clients, db } from "astro:db";
import { parseClientInput } from "@/src/pages/api/clients/_helpers";
import { jsonResponse, parseJsonBody } from "@/src/pages/api/posts/_helpers";


/** - `modo ssr: las mutaciones se ejecutan en el servidor en cada request` */
export const prerender = false;

/**
 * -----------------------------------------
 * -----  `POST({ request })`  -----
 * -----------------------------------------
 * - Crea un nuevo cliente en la tabla Clients.
 */
export const POST: APIRoute = async ({ request }) => {
    /** - `parsear el body de la request` */
    const body = await parseJsonBody(request);

    //  -----  Si el body no es válido, devolver un error 400  -----
    if (body instanceof Response) {
        return body;
    }

    /** - `parsear los datos del cliente` */
    const input = parseClientInput(body);

    //  -----  Si los datos del cliente no son válidos, devolver un error 400  -----
    if (input instanceof Response) {
        return input;
    }

    /** - `crear el cliente` */
    const created = await db.insert(Clients).values(input).returning();

    //  -----  Devolver el cliente creado en formato JSON  -----
    return jsonResponse(created[0], 201);
};
