// Public URLs use Vite BASE_URL; no localhost or production origin embedded.
const base = (import.meta.env.VITE_API_URL || "/api").trim();
export const API_BASE = base.replace(/\/+$/, "");
export const API_ENDPOINTS = Object.freeze({
  blogs: `${API_BASE}/blogs`,
  enquiries: `${API_BASE}/enquiries`,
  pages: `${API_BASE}/pages`,
  categories: `${API_BASE}/pages/categories`,
});
export async function apiGet(url, signal) {
  const response = await fetch(url, {
    signal, headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}
export function assetPath(relativePath) {
  const basePath = import.meta.env.BASE_URL || "/";
  return `${basePath}${String(relativePath || "").replace(/^\/+/, "")}`;
}
