/*
    *  -----------------------------------------------------------------------  *
    *  -----  get-person.json.ts  --  /src/pages/api/get-person.json.ts  -----  *
    *  -----------------------------------------------------------------------  *
 */

import type { APIRoute } from "astro";
import type { Person } from "@/src/interfaces/types";


/** - `ssr: si se prerenderiza, cloudflare sirve el json como 200 y se pierde el 400 de demo` */
export const prerender = false;



/**
 * ----------------------------------------
 * -----  `GET({ params, request })`  -----
 * ----------------------------------------
 * - Describe el endpoint GET utilizado para obtener una persona.
 */
export const GET: APIRoute = async ({ params, request }) => {

    /** - `datos de ejemplo de una persona` */
    const data: Person = {
        name: "John Doe",
        age: 30,
    };

    //  -----  devolver la persona de ejemplo  -----
    return new Response(JSON.stringify(data), {
        status: 400,
        headers: { "Content-Type": "application/json" },
    });

};
