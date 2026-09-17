/*
    *  ---------------------------------------------------------------  *
    *  -----  _helpers.ts  --  /src/pages/api/clients/_helpers.ts  -----  *
    *  ---------------------------------------------------------------  *
 */

import { Clients, db, eq } from "astro:db";
import { errorResponse } from "@/src/pages/api/posts/_helpers";
import type {


    Client,
    ClientInput,
    ClientPatchInput,
} from "@/src/interfaces/types";

/**
 * --------------------------------------------
 * -----  `parseClientId(id)`  -----
 * --------------------------------------------
 * - Convierte el id de la url en número o devuelve un error 400.
 */
export const parseClientId = (id: string | undefined): number | Response => {
    if (id === undefined) {
        return errorResponse("Client id is required", 400);
    }

    const clientId = Number(id);

    if (!Number.isInteger(clientId) || clientId <= 0) {
        return errorResponse("Invalid client id", 400);
    }

    return clientId;
};

/**
 * --------------------------------------------------
 * -----  `parseClientInput(body)`  -----
 * --------------------------------------------------
 * - Valida el body completo para crear o reemplazar un cliente.
 */
export const parseClientInput = (
    body: Record<string, unknown>,
): ClientInput | Response => {
    const { name, age, isActive } = body;

    if (typeof name !== "string" || name.trim() === "") {
        return errorResponse(
            "name is required and must be a non-empty string",
            400,
        );
    }

    if (typeof age !== "number" || !Number.isInteger(age) || age < 0) {
        return errorResponse(
            "age is required and must be a non-negative integer",
            400,
        );
    }

    if (typeof isActive !== "boolean") {
        return errorResponse("isActive is required and must be a boolean", 400);
    }

    return {
        name: name.trim(),
        age,
        isActive,
    };
};

/**
 * -------------------------------------------------------
 * -----  `parseClientPatchInput(body)`  -----
 * -------------------------------------------------------
 * - Valida el body parcial para actualizar un cliente.
 */
export const parseClientPatchInput = (
    body: Record<string, unknown>,
): ClientPatchInput | Response => {
    const patch: ClientPatchInput = {};

    if ("name" in body) {
        if (typeof body.name !== "string" || body.name.trim() === "") {
            return errorResponse("name must be a non-empty string", 400);
        }

        patch.name = body.name.trim();
    }

    if ("age" in body) {
        if (
            typeof body.age !== "number" ||
            !Number.isInteger(body.age) ||
            body.age < 0
        ) {
            return errorResponse("age must be a non-negative integer", 400);
        }

        patch.age = body.age;
    }

    if ("isActive" in body) {
        if (typeof body.isActive !== "boolean") {
            return errorResponse("isActive must be a boolean", 400);
        }

        patch.isActive = body.isActive;
    }

    if (Object.keys(patch).length === 0) {
        return errorResponse("At least one field is required", 400);
    }

    return patch;
};

/**
 * --------------------------------------------
 * -----  `getClientById(id)`  -----
 * --------------------------------------------
 * - Obtiene un cliente por id o devuelve una respuesta de error.
 */
export const getClientById = async (id: number): Promise<Client | Response> => {
    const rows = await db.select().from(Clients).where(eq(Clients.id, id));

    if (rows.length === 0) {
        return errorResponse(`Client "${id}" not found`, 404);
    }

    return rows[0];
};
