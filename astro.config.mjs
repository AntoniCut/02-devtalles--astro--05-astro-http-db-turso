/*
    *  -----------------------------------------------------  *
    *  -----  astro.config.mjs  --  /astro.config.mjs  -----  *
    *  -----------------------------------------------------  *
 */

// @ts-check

import cloudflare from "@astrojs/cloudflare";
import db from "@astrojs/db";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vue from "@astrojs/vue";
import { defineConfig, fontProviders } from "astro/config";


/** - `url pública del sitio` */
const site = process.env.SITE ?? "https://example.com";

/** - `ruta base del proyecto` */
const base = process.env.BASE ?? "/";

/** - `argumentos con los que se lanzó el cli de astro` */
const astroCliArgs = process.argv.slice(2);

/** - `true si el comando actual es el servidor de desarrollo` */
const isDevServer = astroCliArgs[0] === "dev" && astroCliArgs[1] !== "stop";

/** - `true si el dev server usa sqlite local, sin --remote` */
const localDbDev = isDevServer && !astroCliArgs.includes("--remote");

export default defineConfig({
    site,
    base,
    integrations: [
        mdx(),
        sitemap(),
        vue(),

        //  -----  en dev local, astro db no usa el modo web  -----
        db(localDbDev ? undefined : { mode: "web" }),
    ],

    //output: "server",

    //  -----  en dev local, omitir el adapter de cloudflare  -----
    ...(localDbDev
        ? {}
        : {
              adapter: cloudflare({
                  /** Evita conflicto @astrojs/vue resolve.external vs validación del plugin de Cloudflare en prerender. */
                  prerenderEnvironment: "node",
              }),
          }),

    vite: {
        optimizeDeps: {
            /** CJS; rompe el prebundle de Vite/SSR. El código usa lodash-es/debounce. */
            exclude: ["lodash.debounce"],
        },
    },

    fonts: [
        {
            provider: fontProviders.local(),
            name: "Atkinson",
            cssVariable: "--font-atkinson",
            fallbacks: ["sans-serif"],
            options: {
                variants: [
                    {
                        src: ["./src/assets/fonts/atkinson-regular.woff"],
                        weight: 400,
                        style: "normal",
                        display: "swap",
                    },
                    {
                        src: ["./src/assets/fonts/atkinson-bold.woff"],
                        weight: 700,
                        style: "normal",
                        display: "swap",
                    },
                ],
            },
        },
    ],
});
