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



/**
 * ------------------------------------------
 * -----  interface  -  `BlogSeedPost`  -----
 * ------------------------------------------
 * - `entrada del blog lista para insertar en posts`
 */
interface BlogSeedPost {

    /** - `slug del post` */
    id: string;

    /** - `título del post` */
    title: string;
}



/**
 * --------------------------------------------
 * -----  `readFrontmatterTitle(source)`  -----
 * --------------------------------------------
 * - Extrae el título del frontmatter de un markdown.
 */
const readFrontmatterTitle = (source: string): string => {

    /** - `bloque frontmatter del markdown, si existe` */
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);

    /** - `texto interior del frontmatter` */
    const block = frontmatter?.[1];

    //  -----  si no hay frontmatter, abortar el seed  -----
    if (!block) {
        throw new Error("El markdown no tiene frontmatter");
    }

    /** - `línea title del frontmatter` */
    const titleLine = block
        .split(/\r?\n/)
        .find((line) => line.startsWith("title:"));

    //  -----  si no hay título, abortar el seed  -----
    if (!titleLine) {
        throw new Error("El markdown no tiene title");
    }

    /** - `valor del título, con o sin comillas` */
    const value = titleLine.slice("title:".length).trim();

    /** - `true si el título va entre comillas simples o dobles` */
    const quoted =
        (value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'));

    //  -----  si el título va entre comillas, quitarlas  -----
    if (quoted) {
        //  -----  devolver el título sin comillas  -----
        return value.slice(1, -1);
    }

    //  -----  si el título no va entre comillas, devolverlo tal cual  -----
    return value;

};



/**
 * -------------------------------
 * -----  `readBlogPosts()`  -----
 * -------------------------------
 * - Lee el id y el título de los markdown de src/content/blog.
 * @async
 */
const readBlogPosts = async (): Promise<BlogSeedPost[]> => {

    /** - `directorio de los markdown del blog` */
    const blogDir = path.join(process.cwd(), "src/content/blog");

    /** - `nombres de archivo dentro del directorio` */
    const fileNames = await readdir(blogDir);

    /** - `posts leídos del disco` */
    const posts: BlogSeedPost[] = [];

    //  -----  recorrer cada archivo del blog  -----
    for (const fileName of fileNames) {
        //  -----  omitir lo que no sea markdown  -----
        if (!fileName.endsWith(".md") && !fileName.endsWith(".mdx")) {
            continue;
        }

        /** - `contenido del archivo markdown` */
        const source = await readFile(path.join(blogDir, fileName), "utf8");

        /** - `slug del post, sin extensión` */
        const id = fileName.replace(/\.(md|mdx)$/, "");

        //  -----  guardar el id y el título del post  -----
        posts.push({
            id,
            title: readFrontmatterTitle(source),
        });
    }

    //  -----  devolver los posts leídos  -----
    return posts;

};



/**
 * ----------------------
 * -----  `seed()`  -----
 * ----------------------
 * - Inserta clientes y posts de ejemplo en la base de datos.
 * @async
 */
const seed = async (): Promise<void> => {

    //  -----  vaciar la tabla de clientes  -----
    await db.delete(Clients);

    //  -----  insertar los clientes de ejemplo  -----
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

    /** - `posts del blog leídos desde el disco` */
    const posts = await readBlogPosts();

    //  -----  vaciar la tabla de posts  -----
    await db.delete(Posts);

    //  -----  insertar posts solo si el directorio tiene markdown  -----
    if (posts.length > 0) {
        //  -----  insertar cada post con un número de likes aleatorio  -----
        await db.insert(Posts).values(
            posts.map((post) => ({
                id: post.id,
                title: post.title,
                likes: Math.floor(Math.random() * 100),
            })),
        );
    }

    //  -----  avisar de que el seed terminó  -----
    console.log("Seed function executed");

};

export default seed;
