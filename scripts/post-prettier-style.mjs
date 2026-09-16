/*
    *  ---------------------------------------------------------------------  *
    *  -----  post-prettier-style.mjs  --  /scripts/post-prettier-style.mjs  -----  *
    *  ---------------------------------------------------------------------  *
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";


const ROOT = process.cwd();
const EXTENSIONS = new Set([".js", ".ts", ".astro", ".mjs"]);
const IGNORED_DIRS = new Set(["node_modules", "dist", ".astro"]);

/**
 * Recorre el proyecto y devuelve rutas de archivos formateables.
 *
 * @param {string} dir
 * @param {string[]} files
 * @returns {string[]}
 */
function collectFiles(dir, files = []) {
    for (const entry of readdirSync(dir)) {
        const filePath = join(dir, entry);
        const stats = statSync(filePath);

        if (stats.isDirectory()) {
            if (!IGNORED_DIRS.has(entry)) {
                collectFiles(filePath, files);
            }

            continue;
        }

        if (EXTENSIONS.has(extname(entry))) {
            files.push(filePath);
        }
    }

    return files;
}

/**
 * Restaura la indentación interna del banner del archivo.
 *
 * @param {string} content
 * @returns {string}
 */
function fixBannerIndent(content) {
    return content.replace(
        /\/\*\n((?: \*[^\n]*\n){3}) \*\//g,
        (match, innerLines) => {
            const fixedInnerLines = innerLines.replace(/^ /gm, "    ");
            return `/*\n${fixedInnerLines} */`;
        },
    );
}

/**
 * Garantiza dos líneas en blanco tras un bloque de imports.
 *
 * @param {string} content
 * @returns {string}
 */
function fixDoubleBlankAfterImports(content) {
    const lines = content.split("\n");
    const result = [];
    let index = 0;

    while (index < lines.length) {
        if (!lines[index].startsWith("import ")) {
            result.push(lines[index]);
            index += 1;
            continue;
        }

        while (index < lines.length && lines[index].startsWith("import ")) {
            result.push(lines[index]);
            index += 1;
        }

        let blankCount = 0;

        while (index < lines.length && lines[index].trim() === "") {
            blankCount += 1;
            index += 1;
        }

        if (index < lines.length && blankCount < 2) {
            result.push("");
            result.push("");
        } else {
            for (let blankIndex = 0; blankIndex < blankCount; blankIndex += 1) {
                result.push("");
            }
        }
    }

    return result.join("\n");
}

/**
 * Garantiza dos líneas en blanco antes de exports de módulo tras un bloque.
 *
 * @param {string} content
 * @returns {string}
 */
function fixDoubleBlankBeforeExport(content) {
    return content.replace(
        /(\}\);)\n(\n*)(export )/g,
        (match, close, middle, exportKeyword) => {
            const totalNewlines = 1 + middle.length;

            if (totalNewlines >= 3) {
                return match;
            }

            return `${close}\n\n\n${exportKeyword}`;
        },
    );
}

/**
 * Garantiza una línea en blanco tras el banner y antes del primer import.
 *
 * @param {string} content
 * @returns {string}
 */
function fixBlankAfterBanner(content) {
    return content.replace(/( \*\/)\n(import )/g, "$1\n\n$2");
}

/**
 * Garantiza una línea en blanco tras el --- inicial y antes del --- final.
 *
 * @param {string} content
 * @returns {string}
 */
function fixAstroFrontmatterSpacing(content) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);

    if (!frontmatterMatch) {
        return content;
    }

    const body = frontmatterMatch[1].replace(/^\n+/, "").replace(/\n+$/, "");
    const rest = content.slice(frontmatterMatch[0].length);

    return `---\n\n${body}\n\n---\n${rest}`;
}

/**
 * Aplica el estilo del proyecto sobre el contenido ya formateado por Prettier.
 *
 * @param {string} content
 * @param {string} filePath
 * @returns {string}
 */
function applyProjectStyle(content, filePath) {
    let formatted = content;
    formatted = fixBannerIndent(formatted);
    formatted = fixBlankAfterBanner(formatted);
    formatted = fixDoubleBlankAfterImports(formatted);
    formatted = fixDoubleBlankBeforeExport(formatted);

    if (filePath.endsWith(".astro")) {
        formatted = fixAstroFrontmatterSpacing(formatted);
    }

    return formatted;
}

/**
 * Procesa un archivo si su contenido cambia tras el post-formateo.
 *
 * @param {string} filePath
 * @returns {boolean}
 */
function processFile(filePath) {
    const original = readFileSync(filePath, "utf8");
    const updated = applyProjectStyle(original, filePath);

    if (updated !== original) {
        writeFileSync(filePath, updated, "utf8");
        return true;
    }

    return false;
}

const files = collectFiles(ROOT);
let changedCount = 0;

for (const filePath of files) {
    if (processFile(filePath)) {
        changedCount += 1;
    }
}

console.log(`post-prettier-style: ${changedCount} archivo(s) actualizado(s).`);
