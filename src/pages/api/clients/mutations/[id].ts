/*
    *  -------------------------------------------------------------------  *
    *  -----  [id].ts  --  /src/pages/api/clients/mutations/[id].ts  -----  *
    *  -------------------------------------------------------------------  *
 */

import type { APIRoute } from "astro";
import { Clients, db, eq } from "astro:db";
import {


    getClientById,
    parseClientId,
    parseClientInput,
    parseClientPatchInput,
} from "@/src/pages/api/clients/_helpers";
import {


    errorResponse,
    jsonResponse,
    parseJsonBody,
} from "@/src/pages/api/posts/_helpers";

/** - `modo ssr: las mutaciones se ejecutan en el servidor en cada request` */
export const prerender = false;

/**
 * -----------------------------------------
 * -----  `PUT({ params, request })`  -----
 * -----------------------------------------
 * - Reemplaza por completo los datos de un cliente.
 */
export const PUT: APIRoute = async ({ params, request }) => {
    /** - `parsear el id del cliente` */
    const clientId = parseClientId(params.id);

    //  -----  Si el id del cliente no es válido, devolver un error 400  -----
    if (clientId instanceof Response) {
        return clientId;
    }

    /** - `obtener el cliente por id` */
    const existing = await getClientById(clientId);

    //  -----  Si el cliente no existe, devolver un error 404  -----
    if (existing instanceof Response) {
        return existing;
    }

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

    /** - `actualizar el cliente` */
    const updated = await db
        .update(Clients)
        .set(input)
        .where(eq(Clients.id, clientId))
        .returning();

    //  -----  `devolver el cliente actualizado en formato JSON`  -----
    return jsonResponse(updated[0]);
};

/**
 * ------------------------------------------
 * -----  `PATCH({ params, request })`  -----
 * ------------------------------------------
 * - Actualiza parcialmente los datos de un cliente.
 */
export const PATCH: APIRoute = async ({ params, request }) => {
    /** - `parsear el id del cliente` */
    const clientId = parseClientId(params.id);

    //  -----  Si el id del cliente no es válido, devolver un error 400  -----
    if (clientId instanceof Response) {
        return clientId;
    }

    /** - `obtener el cliente por id` */
    const existing = await getClientById(clientId);

    //  -----  Si el cliente no existe, devolver un error 404  -----
    if (existing instanceof Response) {
        return existing;
    }

    /** - `parsear el body de la request` */
    const body = await parseJsonBody(request);

    //  -----  Si el body no es válido, devolver un error 400  -----
    if (body instanceof Response) {
        return body;
    }

    /** - `parsear los datos del cliente` */
    const patch = parseClientPatchInput(body);

    //  -----  Si los datos del cliente no son válidos, devolver un error 400  -----
    if (patch instanceof Response) {
        return patch;
    }

    /** - `actualizar el cliente` */
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
    /** - `parsear el id del cliente` */
    const clientId = parseClientId(params.id);

    //  -----  Si el id del cliente no es válido, devolver un error 400  -----
    if (clientId instanceof Response) {
        return clientId;
    }

    /** - `eliminar el cliente` */
    const deleted = await db
        .delete(Clients)
        .where(eq(Clients.id, clientId))
        .returning();

    //  -----  Si el cliente no existe, devolver un error 404  -----
    if (deleted.length === 0) {
        return errorResponse(`Client "${clientId}" not found`, 404);
    }

    //  -----  `devolver el cliente eliminado en formato JSON`  -----
    return jsonResponse({
        method: "DELETE",
        id: clientId,
        message: `Client "${clientId}" deleted`,
    });
};
