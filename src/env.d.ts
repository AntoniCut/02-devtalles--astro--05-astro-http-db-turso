/*
    *  -----------------------------------------  *
    *  -----  env.d.ts  --  /src/env.d.ts  -----  *
    *  -----------------------------------------  *
 */

/// <reference types="astro/client" />
/// <reference types="@astrojs/vue/vue-shims" />

declare module "*.vue" {
    import type { DefineComponent } from "vue";

    /** - `componente vue importado como módulo` */
    const component: DefineComponent;
    export default component;
}



/**
 * -------------------------------------------
 * -----  interface  -  `ImportMetaEnv`  -----
 * -------------------------------------------
 * - `variables de entorno del proyecto`
 */
interface ImportMetaEnv {

    /** - `true usa server actions para los likes` */
    readonly LIKES_USE_SERVER_ACTIONS?: string;
}



/**
 * ----------------------------------------
 * -----  interface  -  `ImportMeta`  -----
 * ----------------------------------------
 * - `metadatos de importación`
 */
interface ImportMeta {

    /** - `variables de entorno` */
    readonly env: ImportMetaEnv;
}
