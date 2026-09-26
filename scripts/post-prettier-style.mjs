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
            //  -----  guardar la ruta del archivo  -----
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
            //  -----  copiar cada línea en blanco ya contada  -----
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
 * -----  `skipSpaceAndComments(source, index)`  -----
 * ---------------------------------------------------
 * Avanza el índice hasta el siguiente carácter que no es espacio ni comentario.
 * @param {string} source - Contenido del archivo.
 * @param {number} index - Índice de inicio.
 * @returns {number} - Índice del siguiente carácter significativo.
 */
function skipSpaceAndComments(source, index) {
    /** @type {number} - `índice de lectura` */
    let cursor = index;

    //  -----  saltar espacios y comentarios  -----
    while (cursor < source.length) {
        //  -----  saltar espacio en blanco  -----
        if (/\s/.test(source[cursor])) {
            cursor += 1;

            continue;
        }

        //  -----  saltar comentario de línea  -----
        if (source.startsWith("//", cursor)) {
            /** @type {number} - `fin de la línea del comentario` */
            const lineBreak = source.indexOf("\n", cursor);

            cursor = lineBreak === -1 ? source.length : lineBreak + 1;

            continue;
        }

        //  -----  saltar comentario de bloque  -----
        if (source.startsWith("/*", cursor)) {
            /** @type {number} - `cierre del comentario de bloque` */
            const blockEnd = source.indexOf("*/", cursor + 2);

            cursor = blockEnd === -1 ? source.length : blockEnd + 2;

            continue;
        }

        break;
    }

    //  -----  devolver el índice ya situado  -----
    return cursor;
}

/**
 * ------------------------------------------------------
 * -----  `initializerIsFunction(source, eqIndex)`  -----
 * ------------------------------------------------------
 * Indica si el inicializador de un const/let/var es una función.
 * @param {string} source - Contenido del archivo.
 * @param {number} eqIndex - Índice del signo igual del inicializador.
 * @returns {boolean} - True si el valor asignado es una función.
 */
function initializerIsFunction(source, eqIndex) {
    /** @type {number} - `inicio del inicializador` */
    let cursor = skipSpaceAndComments(source, eqIndex + 1);

    //  -----  saltar el modificador async  -----
    if (
        source.startsWith("async", cursor) &&
        !/[A-Za-z0-9_$]/.test(source[cursor + 5] ?? "")
    ) {
        cursor = skipSpaceAndComments(source, cursor + 5);

        //  -----  función clásica asíncrona  -----
        if (source.startsWith("function", cursor)) {
            //  -----  el inicializador es una función  -----
            return true;
        }
    }

    //  -----  función clásica  -----
    if (source.startsWith("function", cursor)) {
        //  -----  el inicializador es una función  -----
        return true;
    }

    //  -----  el inicializador no abre parámetros ni agrupación  -----
    if (source[cursor] !== "(") {
        //  -----  el inicializador no es una función  -----
        return false;
    }

    /** @type {number} - `posición tras el paréntesis de apertura` */
    const innerStart = skipSpaceAndComments(source, cursor + 1);

    /** @type {number} - `posición tras el grupo de paréntesis balanceado` */
    const afterGroup = skipBalanced(source, cursor, "(", ")");

    /** @type {number} - `primer carácter tras el grupo` */
    const afterCursor = skipSpaceAndComments(source, afterGroup);

    //  -----  flecha justo después de los parámetros  -----
    if (source.startsWith("=>", afterCursor)) {
        //  -----  el inicializador es una flecha  -----
        return true;
    }

    //  -----  tipo de retorno entre los parámetros y la flecha  -----
    if (source[afterCursor] === ":") {
        /** @type {number} - `índice dentro del tipo de retorno` */
        let typeCursor = afterCursor + 1;

        /** @type {number} - `profundidad de genéricos del tipo de retorno` */
        let angleDepth = 0;

        //  -----  buscar la flecha que cierra el tipo de retorno  -----
        while (typeCursor < source.length) {
            //  -----  flecha de la función  -----
            if (source.startsWith("=>", typeCursor) && angleDepth === 0) {
                //  -----  el inicializador es una flecha con tipo de retorno  -----
                return true;
            }

            //  -----  abrir genérico  -----
            if (source[typeCursor] === "<") {
                angleDepth += 1;
            }
            //  -----  cerrar genérico  -----
            else if (source[typeCursor] === ">") {
                angleDepth -= 1;
            }
            //  -----  el tipo terminó sin flecha  -----
            else if (
                (source[typeCursor] === ";" || source[typeCursor] === "{") &&
                angleDepth === 0
            ) {
                //  -----  el inicializador no es una función  -----
                return false;
            }

            typeCursor += 1;
        }
    }

    /** @type {string} - `texto interior del primer grupo de paréntesis` */
    const innerText = source.slice(cursor, afterGroup);

    //  -----  agrupación de una función, como `(async () => {})`  -----
    if (
        (source.startsWith("async", innerStart) ||
            source.startsWith("function", innerStart) ||
            source[innerStart] === "(") &&
        innerText.includes("=>")
    ) {
        //  -----  el inicializador es una función agrupada  -----
        return true;
    }

    //  -----  el valor asignado no es una función  -----
    return false;
}

/**
 * ----------------------------------------------------------------
 * -----  `skipBalanced(source, index, openChar, closeChar)`  -----
 * ----------------------------------------------------------------
 * Devuelve el índice siguiente al cierre que equilibra el carácter de apertura.
 * @param {string} source - Contenido del archivo.
 * @param {number} index - Índice del carácter de apertura.
 * @param {string} openChar - Carácter de apertura.
 * @param {string} closeChar - Carácter de cierre.
 * @returns {number} - Índice siguiente al cierre balanceado.
 */
