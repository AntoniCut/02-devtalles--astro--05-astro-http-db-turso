/*
 *  -----------------------------------------------------  *
 *  -----  env.d.ts  --  /src/env.d.ts  -----  *
 *  -----------------------------------------------------  *
 */

/// <reference types="astro/client" />
/// <reference types="@astrojs/vue/vue-shims" />

declare module "*.vue" {
    import type { DefineComponent } from "vue";

    const component: DefineComponent;
    export default component;
}
