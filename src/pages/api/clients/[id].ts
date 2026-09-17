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
    const clientId = parseClientId(params.id);

    if (clientId instanceof Response) {
        return clientId;
    }

    const client = await getClientById(clientId);

    if (client instanceof Response) {
        return client;
    }

    return jsonResponse(client);
};