function skipBalanced(source, index, openChar, closeChar) {
    /** @type {number} - `profundidad del par que se equilibra` */
    let depth = 0;

    /** @type {number} - `índice de lectura` */
    let cursor = index;

    /** @type {boolean} - `true dentro de una cadena simple` */
    let inSingle = false;

    /** @type {boolean} - `true dentro de una cadena doble` */
    let inDouble = false;

    /** @type {boolean} - `true dentro de una plantilla` */
    let inTemplate = false;

    /** @type {boolean} - `true si el carácter anterior escapa el actual` */
    let escaped = false;

    //  -----  avanzar hasta cerrar el grupo  -----
    while (cursor < source.length) {
        /** @type {string} - `carácter actual` */
        const char = source[cursor];

        //  -----  consumir el escape dentro de una cadena  -----
        if (escaped) {
            escaped = false;
            cursor += 1;

            continue;
        }

        //  -----  cadena simple  -----
        if (inSingle) {
            //  -----  marcar escape  -----
            if (char === "\\") {
                escaped = true;
            }
            //  -----  cerrar cadena simple  -----
            else if (char === "'") {
                inSingle = false;
            }

            cursor += 1;

            continue;
        }

        //  -----  cadena doble  -----
        if (inDouble) {
            //  -----  marcar escape  -----
            if (char === "\\") {
                escaped = true;
            }
            //  -----  cerrar cadena doble  -----
            else if (char === '"') {
                inDouble = false;
            }

            cursor += 1;

            continue;
        }

        //  -----  plantilla  -----
        if (inTemplate) {
            //  -----  marcar escape  -----
            if (char === "\\") {
                escaped = true;
            }
            //  -----  cerrar plantilla  -----
            else if (char === "`") {
                inTemplate = false;
            }

            cursor += 1;

            continue;
        }

        //  -----  abrir cadena o plantilla  -----
        if (char === "'") {
            inSingle = true;
            cursor += 1;

            continue;
        }

        //  -----  abrir cadena doble  -----
        if (char === '"') {
            inDouble = true;
            cursor += 1;

            continue;
        }

        //  -----  abrir plantilla  -----
        if (char === "`") {
            inTemplate = true;
            cursor += 1;

            continue;
        }

        //  -----  abrir otro nivel del mismo grupo  -----
        if (char === openChar) {
            depth += 1;
        }
        //  -----  cerrar un nivel del grupo  -----
        else if (char === closeChar) {
            depth -= 1;

            //  -----  este cierre equilibra la apertura inicial  -----
            if (depth === 0) {
                //  -----  devolver la posición tras el cierre  -----
                return cursor + 1;
            }
        }

        cursor += 1;
    }

    //  -----  no hubo cierre: devolver el final del texto  -----
    return source.length;
}

/**
 * --------------------------------------------
 * -----  `leadStart(source, declIndex)`  -----
 * --------------------------------------------
 * Incluye el comentario pegado justo encima de la declaración.
 * @param {string} source - Contenido del archivo.
 * @param {number} declIndex - Índice donde empieza la declaración.
 * @returns {number} - Índice donde empieza el comentario asociado, o la declaración.
 */
function leadStart(source, declIndex) {
    /** @type {number} - `inicio del bloque declaración más su comentario` */
    let start = declIndex;

    //  -----  subir por las líneas de comentario contiguas  -----
    while (start > 0) {
        /** @type {number} - `cursor hacia atrás desde el inicio actual` */
        let cursor = start - 1;

        //  -----  ignorar espacios horizontales  -----
        while (
            cursor >= 0 &&
            (source[cursor] === " " || source[cursor] === "\t")
        ) {
            cursor -= 1;
        }

        //  -----  hace falta un salto de línea para mirar la línea anterior  -----
        if (cursor < 0 || source[cursor] !== "\n") {
            break;
        }

        /** @type {number} - `fin de la línea anterior` */
        const lineEnd = cursor;

        /** @type {number} - `inicio de la línea anterior` */
        const lineStart = source.lastIndexOf("\n", lineEnd - 1) + 1;

        /** @type {string} - `texto de la línea anterior sin espacios extremos` */
        const trimmed = source.slice(lineStart, lineEnd).trim();

        //  -----  una línea en blanco separa el comentario de otra cosa  -----
        if (trimmed === "") {
            break;
        }

        /** @type {boolean} - `true si la línea anterior es un comentario` */
        const isCommentLine =
            trimmed.startsWith("//") ||
            trimmed.startsWith("/*") ||
            trimmed.startsWith("*") ||
            trimmed.startsWith("*/");

        //  -----  la línea anterior no documenta esta declaración  -----
        if (!isCommentLine) {
            break;
        }

        start = lineStart;
    }

    //  -----  devolver el inicio del comentario o de la declaración  -----
    return start;
}

/**
 * -------------------------------------------
 * -----  `collectDeclarations(source)`  -----
 * -------------------------------------------
 * Localiza variables, funciones, interfaces y alias de tipo.
 * @param {string} source - Contenido del archivo.
 * @returns {{ kind: "fn" | "var" | "iface" | "type", start: number, end: number, depth: number }[]} - Declaraciones encontradas.
 */
