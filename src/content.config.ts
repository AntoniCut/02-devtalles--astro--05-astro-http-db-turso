/*
    *  -----------------------------------------------------------  *
    *  -----  content.config.ts  --  /src/content.config.ts  -----  *
    *  -----------------------------------------------------------  *
 */

import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";


/** - `colección de posts del blog` */
const blog = defineCollection({
    //  -----  cargar markdown y mdx desde src/content/blog  -----
    loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),

    //  -----  validar frontmatter con zod  -----
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            pubDate: z.coerce.date(),
            updatedDate: z.coerce.date().optional(),
            heroImage: z.optional(image()),
        }),
});

/** - `colecciones de contenido exportadas` */
export const collections = { blog };
