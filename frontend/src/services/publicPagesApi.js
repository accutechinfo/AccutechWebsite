
/**
 * Accutech ERP - Public Pages API
 *
 * Used by:
 * - Home.jsx
 * - Pages.jsx
 * - PageDetail.jsx
 *
 * All API URLs are relative and deployment-safe.
 */

const API_BASE = (
  import.meta.env.VITE_API_URL || "/api"
).replace(/\/+$/, "");

const ASSET_BASE = import.meta.env.BASE_URL || "/";

/**
 * Build URL for frontend public assets.
 */
export function localAsset(path = "") {
  return (
    ASSET_BASE +
    String(path).replace(/^\/+/, "")
  );
}

/**
 * Decode HTML entities, including repeatedly encoded
 * values such as &amp;amp;.
 */
export function decodePageText(value = "") {
  if (value === null || value === undefined) {
    return "";
  }

  let text = String(value);

  const textarea = document.createElement("textarea");

  for (let i = 0; i < 5; i++) {
    textarea.innerHTML = text;

    const decoded = textarea.value;

    if (decoded === text) {
      break;
    }

    text = decoded;
  }

  return text;
}

/**
 * Generate a React Router page link.
 */
export function publicPagePath(slug) {
  if (!slug || String(slug).trim() === "#") {
    return "/pages";
  }

  return `/page/${encodeURIComponent(String(slug).trim())}`;
}

/**
 * Resolve Laravel page banner image.
 *
 * Database:
 * banner_image = abc123.webp
 *
 * Backend file:
 * backend/public/uploads/pages/abc123.webp
 *
 * Frontend URL:
 * /uploads/pages/abc123.webp
 */
export function pageBannerUrl(page) {
  const value =
    typeof page === "string"
      ? page
      : page?.banner_url ||
        page?.image_url ||
        page?.image ||
        page?.banner_image ||
        "";

  if (!value || typeof value !== "string") {
    return null;
  }

  const image = value.trim().replace(/\\/g, "/");

  if (!image) {
    return null;
  }

  // Existing absolute URL supplied by Laravel
  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  // Existing relative Laravel upload path
  if (image.startsWith("/uploads/")) {
    return image;
  }

  if (image.startsWith("uploads/")) {
    return `/${image}`;
  }

  // Laravel database stores filenames
  const filename = image.split("/").pop();

  if (!filename) {
    return null;
  }

  return `/uploads/pages/${encodeURIComponent(filename)}`;
}

/**
 * Common GET request.
 */
async function request(url, signal) {
  const response = await fetch(url, {
    method: "GET",
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ||
      `Pages API error: ${response.status}`
    );
  }

  if (result?.success === false) {
    throw new Error(
      result.message || "Unable to load pages."
    );
  }

  return result;
}

/**
 * GET /api/pages
 *
 * Return published pages.
 */
export async function fetchPublicPages(signal) {
  const result = await request(
    `${API_BASE}/pages`,
    signal
  );

  const pages = Array.isArray(result)
    ? result
    : Array.isArray(result?.data)
    ? result.data
    : Array.isArray(result?.data?.data)
    ? result.data.data
    : [];

  return pages.map((page) => ({
    ...page,

    title: decodePageText(
      page.title || page.name || ""
    ),

    excerpt: decodePageText(
      page.excerpt ||
      page.short_description ||
      ""
    ),

    banner_url: pageBannerUrl(page),
  }));
}

/**
 * GET /api/pages/{slug}
 *
 * Return individual published page.
 */
export async function fetchPublicPage(slug, signal) {
  if (!slug) {
    throw new Error("Page slug is required.");
  }

  const result = await request(
    `${API_BASE}/pages/${encodeURIComponent(slug)}`,
    signal
  );

  const page = result?.data || result;

  if (!page || typeof page !== "object") {
    throw new Error("Page not found.");
  }

  return {
    ...page,

    title: decodePageText(
      page.title || page.name || ""
    ),

    excerpt: decodePageText(
      page.excerpt ||
      page.short_description ||
      ""
    ),

    banner_url: pageBannerUrl(page),
  };
}

/**
 * GET /api/pages/categories
 *
 * Return industry categories and their subcategories.
 */
export async function fetchPageCategories(signal) {
  const result = await request(
    `${API_BASE}/pages/categories`,
    signal
  );

  const categories = Array.isArray(result)
    ? result
    : Array.isArray(result?.data)
    ? result.data
    : [];

  return categories.map((category) => ({
    ...category,

    name: decodePageText(
      category.name || category.title || ""
    ),

    icon_class: category.icon_class || "",

    subcategories: (
      Array.isArray(category.subcategories)
        ? category.subcategories
        : []
    ).map((sub) => ({
      ...sub,

      name: decodePageText(
        sub.name || sub.title || ""
      ),

      icon_class: sub.icon_class || "",

      page_slug: sub.page_slug || null,
    })),
  }));
}

/**
 * Compatibility aliases.
 *
 * Home.jsx previously imported
 * fetchIndustryCategories.
 *
 * Keep both names available to avoid build errors.
 */
export const fetchIndustryCategories = fetchPageCategories;

export const fetchPublicPageCategories = fetchPageCategories;