function collectDeclarations(source) {
    /** @type {{ kind: "fn" | "var" | "iface" | "type", start: number, end: number, depth: number }[]} - `declaraciones acumuladas` */
    const declarations = [];

    /** @type {number} - `índice de lectura` */
    let cursor = 0;

    /** @type {number} - `profundidad de llaves` */
    let braceDepth = 0;

    /** @type {number} - `profundidad de paréntesis` */
    let parenDepth = 0;

    /** @type {number} - `profundidad de corchetes` */
    let bracketDepth = 0;

    /** @type {boolean} - `true dentro de un comentario de línea` */
    let inLineComment = false;

    /** @type {boolean} - `true dentro de un comentario de bloque` */
    let inBlockComment = false;

    /** @type {boolean} - `true dentro de una cadena simple` */
    let inSingle = false;

    /** @type {boolean} - `true dentro de una cadena doble` */
    let inDouble = false;

    /** @type {boolean} - `true dentro de una plantilla` */
    let inTemplate = false;

    /** @type {boolean} - `true si el carácter anterior escapa el actual` */
    let escaped = false;

    /** @type {number[]} - `profundidad de llaves al abrir cada interpolación` */
    const templateMarks = [];

    //  -----  recorrer el archivo  -----
    while (cursor < source.length) {
        /** @type {string} - `carácter actual` */
        const char = source[cursor];

        /** @type {string} - `carácter siguiente` */
        const nextChar = source[cursor + 1] ?? "";

        //  -----  comentario de línea  -----
        if (inLineComment) {
            //  -----  el salto de línea cierra el comentario  -----
            if (char === "\n") {
                inLineComment = false;
            }

            cursor += 1;

            continue;
        }

        //  -----  comentario de bloque  -----
        if (inBlockComment) {
            //  -----  cerrar comentario de bloque  -----
            if (char === "*" && nextChar === "/") {
                inBlockComment = false;
                cursor += 2;

                continue;
            }

            cursor += 1;

            continue;
        }

        //  -----  cadena simple  -----
        if (inSingle) {
            //  -----  consumir escape  -----
            if (escaped) {
                escaped = false;
            }
            //  -----  marcar escape  -----
            else if (char === "\\") {
                escaped = true;
            }
            //  -----  cerrar cadena simple  -----
            else if (char === "'") {
                inSingle = false;
            }

            cursor += 1;

            continue;
        }

        //  -----  cadena doble  -----
        if (inDouble) {
            //  -----  consumir escape  -----
            if (escaped) {
                escaped = false;
            }
            //  -----  marcar escape  -----
            else if (char === "\\") {
                escaped = true;
            }
            //  -----  cerrar cadena doble  -----
            else if (char === '"') {
                inDouble = false;
            }

            cursor += 1;

            continue;
        }

        //  -----  plantilla  -----
        if (inTemplate) {
            //  -----  consumir escape  -----
            if (escaped) {
                escaped = false;
                cursor += 1;

                continue;
            }

            //  -----  marcar escape  -----
            if (char === "\\") {
                escaped = true;
                cursor += 1;

                continue;
            }

            //  -----  cerrar plantilla  -----
            if (char === "`") {
                inTemplate = false;
                cursor += 1;

                continue;
            }

            //  -----  entrar en la interpolación  -----
            if (char === "$" && nextChar === "{") {
                templateMarks.push(braceDepth);
                inTemplate = false;
                braceDepth += 1;
                cursor += 2;

                continue;
            }

            cursor += 1;

            continue;
        }

        //  -----  cerrar interpolación y volver a la plantilla  -----
        if (
            char === "}" &&
            templateMarks.length > 0 &&
            braceDepth - 1 === templateMarks[templateMarks.length - 1]
        ) {
            braceDepth -= 1;
            templateMarks.pop();
            inTemplate = true;
            cursor += 1;

            continue;
        }

        //  -----  abrir comentario de línea  -----
        if (char === "/" && nextChar === "/") {
            inLineComment = true;
            cursor += 2;

            continue;
        }

        //  -----  abrir comentario de bloque  -----
        if (char === "/" && nextChar === "*") {
            inBlockComment = true;
            cursor += 2;

            continue;
        }

        //  -----  abrir cadena simple  -----
        if (char === "'") {
            inSingle = true;
            cursor += 1;

            continue;
        }

        //  -----  abrir cadena doble  -----
        if (char === '"') {
            inDouble = true;
            cursor += 1;

            continue;
        }

        //  -----  abrir plantilla  -----
        if (char === "`") {
            inTemplate = true;
            cursor += 1;

            continue;
        }

        /** @type {boolean} - `true si aquí puede empezar una sentencia` */
        const atStatement =
            parenDepth === 0 &&
            bracketDepth === 0 &&
            templateMarks.length === 0;

        //  -----  probar si aquí empieza una variable o una función  -----
        if (atStatement) {
            /** @type {RegExpMatchArray | null} - `coincidencia de export, async y la palabra clave` */
            const keywordMatch = source
                .slice(cursor)
                .match(
                    /^(export\s+)?(default\s+)?(async\s+)?(declare\s+)?(function|const|let|var|interface|type)\b/,
                );

            /** @type {string} - `carácter significativo anterior` */
            const previous = previousSignificant(source, cursor);

            /** @type {boolean} - `true si el carácter anterior cierra una sentencia` */
            const boundary =
                previous === "" ||
                previous === ";" ||
                previous === "{" ||
                previous === "}";

            //  -----  registrar la declaración y saltar hasta su final  -----
            if (
                keywordMatch &&
                boundary &&
                !(keywordMatch[2] && keywordMatch[5] !== "function")
            ) {
                /** @type {string} - `palabra clave de la declaración` */
                const keyword = keywordMatch[5];

                /** @type {"fn" | "var" | "iface" | "type"} - `clase de declaración` */
                const kind =
                    keyword === "interface"
                        ? "iface"
                        : keyword === "type"
                          ? "type"
                          : keyword === "function" ||
                              declarationIsFunction(source, cursor, braceDepth)
                            ? "fn"
                            : "var";

                /** @type {number} - `fin exclusivo de la sentencia` */
                const end = statementEnd(source, cursor, braceDepth);

                declarations.push({

                    kind,
                    start: cursor,
                    end,
                    depth: braceDepth,

                });

                cursor = end;

                continue;
            }
        }

        //  -----  actualizar profundidades del código  -----
        if (char === "{") {
            braceDepth += 1;
        }
        //  -----  cerrar llave  -----
        else if (char === "}") {
            braceDepth -= 1;
        }
        //  -----  abrir paréntesis  -----
        else if (char === "(") {
            parenDepth += 1;
        }
        //  -----  cerrar paréntesis  -----
        else if (char === ")") {
            parenDepth -= 1;
        }
        //  -----  abrir corchete  -----
        else if (char === "[") {
            bracketDepth += 1;
        }
        //  -----  cerrar corchete  -----
        else if (char === "]") {
            bracketDepth -= 1;
        }

        cursor += 1;
    }

    //  -----  devolver las declaraciones en orden  -----
    return declarations;
}

/**
 * --------------------------------------------------
 * -----  `previousSignificant(source, index)`  -----
 * --------------------------------------------------
 * Devuelve el carácter significativo anterior, saltando comentarios.
 * @param {string} source - Contenido del archivo.
 * @param {number} index - Índice de referencia.
 * @returns {string} - Carácter anterior o cadena vacía.
 */
