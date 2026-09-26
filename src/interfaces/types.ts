/*
    *  ----------------------------------------------------  *
    *  -----  types.ts  --  /src/interfaces/types.ts  -----  *
    *  ----------------------------------------------------  *
 */

/**
 * Tipos de dominio del proyecto.
 * Añadir aquí `interface` / `type` compartidos.
 */



/**
 * --------------------------------------
 * -----  interface  -  `SiteMeta`  -----
 * --------------------------------------
 * - `metadatos globales del sitio`
 */
export interface SiteMeta {

    /** - `título del sitio` */
    title: string;

    /** - `descripción del sitio` */
    description: string;
}



/**
 * ------------------------------------
 * -----  interface  -  `Person`  -----
 * ------------------------------------
 * - `datos de una persona`
 */
export interface Person {

    /** - `nombre de la persona` */
    name: string;

    /** - `edad de la persona` */
    age: number;
}



/**
 * ------------------------------------
 * -----  interface  -  `Client`  -----
 * ------------------------------------
 * - `cliente almacenado en astro db`
 */
export interface Client {

    /** - `id del cliente` */
    id: number;

    /** - `nombre del cliente` */
    name: string;

    /** - `edad del cliente` */
    age: number;

    /** - `true si el cliente está activo` */
    isActive: boolean;
}



/**
 * -----------------------------------------
 * -----  interface  -  `ClientInput`  -----
 * -----------------------------------------
 * - `datos requeridos para crear o reemplazar un cliente`
 */
export interface ClientInput {

    /** - `nombre del cliente` */
    name: string;

    /** - `edad del cliente` */
    age: number;

    /** - `true si el cliente está activo` */
    isActive: boolean;
}



/**
 * ----------------------------------------------
 * -----  interface  -  `ClientPatchInput`  -----
 * ----------------------------------------------
 * - `datos opcionales para actualizar un cliente parcialmente`
 */
export interface ClientPatchInput {

    /** - `nombre nuevo del cliente` */
    name?: string;

    /** - `edad nueva del cliente` */
    age?: number;

    /** - `estado nuevo del cliente` */
    isActive?: boolean;
}



/**
 * -----------------------------
 * -----  `ApiHttpMethod`  -----
 * -----------------------------
 * - `métodos http soportados en la api`
 * */
export type ApiHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * -----------------------------
 * -----  `ApiRenderMode`  -----
 * -----------------------------
 * - `modo de renderizado de un endpoint`
 * */
export type ApiRenderMode = "static" | "ssr";



/**
 * --------------------------------------------
 * -----  interface  -  `ApiRelatedLink`  -----
 * --------------------------------------------
 * - `enlace relacionado de un endpoint`
 */
export interface ApiRelatedLink {

    /** - `texto del enlace` */
    label: string;

    /** - `ruta del enlace` */
    path: string;
}



/**
 * -----------------------------------------
 * -----  interface  -  `ApiEndpoint`  -----
 * -----------------------------------------
 * - `endpoint individual de la api`
 */
export interface ApiEndpoint {

    /** - `método http` */
    method: ApiHttpMethod;

    /** - `ruta del endpoint` */
    path: string;

    /** - `título del endpoint` */
    title: string;

    /** - `descripción del endpoint` */
    description: string;

    /** - `modo de renderizado` */
    mode: ApiRenderMode;

    /** - `ejemplo de body` */
    bodyExample?: string;

    /** - `enlaces relacionados` */
    relatedLinks?: ApiRelatedLink[];
}



/**
 * ----------------------------------------
 * -----  interface  -  `ApiUseCase`  -----
 * ----------------------------------------
 * - `caso de uso agrupado de la api`
 */
export interface ApiUseCase {

    /** - `título del caso de uso` */
    title: string;

    /** - `descripción del caso de uso` */
    description: string;

    /** - `endpoints del caso de uso` */
    endpoints: ApiEndpoint[];
}



/**
 * ----------------------------------------
 * -----  interface  -  `ApiSection`  -----
 * ----------------------------------------
 * - `sección principal de la documentación api`
 */
export interface ApiSection {

    /** - `id de la sección` */
    id: string;

    /** - `título de la sección` */
    title: string;

    /** - `descripción de la sección` */
    description: string;

    /** - `casos de uso de la sección` */
    useCases: ApiUseCase[];
}
