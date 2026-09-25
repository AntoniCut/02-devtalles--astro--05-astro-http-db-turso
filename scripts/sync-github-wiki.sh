#!/usr/bin/env bash
# Sincroniza wiki/*.md con el repositorio GitHub Wiki del proyecto.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WIKI_SRC="${ROOT}/wiki"
REPO="AntoniCut/02-devtalles--astro--05-astro-http-db-turso"
WIKI_GIT="https://github.com/${REPO}.wiki.git"
WORK_DIR="$(mktemp -d)"

cleanup() {
    rm -rf "${WORK_DIR}"
}
trap cleanup EXIT

if [[ ! -d "${WIKI_SRC}" ]]; then
    echo "No se encontró ${WIKI_SRC}" >&2
    exit 1
fi

echo "Clonando wiki en ${WORK_DIR}…"
git clone "${WIKI_GIT}" "${WORK_DIR}/wiki"

shopt -s nullglob
md_files=("${WIKI_SRC}"/*.md)
if [[ ${#md_files[@]} -eq 0 ]]; then
    echo "No hay archivos .md en ${WIKI_SRC}" >&2
    exit 1
fi

cp "${md_files[@]}" "${WORK_DIR}/wiki/"

cd "${WORK_DIR}/wiki"
git add -A

if git diff --staged --quiet; then
    echo "Wiki ya está al día; nada que publicar."
    exit 0
fi

git commit -m "Sync wiki from main repo ($(date -u +%Y-%m-%dT%H:%MZ))"
git push origin HEAD

echo "Wiki publicada: https://github.com/${REPO}/wiki"
