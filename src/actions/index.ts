/*
    *  -------------------------------------------------  *
    *  -----  index.ts  --  /src/actions/index.ts  -----  *
    *  -------------------------------------------------  *
*/


import { getGreeting } from "@/src/actions/greeting/get-greeting.actions";


/**
 * -------------------------
 * -----  `server {}`  -----
 * -------------------------  
 * Actions definidas para el servidor.
 */
export const server = {
    
    getGreeting,

};
