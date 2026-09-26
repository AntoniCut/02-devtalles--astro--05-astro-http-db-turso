/*
    *  ---------------------------------------------  *
    *  -----  db/config.ts  --  /db/config.ts  -----  *
    *  ---------------------------------------------  *
 */

import { column, defineDb, defineTable } from "astro:db";


/**
 * ---------------------------------------
 * -----  `Clients` defineTable({})  -----
 * ---------------------------------------
 * - `tabla de clientes`
 */
const Clients = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        name: column.text(),
        age: column.number(),
        isActive: column.boolean(),
    },
});

/**
 * ---------------------------------------
 * -----  `Posts` defineTable({})  -----
 * ---------------------------------------
 * - `tabla de posts`
 */
const Posts = defineTable({
    columns: {
        id: column.text({ primaryKey: true }),
        title: column.text(),
        likes: column.number(),
    },
});

// https://astro.build/db/config
export default defineDb({
    tables: {
        Clients,
        Posts,
    },
});