function previousSignificant(source, index) {
    /** @type {number} - `cursor hacia atrás` */
    let cursor = index - 1;

    //  -----  retroceder hasta un carácter que no sea espacio ni comentario  -----
    while (cursor >= 0) {
        //  -----  saltar espacio  -----
        if (/\s/.test(source[cursor])) {
            cursor -= 1;

            continue;
        }

        //  -----  saltar comentario de bloque  -----
        if (source[cursor] === "/" && source[cursor - 1] === "*") {
            /** @type {number} - `inicio del comentario de bloque` */
            const blockStart = source.lastIndexOf("/*", cursor - 1);

            cursor = blockStart - 1;

            continue;
        }

        /** @type {number} - `inicio de la línea actual` */
        const lineStart = source.lastIndexOf("\n", cursor) + 1;

        /** @type {number} - `posición de un comentario de línea en esta línea` */
        const lineComment = source.slice(lineStart, cursor + 1).indexOf("//");

        //  -----  saltar comentario de línea  -----
        if (lineComment !== -1) {
            cursor = lineStart + lineComment - 1;

            continue;
        }

        //  -----  devolver el carácter encontrado  -----
        return source[cursor];
    }

    //  -----  no hay carácter anterior  -----
    return "";
}

/**
 * ----------------------------------------------------------------
 * -----  `declarationIsFunction(source, start, braceDepth)`  -----
 * ----------------------------------------------------------------
 * Indica si un const/let/var asigna una función.
 * @param {string} source - Contenido del archivo.
 * @param {number} start - Índice de la palabra clave.
 * @param {number} braceDepth - Profundidad de llaves de la sentencia.
 * @returns {boolean} - True si el valor asignado es una función.
 */
function declarationIsFunction(source, start, braceDepth) {
    /** @type {number} - `índice de lectura` */
    let cursor = start;

    /** @type {number} - `profundidad de llaves relativa a la sentencia` */
    let brace = braceDepth;

    /** @type {number} - `profundidad de paréntesis` */
    let paren = 0;

    /** @type {number} - `profundidad de corchetes` */
    let bracket = 0;

    //  -----  buscar el igual del inicializador en el nivel de la sentencia  -----
    while (cursor < source.length) {
        /** @type {string} - `carácter actual` */
        const char = source[cursor];

        //  -----  igual del inicializador  -----
        if (
            char === "=" &&
            brace === braceDepth &&
            paren === 0 &&
            bracket === 0
        ) {
            //  -----  comprobar si el valor asignado es una función  -----
            return initializerIsFunction(source, cursor);
        }

        //  -----  la sentencia terminó antes del igual  -----
        if (
            char === ";" &&
            brace === braceDepth &&
            paren === 0 &&
            bracket === 0
        ) {
            //  -----  la sentencia no asigna una función  -----
            return false;
        }

        //  -----  abrir llave  -----
        if (char === "{") {
            brace += 1;
        }
        //  -----  cerrar llave  -----
        else if (char === "}") {
            brace -= 1;
        }
        //  -----  abrir paréntesis  -----
        else if (char === "(") {
            paren += 1;
        }
        //  -----  cerrar paréntesis  -----
        else if (char === ")") {
            paren -= 1;
        }
        //  -----  abrir corchete  -----
        else if (char === "[") {
            bracket += 1;
        }
        //  -----  cerrar corchete  -----
        else if (char === "]") {
            bracket -= 1;
        }

        cursor += 1;
    }

    //  -----  no hay inicializador de función  -----
    return false;
}

/**
 * -------------------------------------------------------
 * -----  `statementEnd(source, start, braceDepth)`  -----
 * -------------------------------------------------------
 * Devuelve el índice exclusivo donde termina la sentencia.
 * @param {string} source - Contenido del archivo.
 * @param {number} start - Índice de inicio de la sentencia.
 * @param {number} braceDepth - Profundidad de llaves al empezar la sentencia.
 * @returns {number} - Índice exclusivo del final.
 */
