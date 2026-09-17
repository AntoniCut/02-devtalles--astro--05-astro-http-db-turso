/*
    *  -------------------------------------------------  *
    *  -----  db/seed.dev.ts  --  /db/seed.dev.ts  -----  *
    *  -------------------------------------------------  *
 */

import { Clients, db } from "astro:db";


// https://astro.build/db/seed
// Turso (remoto): pnpm db:seed
// SQLite local (tras `pnpm dev`): pnpm db:seed:local
export default async function seed() {
    await db.delete(Clients);

    await db.insert(Clients).values([
        {
            id: 1,
            name: "John Doe",
            age: 30,
            isActive: true,
        },
        {
            id: 2,
            name: "María García",
            age: 28,
            isActive: true,
        },
        {
            id: 3,
            name: "Carlos Ruiz",
            age: 45,
            isActive: false,
        },
        {
            id: 4,
            name: "Ana López",
            age: 22,
            isActive: true,
        },
        {
            id: 5,
            name: "Pedro Sánchez",
            age: 36,
            isActive: false,
        },
    ]);

    console.log("Seed function executed");
}
