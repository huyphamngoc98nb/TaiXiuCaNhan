/**
 * Base URL cua Bundle API server.
 * - Dev: set VITE_API_BASE_URL trong .env.local
 * - Prod: mac dinh tro ve server tren Render
 */
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ??
  'https://taixiucanhan.onrender.com';
