/*
    *  -------------------------------------------------------------------------  *
    *  -----  [id].ts  --  /src/pages/api/clients/mutations/[id].ts  -----  *
    *  -------------------------------------------------------------------------  *
 */

import type { APIRoute } from "astro";
import { Clients, db, eq } from "astro:db";
import {


    getClientById,
    parseClientId,
    parseClientInput,
    parseClientPatchInput,
} from "@/src/pages/api/clients/_helpers";
import { jsonResponse, parseJsonBody } from "@/src/pages/api/posts/_helpers";


/** - `modo ssr: las mutaciones se ejecutan en el servidor en cada request` */
export const prerender = false;

/**
 * -----------------------------------------
 * -----  `PUT({ params, request })`  -----
 * -----------------------------------------
 * - Reemplaza por completo los datos de un cliente.
 */
export const PUT: APIRoute = async ({ params, request }) => {
    const clientId = parseClientId(params.id);

    if (clientId instanceof Response) {
        return clientId;
    }

    const existing = await getClientById(clientId);

    if (existing instanceof Response) {
        return existing;
    }

    const body = await parseJsonBody(request);

    if (body instanceof Response) {
        return body;
    }

    const input = parseClientInput(body);

    if (input instanceof Response) {
        return input;
    }

    const updated = await db
        .update(Clients)
        .set(input)
        .where(eq(Clients.id, clientId))
        .returning();

    return jsonResponse(updated[0]);
};

/**
 * ------------------------------------------
 * -----  `PATCH({ params, request })`  -----
 * ------------------------------------------
 * - Actualiza parcialmente los datos de un cliente.
 */
export const PATCH: APIRoute = async ({ params, request }) => {
    const clientId = parseClientId(params.id);

    if (clientId instanceof Response) {
        return clientId;
    }

    const existing = await getClientById(clientId);

    if (existing instanceof Response) {
        return existing;
    }

    const body = await parseJsonBody(request);

    if (body instanceof Response) {
        return body;
    }

    const patch = parseClientPatchInput(body);

    if (patch instanceof Response) {
        return patch;
    }

    const updated = await db
        .update(Clients)
        .set(patch)
        .where(eq(Clients.id, clientId))
        .returning();

    return jsonResponse(updated[0]);
};

/**
 * ----------------------------------
 * -----  `DELETE({ params })`  -----
 * ----------------------------------
 * - Elimina un cliente por id.
 */
export const DELETE: APIRoute = async ({ params }) => {
    const clientId = parseClientId(params.id);

    if (clientId instanceof Response) {
        return clientId;
    }

    const deleted = await db
        .delete(Clients)
        .where(eq(Clients.id, clientId))
        .returning();

    if (deleted.length === 0) {
        return getClientById(clientId);
    }

    return jsonResponse({
        method: "DELETE",
        id: clientId,
        message: `Client "${clientId}" deleted`,
    });
};