function statementEnd(source, start, braceDepth) {
    /** @type {number} - `índice de lectura` */
    let cursor = start;

    /** @type {number} - `profundidad de llaves` */
    let brace = braceDepth;

    /** @type {number} - `profundidad de paréntesis` */
    let paren = 0;

    /** @type {number} - `profundidad de corchetes` */
    let bracket = 0;

    /** @type {boolean} - `true si la sentencia abrió un bloque` */
    let openedBlock = false;

    /** @type {boolean} - `true dentro de un comentario de línea` */
    let inLineComment = false;

    /** @type {boolean} - `true dentro de un comentario de bloque` */
    let inBlockComment = false;

    /** @type {boolean} - `true dentro de una cadena simple` */
    let inSingle = false;

    /** @type {boolean} - `true dentro de una cadena doble` */
    let inDouble = false;

    /** @type {boolean} - `true dentro de una plantilla` */
    let inTemplate = false;

    /** @type {boolean} - `true si el carácter anterior escapa el actual` */
    let escaped = false;

    /** @type {number[]} - `profundidad de llaves al abrir cada interpolación` */
    const templateMarks = [];

    //  -----  avanzar hasta el cierre de la sentencia  -----
    while (cursor < source.length) {
        /** @type {string} - `carácter actual` */
        const char = source[cursor];

        /** @type {string} - `carácter siguiente` */
        const nextChar = source[cursor + 1] ?? "";

        //  -----  comentario de línea  -----
        if (inLineComment) {
            //  -----  el salto de línea cierra el comentario  -----
            if (char === "\n") {
                inLineComment = false;
            }

            cursor += 1;

            continue;
        }

        //  -----  comentario de bloque  -----
        if (inBlockComment) {
            //  -----  cerrar comentario de bloque  -----
            if (char === "*" && nextChar === "/") {
                inBlockComment = false;
                cursor += 2;

                continue;
            }

            cursor += 1;

            continue;
        }

        //  -----  cadena simple  -----
        if (inSingle) {
            //  -----  consumir escape  -----
            if (escaped) {
                escaped = false;
            }
            //  -----  marcar escape  -----
            else if (char === "\\") {
                escaped = true;
            }
            //  -----  cerrar cadena simple  -----
            else if (char === "'") {
                inSingle = false;
            }

            cursor += 1;

            continue;
        }

        //  -----  cadena doble  -----
        if (inDouble) {
            //  -----  consumir escape  -----
            if (escaped) {
                escaped = false;
            }
            //  -----  marcar escape  -----
            else if (char === "\\") {
                escaped = true;
            }
            //  -----  cerrar cadena doble  -----
            else if (char === '"') {
                inDouble = false;
            }

            cursor += 1;

            continue;
        }

        //  -----  plantilla  -----
        if (inTemplate) {
            //  -----  consumir escape  -----
            if (escaped) {
                escaped = false;
                cursor += 1;

                continue;
            }

            //  -----  marcar escape  -----
            if (char === "\\") {
                escaped = true;
                cursor += 1;

                continue;
            }

            //  -----  cerrar plantilla  -----
            if (char === "`") {
                inTemplate = false;
                cursor += 1;

                continue;
            }

            //  -----  entrar en la interpolación  -----
            if (char === "$" && nextChar === "{") {
                templateMarks.push(brace);
                inTemplate = false;
                brace += 1;
                cursor += 2;

                continue;
            }

            cursor += 1;

            continue;
        }

        //  -----  cerrar interpolación  -----
        if (
            char === "}" &&
            templateMarks.length > 0 &&
            brace - 1 === templateMarks[templateMarks.length - 1]
        ) {
            brace -= 1;
            templateMarks.pop();
            inTemplate = true;
            cursor += 1;

            continue;
        }

        //  -----  abrir comentario de línea  -----
        if (char === "/" && nextChar === "/") {
            inLineComment = true;
            cursor += 2;

            continue;
        }

        //  -----  abrir comentario de bloque  -----
        if (char === "/" && nextChar === "*") {
            inBlockComment = true;
            cursor += 2;

            continue;
        }

        //  -----  abrir cadena simple  -----
        if (char === "'") {
            inSingle = true;
            cursor += 1;

            continue;
        }

        //  -----  abrir cadena doble  -----
        if (char === '"') {
            inDouble = true;
            cursor += 1;

            continue;
        }

        //  -----  abrir plantilla  -----
        if (char === "`") {
            inTemplate = true;
            cursor += 1;

            continue;
        }

        //  -----  punto y coma al nivel de la sentencia  -----
        if (
            char === ";" &&
            brace === braceDepth &&
            paren === 0 &&
            bracket === 0 &&
            templateMarks.length === 0
        ) {
            //  -----  devolver la posición tras el punto y coma  -----
            return cursor + 1;
        }

        //  -----  abrir llave  -----
        if (char === "{") {
            //  -----  el bloque pertenece a esta sentencia  -----
            if (brace === braceDepth && paren === 0 && bracket === 0) {
                openedBlock = true;
            }

            brace += 1;
        }
        //  -----  cerrar llave  -----
        else if (char === "}") {
            brace -= 1;

            //  -----  cierre del bloque de una función sin punto y coma  -----
            if (
                openedBlock &&
                brace === braceDepth &&
                paren === 0 &&
                bracket === 0 &&
                templateMarks.length === 0
            ) {
                /** @type {number} - `siguiente carácter tras el bloque` */
                const afterBlock = skipSpaceAndComments(source, cursor + 1);

                //  -----  incluir el punto y coma si existe  -----
                if (source[afterBlock] === ";") {
                    //  -----  devolver la posición tras el punto y coma  -----
                    return afterBlock + 1;
                }

                //  -----  devolver la posición tras la llave  -----
                return cursor + 1;
            }
        }
        //  -----  abrir paréntesis  -----
        else if (char === "(") {
            paren += 1;
        }
        //  -----  cerrar paréntesis  -----
        else if (char === ")") {
            paren -= 1;
        }
        //  -----  abrir corchete  -----
        else if (char === "[") {
            bracket += 1;
        }
        //  -----  cerrar corchete  -----
        else if (char === "]") {
            bracket -= 1;
        }

        cursor += 1;
    }

    //  -----  la sentencia llega hasta el final del archivo  -----
    return source.length;
}

/**
 * ---------------------------------------------
 * -----  `fixDeclarationSpacing(source)`  -----
 * ---------------------------------------------
 * Deja tres líneas en blanco entre función y función, variable y función, función y variable, y alrededor de cada interfaz.
 * @param {string} source - Contenido del archivo.
 * @returns {string} - Contenido con el espaciado de declaraciones aplicado.
 */
function fixDeclarationSpacing(source) {
    /** @type {{ kind: "fn" | "var" | "iface" | "type", start: number, end: number, depth: number }[]} - `declaraciones del archivo` */
    const declarations = collectDeclarations(source);

    /** @type {string} - `contenido con los huecos ya reescritos` */
    let result = source;

    //  -----  reescribir desde el final para conservar los índices anteriores  -----
    for (
        /** @type {number} */ let index = declarations.length - 1;
        index >= 1;
        index -= 1
    ) {
        /** @type {{ kind: "fn" | "var" | "iface" | "type", start: number, end: number, depth: number }} - `declaración anterior` */
        const previous = declarations[index - 1];

        /** @type {{ kind: "fn" | "var" | "iface" | "type", start: number, end: number, depth: number }} - `declaración actual` */
        const current = declarations[index];

        //  -----  solo separar declaraciones hermanas  -----
        if (previous.depth !== current.depth) {
            continue;
        }

        /** @type {number} - `inicio del comentario pegado a la declaración actual` */
        const currentLead = leadStart(source, current.start);

        //  -----  el comentario no puede solaparse con la declaración anterior  -----
        if (currentLead < previous.end) {
            continue;
        }

        /** @type {string} - `texto entre las dos declaraciones` */
        const gap = source.slice(previous.end, currentLead);

        //  -----  no hay solo espacio: hay otra sentencia en medio  -----
        if (!/^\s*$/.test(gap)) {
            continue;
        }

        /** @type {boolean} - `true si el par pide tres líneas en blanco` */
        const needsThreeLines =
            previous.kind === "iface" ||
            current.kind === "iface" ||
            (previous.kind === "fn" && current.kind === "fn") ||
            (previous.kind === "var" && current.kind === "fn") ||
            (previous.kind === "fn" && current.kind === "var");

        //  -----  este par no cambia de espaciado  -----
        if (!needsThreeLines) {
            continue;
        }

        result =
            result.slice(0, previous.end) +
            "\n\n\n\n" +
            result.slice(currentLead);
    }

    //  -----  devolver el contenido separado  -----
    return result;
}

