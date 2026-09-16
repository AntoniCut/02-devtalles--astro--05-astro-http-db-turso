/*
    *  ---------------------------------------------------------------  *
    *  -----  types.ts  --  /src/interfaces/types.ts  -----  *
    *  ---------------------------------------------------------------  *
 */

/**
 * Tipos de dominio del proyecto.
 * Añadir aquí `interface` / `type` compartidos.
 */

/** - `metadatos globales del sitio` */
export interface SiteMeta {
    title: string;
    description: string;
}

/** - `datos de una persona` */
export interface Person {
    name: string;
    age: number;
}

/** - `métodos http soportados en la api` */
export type ApiHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** - `modo de renderizado de un endpoint` */
export type ApiRenderMode = "static" | "ssr";

/** - `enlace relacionado de un endpoint` */
export interface ApiRelatedLink {
    label: string;
    path: string;
}

/** - `endpoint individual de la api` */
export interface ApiEndpoint {
    method: ApiHttpMethod;
    path: string;
    title: string;
    description: string;
    mode: ApiRenderMode;
    bodyExample?: string;
    relatedLinks?: ApiRelatedLink[];
}

/** - `caso de uso agrupado de la api` */
export interface ApiUseCase {
    title: string;
    description: string;
    endpoints: ApiEndpoint[];
}
