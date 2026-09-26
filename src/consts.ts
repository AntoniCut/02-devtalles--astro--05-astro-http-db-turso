/*
    *  -------------------------------------------  *
    *  -----  consts.ts  --  /src/consts.ts  -----  *
    *  -------------------------------------------  *
 */

import type { SiteMeta } from "@/src/interfaces/types";


/** - `título global del sitio` */
export const SITE_TITLE = "05 - Astro HTTP DB Turso";

/** - `descripción global del sitio` */
export const SITE_DESCRIPTION = "Welcome to my website!";

/**
 * ----------------------------
 * -----  `SITE_META {}`  -----
 * ----------------------------
 * - `metadatos globales del sitio`
 */
export const SITE_META: SiteMeta = {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
};

/** - `versión del favicon; sube el número al cambiar el icono para evitar caché del navegador` */
export const FAVICON_VERSION = "2";

/** - `true usa server actions para los likes; false usa la api rest` */
export const LIKES_USE_SERVER_ACTIONS =
    import.meta.env.LIKES_USE_SERVER_ACTIONS === "true";



/**
 * ------------------------------
 * -----  `withBase(path)`  -----
 * ------------------------------
 * - Prefija una ruta con la base pública del proyecto.
 */
export const withBase = (path: string = "/"): string => {

    /** - `base configurado en astro, siempre con barra final` */
    const base = import.meta.env.BASE_URL.endsWith("/")
        ? import.meta.env.BASE_URL
        : `${import.meta.env.BASE_URL}/`;

    //  -----  si la ruta es la raíz o está vacía, devolver el base  -----
    if (path === "/" || path === "") {
        //  -----  devolver solo la base  -----
        return base;
    }

    //  -----  si la ruta no es la raíz, devolver la ruta absoluta  -----
    return `${base}${path.replace(/^\//, "")}`;
};
