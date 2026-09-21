/*
    *  -----------------------------------------------------------  *
    *  -----  [id].ts  --  /src/pages/api/clients/[id].ts  -----  *
    *  -----------------------------------------------------------  *
 */

import type { APIRoute } from "astro";
import { getClientById, parseClientId } from "@/src/pages/api/clients/_helpers";
import { jsonResponse } from "@/src/pages/api/posts/_helpers";


/** - `modo ssr: la lectura se ejecuta en el servidor en cada request` */
export const prerender = false;

/**
 * -------------------------------
 * -----  `GET({ params })`  -----
 * -------------------------------
 * - Devuelve un cliente concreto por id.
 */
export const GET: APIRoute = async ({ params }) => {
    /** - `parsear el id del cliente` */
    const clientId = parseClientId(params.id);

    if (clientId instanceof Response) {
        return clientId;
    }

    /** - `obtener el cliente por id` */
    const client = await getClientById(clientId);

    //  -----  `si el cliente no existe, devolver un error 404`  -----
    if (client instanceof Response) {
        return client;
    }

    //  -----  `devolver el cliente en formato JSON`  -----
    return jsonResponse(client);
};
