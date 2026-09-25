/*
    *  ---------------------------------------------------------------------------  *
    *  -----  post-prettier-style.mjs  --  /scripts/post-prettier-style.mjs  -----  *
    *  ---------------------------------------------------------------------------  *
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";


/** @type {string} - `raíz del proyecto` */
const ROOT = process.cwd();

/** @type {Set<string>} - `extensiones de archivos formateables` */
const EXTENSIONS = new Set([".js", ".ts", ".astro", ".mjs"]);

/** @type {Set<string>} - `directorios ignorados` */
const IGNORED_DIRS = new Set(["node_modules", "dist", ".astro"]);

/**
 * ---------------------------------------------
 * -----  `collectFiles(dir, files = [])`  -----
 * ---------------------------------------------
 * Recorre el proyecto y devuelve rutas de archivos formateables.
 * @param {string} dir - Directorio a recorrer.
 * @param {string[]} files - Archivos formateables.
 * @returns {string[]} - Archivos formateables.
 */
function collectFiles(dir, files = []) {
    //  -----  recorrer cada entrada del directorio  -----
    for (const /** @type {string} */ entry of readdirSync(dir)) {
        /** @type {string} - `ruta absoluta de la entrada` */
        const filePath = join(dir, entry);

        /** @type {import("node:fs").Stats} - `metadatos del sistema de archivos de la entrada` */
        const stats = statSync(filePath);

        //  -----  si la entrada es un directorio  -----
        if (stats.isDirectory()) {
            //  -----  descender solo si no está en la lista de ignorados  -----
            if (!IGNORED_DIRS.has(entry)) {
                collectFiles(filePath, files);
            }

            //  -----  omitir el resto del bucle para directorios  -----
            continue;
        }

        //  -----  incluir archivos con extensión formateable  -----
        if (EXTENSIONS.has(extname(entry))) {
            files.push(filePath);
        }
    }

    //  -----  devolver el acumulador de rutas  -----
    return files;
}

/**
 * ----------------------------------------
 * -----  `fixBannerIndent(content)`  -----
 * ----------------------------------------
 * Restaura la indentación interna del banner del archivo.
 * @param {string} content - Contenido del archivo.
 * @returns {string} - Contenido del archivo con la indentación interna del banner restaurada.
 */
function fixBannerIndent(content) {
    //  -----  reemplazar banners con indentación interna corregida  -----
    return content.replace(
        /\/\*\n((?: \*[^\n]*\n){3}) \*\//g,
        (/** @type {string} */ _match, /** @type {string} */ innerLines) => {
            /** @type {string} - `líneas internas con cuatro espacios de indentación` */
            const fixedInnerLines = innerLines.replace(/^ /gm, "    ");
            //  -----  devolver el bloque banner reconstruido  -----
            return `/*\n${fixedInnerLines} */`;
        },
    );
}

/**
 * ---------------------------------------------------
 * -----  `fixDoubleBlankAfterImports(content)`  -----
 * ---------------------------------------------------
 * Garantiza dos líneas en blanco antes de exports de módulo tras un bloque.
 * @param {string} content - Contenido del archivo.
 * @returns {string} - Contenido del archivo con dos líneas en blanco tras un bloque de imports.
 */
function fixDoubleBlankAfterImports(content) {
    /** @type {string[]} - `contenido del archivo dividido por líneas` */
    const lines = content.split("\n");

    /** @type {string[]} - `líneas acumuladas del resultado formateado` */
    const result = [];

    /** @type {number} - `índice de recorrido sobre el array de líneas` */
    let index = 0;

    //  -----  recorrer todas las líneas del archivo  -----
    while (index < lines.length) {
        //  -----  copiar líneas que no son import  -----
        if (!lines[index].startsWith("import ")) {
            result.push(lines[index]);
            index += 1;
            //  -----  pasar a la siguiente línea  -----
            continue;
        }

        //  -----  copiar el bloque completo de imports consecutivos  -----
        while (index < lines.length && lines[index].startsWith("import ")) {
            result.push(lines[index]);
            index += 1;
        }

        /** @type {number} - `número de líneas en blanco consecutivas tras el bloque de imports` */
        let blankCount = 0;

        //  -----  contar líneas en blanco tras los imports  -----
        while (index < lines.length && lines[index].trim() === "") {
            blankCount += 1;
            index += 1;
        }

        //  -----  forzar dos líneas en blanco si faltan  -----
        if (index < lines.length && blankCount < 2) {
            result.push("");
            result.push("");
        }

        //  -----  conservar las líneas en blanco ya existentes  -----
        else {
            for (
                /** @type {number} */ let blankIndex = 0;
                blankIndex < blankCount;
                blankIndex += 1
            ) {
                result.push("");
            }
        }
    }

    //  -----  unir líneas y devolver el contenido  -----
    return result.join("\n");
}

/**
 * ---------------------------------------------------
 * -----  `fixDoubleBlankBeforeExport(content)`  -----
 * ---------------------------------------------------
 * Garantiza dos líneas en blanco antes de exports de módulo tras un bloque.
 * @param {string} content - Contenido del archivo.
 * @returns {string} - Contenido del archivo con dos líneas en blanco antes de exports de módulo tras un bloque.
 */
