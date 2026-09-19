/*
    *  ---------------------------------------------------------  *
    *  -----  list.ts  --  /src/pages/api/clients/list.ts  -----  *
    *  ---------------------------------------------------------  *
 */

import type { APIRoute } from "astro";
import { Clients, db } from "astro:db";
import { jsonResponse } from "@/src/pages/api/posts/_helpers";


/** - `modo ssr: la lectura se ejecuta en el servidor en cada request` */
export const prerender = false;

/**
 * ----------------------------------------
 * -----  `GET()`  -----
 * ----------------------------------------
 * - Devuelve todos los clientes de la tabla Clients.
 */
export const GET: APIRoute = async () => {
    
    /** - `SELECT * FROM clients` */
    const clients = await db.select().from(Clients);

    return jsonResponse(clients);

};
