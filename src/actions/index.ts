/*
    *  -------------------------------------------------  *
    *  -----  index.ts  --  /src/actions/index.ts  -----  *
    *  -------------------------------------------------  *
 */

import { getGreeting } from "@/src/actions/greeting/get-greeting.actions";
import { getPostLikes } from "@/src/actions/posts/get-post-likes.actions";
import { updateLikes } from "@/src/actions/posts/update-likes.action";


/**
 * -------------------------
 * -----  `server {}`  -----
 * -------------------------  
 * Actions definidas para el servidor.
 */
export const server = {
    getGreeting,
    getPostLikes,
    updateLikes,
};
