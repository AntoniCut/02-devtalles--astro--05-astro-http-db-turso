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
 * Action para obtener un saludo.
 */
export const getGreeting = defineAction({
    input: z.object({
        name: z.string(),
        age: z.number(),
        isActive: z.boolean(),
    }),

    handler: async ({ name, age, isActive }) => {
        console.log(
            `Hello, ${name}! You are ${age} years old and ${isActive ? "active" : "inactive"}!`,
        );

        return `Hello, ${name}! You are ${age} years old and ${isActive ? "active" : "inactive"}!`;
    },
});