/**
 * --------------------------------------------------
 * -----  `fixLeadingBlankInFunctions(source)`  -----
 * --------------------------------------------------
 * Deja una línea en blanco al inicio y al final del cuerpo de cada función.
 * @param {string} source - Contenido del archivo.
 * @returns {string} - Contenido con la línea en blanco inicial de cada función.
 */
function fixLeadingBlankInFunctions(source) {
    /** @type {number[]} - `posiciones donde insertar el salto inicial` */
    const inserts = [];

    /** @type {number} - `índice de lectura` */
    let cursor = 0;

    /** @type {number} - `profundidad de paréntesis` */
    let parenDepth = 0;

    /** @type {number} - `profundidad de corchetes` */
    let bracketDepth = 0;

    /** @type {boolean} - `true dentro de un comentario de línea` */
    let inLineComment = false;

    /** @type {boolean} - `true dentro de un comentario de bloque` */
    let inBlockComment = false;

    /** @type {boolean} - `true dentro de una cadena simple` */
    let inSingle = false;

    /** @type {boolean} - `true dentro de una cadena doble` */
    let inDouble = false;

    /** @type {boolean} - `true dentro de una plantilla` */
    let inTemplate = false;

    /** @type {boolean} - `true si el carácter anterior escapa el actual` */
    let escaped = false;

    /** @type {number[]} - `profundidad de llaves al abrir cada interpolación` */
    const templateMarks = [];

    /** @type {number} - `profundidad de llaves` */
    let braceDepth = 0;

    /** @type {number[]} - `profundidad de cada cuerpo de función abierto` */
    const functionDepths = [];

    /** @type {boolean} - `true si la siguiente llave abre el cuerpo de una flecha` */
    let expectArrowBrace = false;

    /** @type {boolean} - `true si la siguiente llave a nivel de sentencia abre un function` */
    let expectFunctionBrace = false;

    //  -----  recorrer el archivo  -----
    while (cursor < source.length) {
        /** @type {string} - `carácter actual` */
        const char = source[cursor];

        /** @type {string} - `carácter siguiente` */
        const nextChar = source[cursor + 1] ?? "";

        //  -----  comentario de línea  -----
        if (inLineComment) {
            //  -----  el salto de línea cierra el comentario  -----
            if (char === "\n") {
                inLineComment = false;
            }

            cursor += 1;

            continue;
        }

        //  -----  comentario de bloque  -----
        if (inBlockComment) {
            //  -----  cerrar comentario de bloque  -----
            if (char === "*" && nextChar === "/") {
                inBlockComment = false;
                cursor += 2;

                continue;
            }

            cursor += 1;

            continue;
        }

        //  -----  cadena simple  -----
        if (inSingle) {
            //  -----  consumir escape  -----
            if (escaped) {
                escaped = false;
            }
            //  -----  marcar escape  -----
            else if (char === "\\") {
                escaped = true;
            }
            //  -----  cerrar cadena simple  -----
            else if (char === "'") {
                inSingle = false;
            }

            cursor += 1;

            continue;
        }

        //  -----  cadena doble  -----
        if (inDouble) {
            //  -----  consumir escape  -----
            if (escaped) {
                escaped = false;
            }
            //  -----  marcar escape  -----
            else if (char === "\\") {
                escaped = true;
            }
            //  -----  cerrar cadena doble  -----
            else if (char === '"') {
                inDouble = false;
            }

            cursor += 1;

            continue;
        }

        //  -----  plantilla  -----
        if (inTemplate) {
            //  -----  consumir escape  -----
            if (escaped) {
                escaped = false;
                cursor += 1;

                continue;
            }

            //  -----  marcar escape  -----
            if (char === "\\") {
                escaped = true;
                cursor += 1;

                continue;
            }

            //  -----  cerrar plantilla  -----
            if (char === "`") {
                inTemplate = false;
                cursor += 1;

                continue;
            }

            //  -----  entrar en la interpolación  -----
            if (char === "$" && nextChar === "{") {
                templateMarks.push(braceDepth);
                inTemplate = false;
                braceDepth += 1;
                cursor += 2;

                continue;
            }

            cursor += 1;

            continue;
        }

        //  -----  cerrar interpolación  -----
        if (
            char === "}" &&
            templateMarks.length > 0 &&
            braceDepth - 1 === templateMarks[templateMarks.length - 1]
        ) {
            braceDepth -= 1;
            templateMarks.pop();
            inTemplate = true;
            cursor += 1;

            continue;
        }

        //  -----  abrir comentario de línea  -----
        if (char === "/" && nextChar === "/") {
            inLineComment = true;
            cursor += 2;

            continue;
        }

        //  -----  abrir comentario de bloque  -----
        if (char === "/" && nextChar === "*") {
            inBlockComment = true;
            cursor += 2;

            continue;
        }

        //  -----  abrir cadena simple  -----
        if (char === "'") {
            inSingle = true;
            cursor += 1;

            continue;
        }

        //  -----  abrir cadena doble  -----
        if (char === '"') {
            inDouble = true;
            cursor += 1;

            continue;
        }

        //  -----  abrir plantilla  -----
        if (char === "`") {
            inTemplate = true;
            cursor += 1;

            continue;
        }

        //  -----  marcar el cuerpo de una función flecha  -----
        if (char === "=" && nextChar === ">") {
            expectArrowBrace = true;
            cursor += 2;

            continue;
        }

        //  -----  marcar el cuerpo de una función clásica  -----
        if (
            source.startsWith("function", cursor) &&
            !/[A-Za-z0-9_$]/.test(source[cursor - 1] ?? "") &&
            !/[A-Za-z0-9_$]/.test(source[cursor + 8] ?? "")
        ) {
            expectFunctionBrace = true;
            cursor += 8;

            continue;
        }

        //  -----  llave que puede abrir un cuerpo de función  -----
        if (char === "{") {
            /** @type {boolean} - `true si esta llave abre el cuerpo de una función` */
            const opensFunction =
                expectArrowBrace ||
                (expectFunctionBrace &&
                    parenDepth === 0 &&
                    bracketDepth === 0 &&
                    templateMarks.length === 0);

            //  -----  la flecha no iba seguida de un bloque  -----
            if (!opensFunction && expectArrowBrace) {
                expectArrowBrace = false;
            }

            //  -----  consumir la llave de la función clásica  -----
            if (opensFunction && expectFunctionBrace) {
                expectFunctionBrace = false;
            }

            //  -----  consumir la llave de la flecha  -----
            if (opensFunction && expectArrowBrace) {
                expectArrowBrace = false;
            }

            //  -----  insertar el salto si el cuerpo ya tiene instrucciones  -----
            if (opensFunction) {
                /** @type {number} - `primer carácter tras la llave` */
                let afterBrace = cursor + 1;

                //  -----  ignorar espacios en la misma línea  -----
                while (
                    source[afterBrace] === " " ||
                    source[afterBrace] === "\t"
                ) {
                    afterBrace += 1;
                }

                //  -----  el cuerpo está en las líneas siguientes  -----
                if (source[afterBrace] === "\n") {
                    /** @type {number} - `primer carácter de la línea siguiente` */
                    let nextLine = afterBrace + 1;

                    //  -----  ignorar la indentación de esa línea  -----
                    while (
                        source[nextLine] === " " ||
                        source[nextLine] === "\t"
                    ) {
                        nextLine += 1;
                    }

                    //  -----  añadir el salto solo si falta y el cuerpo no está vacío  -----
                    if (source[nextLine] !== "\n" && source[nextLine] !== "}") {
                        inserts.push(afterBrace + 1);
                    }
                }
            }

            braceDepth += 1;

            //  -----  recordar la profundidad del cuerpo de la función  -----
            if (opensFunction) {
                functionDepths.push(braceDepth);
            }

            cursor += 1;

            continue;
        }

        //  -----  un token distinto de la llave anula la flecha pendiente  -----
        if (!/\s/.test(char) && expectArrowBrace) {
            expectArrowBrace = false;
        }

        //  -----  abrir paréntesis  -----
        if (char === "(") {
            parenDepth += 1;
        }
        //  -----  cerrar paréntesis  -----
        else if (char === ")") {
            parenDepth -= 1;
        }
        //  -----  abrir corchete  -----
        else if (char === "[") {
            bracketDepth += 1;
        }
        //  -----  cerrar corchete  -----
        else if (char === "]") {
            bracketDepth -= 1;
        }
        //  -----  cerrar llave que no es interpolación  -----
        else if (char === "}") {
            //  -----  esta llave cierra el cuerpo de una función  -----
            if (
                functionDepths.length > 0 &&
                braceDepth === functionDepths[functionDepths.length - 1]
            ) {
                functionDepths.pop();

                /** @type {number} - `cursor hacia atrás desde la llave de cierre` */
                let beforeBrace = cursor - 1;

                //  -----  ignorar la indentación de la llave  -----
                while (
                    beforeBrace >= 0 &&
                    (source[beforeBrace] === " " ||
                        source[beforeBrace] === "\t")
                ) {
                    beforeBrace -= 1;
                }

                //  -----  la llave está al principio de su línea  -----
                if (source[beforeBrace] === "\n") {
                    /** @type {number} - `inicio de la línea anterior` */
                    const previousLineStart =
                        source.lastIndexOf("\n", beforeBrace - 1) + 1;

                    /** @type {string} - `texto de la línea anterior` */
                    const previousLine = source.slice(
                        previousLineStart,
                        beforeBrace,
                    );

                    //  -----  dejar el salto si la última instrucción no lo tiene  -----
                    if (
                        previousLine.trim() !== "" &&
                        !previousLine.trim().endsWith("{")
                    ) {
                        inserts.push(beforeBrace + 1);
                    }
                }
            }

            braceDepth -= 1;
        }

        cursor += 1;
    }

    /** @type {string} - `contenido con los saltos iniciales ya insertados` */
    let result = source;

    //  -----  insertar desde el final para conservar los índices anteriores  -----
    for (
        /** @type {number} */ let index = inserts.length - 1;
        index >= 0;
        index -= 1
    ) {
        /** @type {number} - `posición del salto a insertar` */
        const insertAt = inserts[index];

        result = result.slice(0, insertAt) + "\n" + result.slice(insertAt);
    }

    //  -----  devolver el contenido con el salto inicial de cada función  -----
    return result;
}

