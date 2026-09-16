/*
    *  -------------------------------------------  *
    *  -----  consts.ts  --  /src/consts.ts  -----  *
    *  -------------------------------------------  *
 */

import type { SiteMeta } from "@/src/interfaces/types";


/** - `título global del sitio` */
export const SITE_TITLE = "Astro Blog";

/** - `descripción global del sitio` */
export const SITE_DESCRIPTION = "Welcome to my website!";

/** - `metadatos globales del sitio` */
export const SITE_META: SiteMeta = {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
};

/** - `versión del favicon; sube el número al cambiar el icono para evitar caché del navegador` */
export const FAVICON_VERSION = "2";

/**
 * --------------------------
 * -----  `withBase()`  -----
 * --------------------------
 * Prefija una ruta con `import.meta.env.BASE_URL` (necesario en subrutas del VPS).
 * @param path - Ruta interna que empieza por `/` (ej. `/blog`).
 * @returns Ruta absoluta incluyendo el base del proyecto.
 */
export const withBase = (path: string = "/"): string => {
    /** - `base configurado en Astro, siempre con / final` */
    const base = import.meta.env.BASE_URL.endsWith("/")
        ? import.meta.env.BASE_URL
        : `${import.meta.env.BASE_URL}/`;

    if (path === "/" || path === "") {
        return base;
    }

    return `${base}${path.replace(/^\//, "")}`;
};
