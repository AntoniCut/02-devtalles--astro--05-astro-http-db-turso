# Publicar en GitHub Wiki

La wiki de GitHub **no** vive en la rama principal: es un repositorio Git aparte (`*.wiki.git`).

Esta carpeta `wiki/` del proyecto es la **fuente versionada**. Sincronízala con GitHub cuando cambies la documentación.

## 1. Activar Wiki en GitHub

1. Abre https://github.com/AntoniCut/02-devtalles--astro--05-astro-http-db-turso/settings
2. **Features** → marca **Wikis**
3. (Opcional) Restringe edición solo a colaboradores
4. Abre la pestaña **Wiki** del repo y, si GitHub lo pide, **Create the first page** (puede ser un Home vacío). Sin este paso, a veces `*.wiki.git` aún no existe.

## Error «Repository not found» al clonar

GitHub devuelve ese mensaje cuando:

| Causa | Qué hacer |
| :---- | :-------- |
| Wikis desactivadas | Actívalas en Settings → Features |
| Wiki nunca inicializada | Crea la primera página en la pestaña Wiki |
| Repo privado sin login | Autentica Git (`gh auth login`, SSH o credential helper) con el mismo usuario que tiene acceso |
| URL distinta a `origin` | El script deduce el remoto wiki desde `git remote get-url origin` (HTTPS o SSH) |

Tras corregir lo anterior, ejecuta de nuevo `pnpm wiki:push`. Si el clone falla pero ya hay Wikis activas, el script intenta un **push inicial** con el contenido de `wiki/`.

## 2. Publicar con el script

Desde la raíz del proyecto (con GitHub autenticado):

```bash
chmod +x scripts/sync-github-wiki.sh
./scripts/sync-github-wiki.sh
```

El script clona o actualiza el repo wiki, copia los `.md` de `wiki/` y hace commit + push.

## 3. Publicar a mano

```bash
git clone https://github.com/AntoniCut/02-devtalles--astro--05-astro-http-db-turso.wiki.git
cd 02-devtalles--astro--05-astro-http-db-turso.wiki
cp ../05-astro-http-db-turso/wiki/*.md .
git add .
git commit -m "Sync wiki from main repo"
git push
```

## 4. Enlaces internos

GitHub Wiki entiende `[[Nombre-de-pagina]]` si existe `Nombre-de-pagina.md`. La barra lateral custom usa `_Sidebar.md`.

Wiki publicada: https://github.com/AntoniCut/02-devtalles--astro--05-astro-http-db-turso/wiki
