#!/usr/bin/env bash
# Sincroniza wiki/*.md con el repositorio GitHub Wiki del proyecto.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WIKI_SRC="${ROOT}/wiki"
DEFAULT_REPO="AntoniCut/02-devtalles--astro--05-astro-http-db-turso"
WORK_DIR="$(mktemp -d)"

cleanup() {
    rm -rf "${WORK_DIR}"
}
trap cleanup EXIT

wiki_help() {
    cat >&2 <<EOF

No se pudo acceder al repositorio GitHub Wiki (*.wiki.git).

Comprueba, en este orden:

  1. Wikis activadas
     https://github.com/${DEFAULT_REPO}/settings
     → Features → Wikis ✓

  2. Sesión de Git con acceso al repo (HTTPS o SSH)
     Si el repo es privado, "Repository not found" suele ser falta de permiso o login.

  3. Primera publicación (wiki vacía)
     En la pestaña Wiki del repo, pulsa "Create the first page" y guarda Home,
     o vuelve a ejecutar este script (intentará push inicial).

  4. Misma autenticación que origin
     origin actual: $(git -C "${ROOT}" remote get-url origin 2>/dev/null || echo "(sin remote)")

Documentación: wiki/Publicar-en-GitHub.md

EOF
}

resolve_wiki_git_url() {
    local origin=""
    origin="$(git -C "${ROOT}" remote get-url origin 2>/dev/null || true)"

    if [[ "${origin}" =~ ^git@github\.com:([^/]+)/(.+)\.git$ ]]; then
        echo "git@github.com:${BASH_REMATCH[1]}/${BASH_REMATCH[2]%.git}.wiki.git"
        return 0
    fi

    if [[ "${origin}" =~ github\.com[:/]+([^/]+)/([^/.]+) ]]; then
        echo "https://github.com/${BASH_REMATCH[1]}/${BASH_REMATCH[2]%.git}.wiki.git"
        return 0
    fi

    echo "https://github.com/${DEFAULT_REPO}.wiki.git"
}

copy_wiki_sources() {
    local dest="$1"
    shopt -s nullglob
    local md_files=("${WIKI_SRC}"/*.md)
    if [[ ${#md_files[@]} -eq 0 ]]; then
        echo "No hay archivos .md en ${WIKI_SRC}" >&2
        exit 1
    fi
    cp "${md_files[@]}" "${dest}/"
}

commit_and_push() {
    local repo_dir="$1"
    cd "${repo_dir}"
    git add -A

    if git diff --staged --quiet; then
        echo "Wiki ya está al día; nada que publicar."
        exit 0
    fi

    git commit -m "Sync wiki from main repo ($(date -u +%Y-%m-%dT%H:%MZ))"
    git push origin HEAD
}

initial_wiki_push() {
    local wiki_git="$1"
    local repo_dir="${WORK_DIR}/wiki-init"

    echo "Intentando publicación inicial en ${wiki_git}…"
    mkdir -p "${repo_dir}"
    copy_wiki_sources "${repo_dir}"

    git -C "${repo_dir}" init -q
    git -C "${repo_dir}" add -A
    git -C "${repo_dir}" commit -q -m "Initial wiki from main repo"
    git -C "${repo_dir}" branch -M master
    git -C "${repo_dir}" remote add origin "${wiki_git}"

    if git -C "${repo_dir}" push -u origin master; then
        return 0
    fi

    git -C "${repo_dir}" branch -M main
    git -C "${repo_dir}" push -u origin main
}

if [[ ! -d "${WIKI_SRC}" ]]; then
    echo "No se encontró ${WIKI_SRC}" >&2
    exit 1
fi

WIKI_GIT="$(resolve_wiki_git_url)"
echo "Remoto wiki: ${WIKI_GIT}"

if git clone --depth 1 "${WIKI_GIT}" "${WORK_DIR}/wiki" 2>/dev/null; then
    copy_wiki_sources "${WORK_DIR}/wiki"
    commit_and_push "${WORK_DIR}/wiki"
else
    if initial_wiki_push "${WIKI_GIT}"; then
        echo "Wiki inicializada y publicada."
    else
        wiki_help
        exit 128
    fi
fi

echo "Wiki publicada: https://github.com/${DEFAULT_REPO}/wiki"
