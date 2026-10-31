// Convert legacy Font Awesome 5 classes stored in PostgreSQL to current FA6 equivalents.
// The original database field stays authoritative; these are only compatibility aliases.
const legacyNames = {
  "fa-tshirt": "fa-shirt", "fa-shoe-prints": "fa-shoe-prints",
  "fa-shopping-basket": "fa-basket-shopping", "fa-shopping-cart": "fa-cart-shopping",
  "fa-store-alt": "fa-store", "fa-utensils": "fa-utensils",
  "fa-prescription-bottle-alt": "fa-prescription-bottle-medical",
  "fa-warehouse": "fa-warehouse", "fa-capsules": "fa-capsules",
  "fa-cookie-bite": "fa-cookie-bite", "fa-gamedpad": "fa-gamepad",
};
const categoryDefaults = {
  retail: "fa-solid fa-store", distribution: "fa-solid fa-truck",
  manufacturing: "fa-solid fa-industry", dmsxpert: "fa-solid fa-sitemap",
};
export function DbFaIcon({ iconClass, fallback = "fa-solid fa-circle-check" }) {
  const original = String(iconClass || "").trim();
  const sanitized = original.split(/\s+/).filter(c => /^(fas|far|fab|fa|fa-[a-z0-9-]+)$/.test(c));
  let classes = sanitized.map(c => legacyNames[c] || c);
  if (!classes.length) classes = fallback.split(" ");
  if (!classes.some(c => ["fas", "far", "fab", "fa-solid", "fa-regular", "fa-brands"].includes(c))) classes.unshift("fa-solid");
  return <i className={classes.join(" ")} aria-hidden="true" />;
}
