/*
    *  -----------------------------------------------------------------------  *
    *  -----  get-person.json.ts  --  /src/pages/api/get-person.json.ts  -----  *
    *  -----------------------------------------------------------------------  *
 */

import type { APIRoute } from "astro";
import type { Person } from "@/src/interfaces/types";


/**
 * ----------------------------------------
 * -----  `GET({ params, request })`  -----
 * ----------------------------------------
 * - Describe el endpoint GET utilizado para obtener una persona.
 */
export const GET: APIRoute = async ({ params, request }) => {
    /** - `Obtiene los parámetros de la URL`. */
    const data: Person = {
        name: "John Doe",
        age: 30,
    };

    return new Response(JSON.stringify(data), {
        status: 400,
        headers: { "Content-Type": "application/json" },
    });
};
