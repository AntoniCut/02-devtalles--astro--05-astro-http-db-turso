/*
    *  -------------------------------------------------------------------  *
    *  -----  _helpers.ts  --  /src/pages/api/clients/_helpers.ts  -----  *
    *  -------------------------------------------------------------------  *
 */

import { Clients, db, eq } from "astro:db";
import { errorResponse } from "@/src/pages/api/posts/_helpers";
import type {


    Client,
    ClientInput,
    ClientPatchInput,
} from "@/src/interfaces/types";

/**
 * ---------------------------------
 * -----  `parseClientId(id)`  -----
 * ---------------------------------
 * - Convierte el id de la url en número o devuelve un error 400.
 */
export const parseClientId = (id: string | undefined): number | Response => {

    //  -----  si falta el id, devolver error 400  -----
    if (id === undefined) {
        //  -----  responder que el id es obligatorio  -----
        return errorResponse("Client id is required", 400);
    }

    /** - `id numérico del cliente` */
    const clientId = Number(id);

    //  -----  si el id no es un entero positivo, devolver error 400  -----
    if (!Number.isInteger(clientId) || clientId <= 0) {
        //  -----  responder que el id no es válido  -----
        return errorResponse("Invalid client id", 400);
    }

    //  -----  devolver el id del cliente  -----
    return clientId;

};



/**
 * --------------------------------------
 * -----  `parseClientInput(body)`  -----
 * --------------------------------------
 * - Valida el body completo para crear o reemplazar un cliente.
 */
export const parseClientInput = (
    body: Record<string, unknown>,
): ClientInput | Response => {

    /** - `nombre, edad y estado recibidos en el body` */
    const { name, age, isActive } = body;

    //  -----  si el nombre no es un texto, devolver error 400  -----
    if (typeof name !== "string" || name.trim() === "") {
        //  -----  responder que el nombre es obligatorio  -----
        return errorResponse(
            "name is required and must be a non-empty string",
            400,
        );
    }

    //  -----  si la edad no es un entero positivo o cero, devolver error 400  -----
    if (typeof age !== "number" || !Number.isInteger(age) || age < 0) {
        //  -----  responder que la edad no es válida  -----
        return errorResponse(
            "age is required and must be a non-negative integer",
            400,
        );
    }

    //  -----  si isActive no es booleano, devolver error 400  -----
    if (typeof isActive !== "boolean") {
        //  -----  responder que isActive debe ser booleano  -----
        return errorResponse("isActive is required and must be a boolean", 400);
    }

    //  -----  devolver el cliente validado  -----
    return {
        name: name.trim(),
        age,
        isActive,
    };

};



/**
 * -------------------------------------------
 * -----  `parseClientPatchInput(body)`  -----
 * -------------------------------------------
 * - Valida el body parcial para actualizar un cliente.
 */
export const parseClientPatchInput = (
    body: Record<string, unknown>,
): ClientPatchInput | Response => {

    /** - `campos válidos que se van a actualizar` */
    const patch: ClientPatchInput = {};

    //  -----  si el body trae nombre, validarlo  -----
    if ("name" in body) {
        //  -----  si el nombre no es un texto, devolver error 400  -----
        if (typeof body.name !== "string" || body.name.trim() === "") {
            //  -----  responder que el nombre no es válido  -----
            return errorResponse("name must be a non-empty string", 400);
        }

        patch.name = body.name.trim();
    }

    //  -----  si el body trae edad, validarla  -----
    if ("age" in body) {
        //  -----  si la edad no es un entero positivo o cero, devolver error 400  -----
        if (
            typeof body.age !== "number" ||
            !Number.isInteger(body.age) ||
            body.age < 0
        ) {
            //  -----  responder que la edad no es válida  -----
            return errorResponse("age must be a non-negative integer", 400);
        }

        patch.age = body.age;
    }

    //  -----  si el body trae isActive, validarlo  -----
    if ("isActive" in body) {
        //  -----  si isActive no es booleano, devolver error 400  -----
        if (typeof body.isActive !== "boolean") {
            //  -----  responder que isActive debe ser booleano  -----
            return errorResponse("isActive must be a boolean", 400);
        }

        patch.isActive = body.isActive;
    }

    //  -----  si no llega ningún campo, devolver error 400  -----
    if (Object.keys(patch).length === 0) {
        //  -----  responder que hace falta al menos un campo  -----
        return errorResponse("At least one field is required", 400);
    }

    //  -----  devolver los campos válidos  -----
    return patch;

};



/**
 * ---------------------------------
 * -----  `getClientById(id)`  -----
 * ---------------------------------
 * - Obtiene un cliente por id o devuelve una respuesta de error.
 */
export const getClientById = async (id: number): Promise<Client | Response> => {

    /** - `filas del cliente con ese id` */
    const rows = await db.select().from(Clients).where(eq(Clients.id, id));

    //  -----  si no hay filas, devolver error 404  -----
    if (rows.length === 0) {
        //  -----  responder que el cliente no existe  -----
        return errorResponse(`Client "${id}" not found`, 404);
    }

    //  -----  devolver el cliente encontrado  -----
    return rows[0];

};