function fixDoubleBlankBeforeExport(content) {
    //  -----  normalizar espaciado antes de export tras cierre de bloque  -----
    return content.replace(
        /(\}\);)\n(\n*)(export )/g,
        (
            /** @type {string} */ match,
            /** @type {string} */ close,
            /** @type {string} */ middle,
            /** @type {string} */ exportKeyword,
        ) => {
            /** @type {number} - `total de saltos de línea entre cierre y export` */
            const totalNewlines = 1 + middle.length;

            //  -----  no modificar si ya hay suficiente separación  -----
            if (totalNewlines >= 3) {
                //  -----  devolver la coincidencia sin cambios  -----
                return match;
            }

            //  -----  insertar tres saltos de línea antes del export  -----
            return `${close}\n\n\n${exportKeyword}`;
        },
    );
}

/**
 * --------------------------------------------
 * -----  `fixBlankAfterBanner(content)`  -----
 * --------------------------------------------
 * Garantiza una línea en blanco tras el banner y antes del primer import.
 * @param {string} content - Contenido del archivo.
 * @returns {string} - Contenido del archivo con una línea en blanco tras el banner y antes del primer import.
 */
function fixBlankAfterBanner(content) {
    //  -----  insertar línea en blanco entre banner e import  -----
    return content.replace(/( \*\/)\n(import )/g, "$1\n\n$2");
}

/**
 * ---------------------------------------------------
 * -----  `fixAstroFrontmatterSpacing(content)`  -----
 * ---------------------------------------------------
 * Garantiza una línea en blanco tras el --- inicial y antes del --- final.
 * @param {string} content - Contenido del archivo.
 * @returns {string} - Contenido del archivo con una línea en blanco tras el --- inicial y antes del --- final.
 */
function fixAstroFrontmatterSpacing(content) {
    /** @type {RegExpMatchArray | null} - `coincidencia del frontmatter delimitado por ---` */
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);

    //  -----  salir si no hay frontmatter de Astro  -----
    if (!frontmatterMatch) {
        //  -----  devolver contenido sin cambios  -----
        return content;
    }

    /** @type {string} - `código del frontmatter sin líneas en blanco al inicio o final` */
    const body = frontmatterMatch[1].replace(/^\n+/, "").replace(/\n+$/, "");
    /** @type {string} - `contenido del archivo tras el cierre del frontmatter` */
    const rest = content.slice(frontmatterMatch[0].length);

    //  -----  devolver frontmatter con líneas en blanco internas  -----
    return `---\n\n${body}\n\n---\n${rest}`;
}

/**
 * ---------------------------------------------------
 * -----  `applyProjectStyle(content, filePath)`  -----
 * ---------------------------------------------------
 * Aplica el estilo del proyecto sobre el contenido ya formateado por Prettier.
 * @param {string} content - Contenido del archivo.
 * @param {string} filePath - Ruta del archivo.
 * @returns {string} - Contenido del archivo con el estilo del proyecto aplicado.
 */
function applyProjectStyle(content, filePath) {
    /** @type {string} - `contenido con transformaciones de estilo aplicadas progresivamente` */
    let formatted = content;

    //  -----  corregir indentación del banner del archivo  -----
    formatted = fixBannerIndent(formatted);
    //  -----  añadir línea en blanco tras el banner  -----
    formatted = fixBlankAfterBanner(formatted);
    //  -----  normalizar líneas en blanco tras imports  -----
    formatted = fixDoubleBlankAfterImports(formatted);
    //  -----  normalizar líneas en blanco antes de export  -----
    formatted = fixDoubleBlankBeforeExport(formatted);

    //  -----  aplicar reglas extra solo en archivos .astro  -----
    if (filePath.endsWith(".astro")) {
        //  -----  normalizar espaciado del frontmatter  -----
        formatted = fixAstroFrontmatterSpacing(formatted);
    }

    //  -----  devolver contenido con estilo del proyecto  -----
    return formatted;
}

/**
 * -------------------------------------
 * -----  `processFile(filePath)`  -----
 * -------------------------------------
 * Procesa un archivo si su contenido cambia tras el post-formateo.
 * @param {string} filePath - Ruta del archivo.
 * @returns {boolean} - True si el archivo se ha actualizado, false en caso contrario.
 */
function processFile(filePath) {
    /** @type {string} - `contenido del archivo leído del disco` */
    const original = readFileSync(filePath, "utf8");

    /** @type {string} - `contenido tras aplicar el estilo del proyecto` */
    const updated = applyProjectStyle(original, filePath);

    //  -----  persistir solo si el contenido cambió  -----
    if (updated !== original) {
        writeFileSync(filePath, updated, "utf8");
        //  -----  indicar que el archivo se actualizó  -----
        return true;
    }

    //  -----  indicar que no hubo cambios  -----
    return false;
}

/** @type {string[]} - `rutas de archivos formateables encontrados en el proyecto` */
const files = collectFiles(ROOT);

/** @type {number} - `cantidad de archivos cuyo contenido cambió tras el post-formateo` */
let changedCount = 0;

//  -----  procesar cada archivo formateable del proyecto  -----
for (const /** @type {string} */ filePath of files) {
    //  -----  incrementar contador si el archivo cambió  -----
    if (processFile(filePath)) {
        changedCount += 1;
    }
}

//  -----  mostrar resumen en consola  -----
console.log(`post-prettier-style: ${changedCount} archivo(s) actualizado(s).`);
