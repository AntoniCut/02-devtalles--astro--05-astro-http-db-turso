/*
    *  ---------------------------------------------------------  *
    *  -----  [id].ts  --  /src/pages/api/clients/[id].ts  -----  *
    *  ---------------------------------------------------------  *
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

/** - `modo ssr: el cliente se resuelve en el servidor en cada request` */
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

    //  -----  si el cliente no existe, devolver un error 404  -----
    if (client instanceof Response) {
        return client;
    }

    return jsonResponse(client);
};

/**
 * ----------------------------------------
 * -----  `PUT({ params, request })`  -----
 * ----------------------------------------
 * - Reemplaza por completo los datos de un cliente.
 */
export const PUT: APIRoute = async ({ params, request }) => {
    /** - `parsear el id del cliente` */
    const clientId = parseClientId(params.id);

    //  -----  si el id del cliente no es válido, devolver un error 400  -----
    if (clientId instanceof Response) {
        return clientId;
    }

    /** - `obtener el cliente por id` */
    const existing = await getClientById(clientId);

    //  -----  si el cliente no existe, devolver un error 404  -----
    if (existing instanceof Response) {
        return existing;
    }

    /** - `parsear el body de la request` */
    const body = await parseJsonBody(request);

    //  -----  si el body no es válido, devolver un error 400  -----
    if (body instanceof Response) {
        return body;
    }

    /** - `parsear los datos del cliente` */
    const input = parseClientInput(body);

    //  -----  si los datos del cliente no son válidos, devolver un error 400  -----
    if (input instanceof Response) {
        return input;
    }

    /** - `actualizar el cliente` */
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
    /** - `parsear el id del cliente` */
    const clientId = parseClientId(params.id);

    //  -----  si el id del cliente no es válido, devolver un error 400  -----
    if (clientId instanceof Response) {
        return clientId;
    }

    /** - `obtener el cliente por id` */
    const existing = await getClientById(clientId);

    //  -----  si el cliente no existe, devolver un error 404  -----
    if (existing instanceof Response) {
        return existing;
    }

    /** - `parsear el body de la request` */
    const body = await parseJsonBody(request);

    //  -----  si el body no es válido, devolver un error 400  -----
    if (body instanceof Response) {
        return body;
    }

    /** - `parsear los datos del cliente` */
    const patch = parseClientPatchInput(body);

    //  -----  si los datos del cliente no son válidos, devolver un error 400  -----
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

    //  -----  si el id del cliente no es válido, devolver un error 400  -----
    if (clientId instanceof Response) {
        return clientId;
    }

    /** - `eliminar el cliente` */
    const deleted = await db
        .delete(Clients)
        .where(eq(Clients.id, clientId))
        .returning();

    //  -----  si el cliente no existe, devolver un error 404  -----
    if (deleted.length === 0) {
        return errorResponse(`Client "${clientId}" not found`, 404);
    }

    return jsonResponse({
        method: "DELETE",
        id: clientId,
        message: `Client "${clientId}" deleted`,
    });
};