/**
 * ------------------------------------------------
 * -----  `interfaceBodyOpen(source, start)`  -----
 * ------------------------------------------------
 * Localiza la llave que abre el cuerpo de una interfaz.
 * @param {string} source - Contenido del archivo.
 * @param {number} start - Índice de la palabra interface.
 * @returns {number} - Índice de la llave, o -1 si no hay cuerpo.
 */
function interfaceBodyOpen(source, start) {
    /** @type {number} - `índice de lectura` */
    let cursor = start;

    /** @type {number} - `profundidad de genéricos` */
    let angle = 0;

    /** @type {number} - `profundidad de paréntesis` */
    let paren = 0;

    //  -----  buscar la llave del cuerpo  -----
    while (cursor < source.length) {
        /** @type {string} - `carácter actual` */
        const char = source[cursor];

        //  -----  abrir genérico  -----
        if (char === "<") {
            angle += 1;
        }
        //  -----  cerrar genérico  -----
        else if (char === ">") {
            angle -= 1;
        }
        //  -----  abrir paréntesis  -----
        else if (char === "(") {
            paren += 1;
        }
        //  -----  cerrar paréntesis  -----
        else if (char === ")") {
            paren -= 1;
        }
        //  -----  llave del cuerpo  -----
        else if (char === "{" && angle === 0 && paren === 0) {
            //  -----  devolver el índice de la llave  -----
            return cursor;
        }
        //  -----  la interfaz no tiene cuerpo  -----
        else if (char === ";" && angle === 0 && paren === 0) {
            //  -----  no hay llave  -----
            return -1;
        }

        cursor += 1;
    }

    //  -----  no se encontró el cuerpo  -----
    return -1;
}

