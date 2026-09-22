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
 * ------------------------------
 * -----  `defineConfig()`  -----
 * ------------------------------
 * Definir la configuración principal de Astro.
 */
export default defineConfig({
    site,
    base,
    integrations: [mdx(), sitemap(), vue(), db({ mode: "web" })],

    //output: "server",

    adapter: cloudflare({
        /** Evita conflicto @astrojs/vue resolve.external vs validación del plugin de Cloudflare en prerender. */
        prerenderEnvironment: "node",
    }),

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
