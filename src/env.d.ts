/*
 *  -----------------------------------------  *
 *  -----  env.d.ts  --  /src/env.d.ts  -----  *
 *  -----------------------------------------  *
 */


/// <reference types="astro/client" />
/// <reference types="@astrojs/vue/vue-shims" />


declare module "*.vue" {
    import type { DefineComponent } from "vue";

    const component: DefineComponent;
    export default component;
}


interface ImportMetaEnv {
    /** `true` = likes con server actions; omitir o `false` = API REST */
    readonly LIKES_USE_SERVER_ACTIONS?: string;
}


interface ImportMeta {
    readonly env: ImportMetaEnv;
}