/**
 * ---------------------------------------------
 * -----  `fixInterfaceBodyBlank(source)`  -----
 * ---------------------------------------------
 * Deja una línea en blanco tras la llave que abre cada interfaz.
 * @param {string} source - Contenido del archivo.
 * @returns {string} - Contenido con el salto inicial de cada interfaz.
 */
function fixInterfaceBodyBlank(source) {
    /** @type {{ kind: "fn" | "var" | "iface" | "type", start: number, end: number, depth: number }[]} - `interfaces del archivo` */
    const interfaces = collectDeclarations(source).filter((declaration) => {

        //  -----  quedarse solo con las interfaces  -----
        return declaration.kind === "iface";

    });

    /** @type {number[]} - `índices donde insertar el salto` */
    const inserts = [];

    //  -----  revisar el cuerpo de cada interfaz  -----
    for (const declaration of interfaces) {
        /** @type {number} - `llave que abre el cuerpo` */
        const open = interfaceBodyOpen(source, declaration.start);

        //  -----  sin cuerpo no hay salto que añadir  -----
        if (open < 0) {
            continue;
        }

        /** @type {number} - `primer carácter tras la llave` */
        let next = open + 1;

        //  -----  el cuerpo está en la misma línea  -----
        if (source[next] !== "\n") {
            continue;
        }

        /** @type {number} - `inicio de la línea siguiente` */
        const afterNewline = next + 1;

        //  -----  añadir el salto si falta y el cuerpo no está vacío  -----
        if (source[afterNewline] !== "\n" && source[afterNewline] !== "}") {
            inserts.push(afterNewline);
        }
    }

    /** @type {string} - `contenido con los saltos ya insertados` */
    let result = source;

    //  -----  insertar desde el final para conservar los índices  -----
    for (
        /** @type {number} */ let index = inserts.length - 1;
        index >= 0;
        index -= 1
    ) {
        /** @type {number} - `posición del salto` */
        const insertAt = inserts[index];

        result = result.slice(0, insertAt) + "\n" + result.slice(insertAt);
    }

    //  -----  devolver el contenido con el salto inicial de cada interfaz  -----
    return result;
}

/**
 * -------------------------------------------
 * -----  `fixInterfaceMargins(source)`  -----
 * -------------------------------------------
 * Deja tres líneas en blanco antes y después de cada interfaz.
 * @param {string} source - Contenido del archivo.
 * @returns {string} - Contenido con el margen de cada interfaz.
 */
function fixInterfaceMargins(source) {
    /** @type {{ kind: "fn" | "var" | "iface" | "type", start: number, end: number, depth: number }[]} - `interfaces del archivo` */
    const interfaces = collectDeclarations(source).filter((declaration) => {

        //  -----  quedarse solo con las interfaces  -----
        return declaration.kind === "iface";

    });

    /** @type {{ start: number, end: number }[]} - `huecos de espacio que hay que dejar en tres líneas` */
    const gaps = [];

    //  -----  anotar el espacio anterior y posterior de cada interfaz  -----
    for (const declaration of interfaces) {
        /** @type {number} - `inicio del comentario de la interfaz` */
        const lead = leadStart(source, declaration.start);

        /** @type {number} - `fin del contenido anterior` */
        let before = lead;

        //  -----  retroceder por el espacio que precede a la interfaz  -----
        while (before > 0 && /\s/.test(source[before - 1])) {
            before -= 1;
        }

        //  -----  hay contenido antes de la interfaz  -----
        if (before > 0 && before < lead) {
            gaps.push({
                start: before,
                end: lead,
            });
        }

        /** @type {number} - `inicio del contenido posterior` */
        let after = declaration.end;

        //  -----  avanzar por el espacio que sigue a la interfaz  -----
        while (after < source.length && /\s/.test(source[after])) {
            after += 1;
        }

        //  -----  hay contenido después de la interfaz  -----
        if (after < source.length && after > declaration.end) {
            gaps.push({
                start: declaration.end,
                end: after,
            });
        }
    }

    /** @type {{ start: number, end: number }[]} - `huecos unidos cuando se solapan` */
    const merged = [];

    //  -----  unir huecos que describen el mismo espacio  -----
    for (const gap of gaps.sort((left, right) => left.start - right.start)) {
        /** @type {{ start: number, end: number } | undefined} - `último hueco ya unido` */
        const last = merged.at(-1);

        //  -----  ampliar el hueco anterior si se tocan  -----
        if (last && gap.start <= last.end) {
            last.end = Math.max(last.end, gap.end);

            continue;
        }

        merged.push({
            start: gap.start,
            end: gap.end,
        });
    }

    /** @type {string} - `contenido con los márgenes ya reescritos` */
    let result = source;

    //  -----  reescribir desde el final para conservar los índices  -----
    for (
        /** @type {number} */ let index = merged.length - 1;
        index >= 0;
        index -= 1
    ) {
        /** @type {{ start: number, end: number }} - `hueco a normalizar` */
        const gap = merged[index];

        result =
            result.slice(0, gap.start) + "\n\n\n\n" + result.slice(gap.end);
    }

    //  -----  devolver el contenido con tres líneas alrededor de cada interfaz  -----
    return result;
}

/**
 * ----------------------------------------------------
 * -----  `applyProjectStyle(content, filePath)`  -----
 * ----------------------------------------------------
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
        //  -----  separar declaraciones solo dentro del frontmatter  -----
        formatted = formatted.replace(
            /^---\n([\s\S]*?)\n---\n/,
            (/** @type {string} */ _match, /** @type {string} */ inner) => {

                /** @type {string} - `frontmatter sin líneas en blanco en los extremos` */
                const body = inner.replace(/^\n+/, "").replace(/\n+$/, "");

                //  -----  reconstruir el frontmatter con el espaciado de declaraciones  -----
                return `---\n\n${fixInterfaceBodyBlank(fixLeadingBlankInFunctions(fixInterfaceMargins(fixDeclarationSpacing(body))))}\n\n---\n`;

            },
        );
    }
    //  -----  separar variables y funciones en js, mjs y ts  -----
    else {
        formatted = fixInterfaceBodyBlank(
            fixLeadingBlankInFunctions(
                fixInterfaceMargins(fixDeclarationSpacing(formatted)),
            ),
        );
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
