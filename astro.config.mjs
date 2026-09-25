/*
    *  -----------------------------------------------------  *
    *  -----  astro.config.mjs  --  /astro.config.mjs  -----  *
    *  -----------------------------------------------------  *
 */

/// <reference path="./src/interfaces/types.d.js" />
/// <reference path="./src/interfaces/global.d.ts" />

// @ts-check

import cloudflare from "@astrojs/cloudflare";
import db from "@astrojs/db";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vue from "@astrojs/vue";
import { defineConfig, fontProviders } from "astro/config";


const site = process.env.SITE ?? "https://example.com";
const base = process.env.BASE ?? "/";

/**
 * `pnpm dev:local` → `astro dev` sin `--remote`: SQLite `.astro/content.db` en Node.
 * El worker de Cloudflare no puede usar URLs `file:` con el cliente libSQL web.
 */
const astroCliArgs = process.argv.slice(2);

const isDevServer =
    astroCliArgs[0] === "dev" && astroCliArgs[1] !== "stop";

    const localDbDev = isDevServer && !astroCliArgs.includes("--remote");

/**
 * ------------------------------
 * -----  `defineConfig()`  -----
 * ------------------------------
 * Definir la configuración principal de Astro.
 */
export default defineConfig({
    site,
    base,
    integrations: [
        mdx(),
        sitemap(),
        vue(),
        db(localDbDev ? undefined : { mode: "web" }),
    ],

    //output: "server",

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
