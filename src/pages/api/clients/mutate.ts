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
    const body = await parseJsonBody(request);

    if (body instanceof Response) {
        return body;
    }

    const input = parseClientInput(body);

    if (input instanceof Response) {
        return input;
    }

    const created = await db.insert(Clients).values(input).returning();

    return jsonResponse(created[0], 201);
};
