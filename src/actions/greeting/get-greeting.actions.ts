/*
    *  ----------------------------------------------------------------------------------------  *
    *  -----  get-greeting.actions.ts  --  /src/actions/greeting/get-greeting.actions.ts  -----  *
    *  ----------------------------------------------------------------------------------------  *
 */

import { defineAction } from "astro:actions";
import { z } from "astro/zod";


/**
 * ---------------------------
 * -----  `getGreeting`  -----
 * ---------------------------
 * - Devuelve un saludo con el nombre, la edad y el estado.
 */
export const getGreeting = defineAction({
    input: z.object({
        name: z.string(),
        age: z.number(),
        isActive: z.boolean(),
    }),

    /**
     * ------------------------------------------------
     * -----  `handler({ name, age, isActive })`  -----
     * ------------------------------------------------
     * - Escribe el saludo y lo devuelve.
     */
    handler: async ({ name, age, isActive }) => {

        //  -----  escribir el saludo en la consola del servidor  -----
        console.log(
            `Hello, ${name}! You are ${age} years old and ${isActive ? "active" : "inactive"}!`,
        );

        //  -----  devolver el saludo  -----
        return `Hello, ${name}! You are ${age} years old and ${isActive ? "active" : "inactive"}!`;

    },
});
