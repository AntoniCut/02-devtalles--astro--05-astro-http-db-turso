/*
    *  -------------------------------------------------  *
    *  -----  db/seed.dev.ts  --  /db/seed.dev.ts  -----  *
    *  -------------------------------------------------  *
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { Clients, Posts, db } from "astro:db";


// https://astro.build/db/seed
// Turso (remoto): pnpm db:seed
// SQLite local (tras `pnpm dev`): pnpm db:seed:local

/** - `entrada del blog lista para insertar en posts` */
interface BlogSeedPost {
    id: string;
    title: string;
}

/**
 * --------------------------------------------
 * -----  `readFrontmatterTitle(source)`  -----
 * --------------------------------------------
 * - Extrae el título del frontmatter de un markdown.
 */
const readFrontmatterTitle = (source: string): string => {
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const block = frontmatter?.[1];

    if (!block) {
        throw new Error("El markdown no tiene frontmatter");
    }

    const titleLine = block
        .split(/\r?\n/)
        .find((line) => line.startsWith("title:"));

    if (!titleLine) {
        throw new Error("El markdown no tiene title");
    }

    const value = titleLine.slice("title:".length).trim();
    const quoted =
        (value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'));

    return quoted ? value.slice(1, -1) : value;
};

/**
 * -------------------------------
 * -----  `readBlogPosts()`  -----
 * -------------------------------
 * - Lee id y título de src/content/blog sin usar astro:content.
 */
const readBlogPosts = async (): Promise<BlogSeedPost[]> => {
    const blogDir = path.join(process.cwd(), "src/content/blog");
    const fileNames = await readdir(blogDir);
    const posts: BlogSeedPost[] = [];

    for (const fileName of fileNames) {
        if (!fileName.endsWith(".md") && !fileName.endsWith(".mdx")) {
            continue;
        }

        const source = await readFile(path.join(blogDir, fileName), "utf8");
        const id = fileName.replace(/\.(md|mdx)$/, "");

        posts.push({
            id,
            title: readFrontmatterTitle(source),
        });
    }

    return posts;
};

/**
 * ----------------------
 * -----  `seed()`  -----
 * ----------------------
 * - Inserta clientes y posts de ejemplo en la base de datos.
 */
const seed = async (): Promise<void> => {
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

    const posts = await readBlogPosts();

    await db.delete(Posts);

    if (posts.length > 0) {
        await db.insert(Posts).values(
            posts.map((post) => ({
                id: post.id,
                title: post.title,
                likes: Math.floor(Math.random() * 100),
            })),
        );
    }

    console.log("Seed function executed");
};

export default seed;
