import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resolve the canonical origin automatically on local, staging, and live deployments.
// VITE_PUBLIC_SITE_URL is optional for installations behind a reverse proxy.
const BASE_URL = (import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, "");
const BASE_PATH = import.meta.env.BASE_URL || "/";
const siteUrl = (path = "") => `${BASE_URL}${BASE_PATH.replace(/\/$/, "")}/${String(path).replace(/^\//, "")}`;
const HOME = {
  title: "Best Cloud ERP Accounting Software for Businesses | Accutech ERP",
  description: "Accutech ERP offers cloud accounting software for billing, GST and inventory, with business reporting and real-time data access.",
  keywords: "best cloud erp accounting software",
};
const pages = {
  "/": HOME,
  "/services/advance-accounting": { title: "Advanced Accounting Software for Businesses | Accutech ERP", description: "Streamline finances with advanced accounting software. Manage ledgers, GST, reports, and business accounting.", keywords: "advance accounting software, cloud accounting software India" },
  "/services/bulk-drug-trading": { title: "Bulk Drug Trading ERP Software | Accutech ERP", description: "Manage bulk drug trading inventory, batch tracking, accounting and business transactions with Accutech ERP." },
  "/services/fmcg-distribution": { title: "FMCG Distribution ERP Software | Accutech ERP", description: "Track stock, sales, purchases and distribution operations with Accutech ERP." },
  "/services/pharma-pcd": { title: "Pharma PCD ERP Software for Business | Accutech ERP", description: "Manage pharma PCD distribution, stock, billing and reports with Accutech ERP." },
  "/services/pharma-manufacturing": { title: "Pharma Manufacturing ERP Software | Accutech ERP", description: "Manage stock, sales, purchase, accounting and pharma manufacturing operations with Accutech ERP." },
  "/services/food-manufacturing": { title: "Food Manufacturing ERP Software | Accutech ERP", description: "Manage food manufacturing inventory, sales and reporting with Accutech ERP." },
  "/services/general-trading": { title: "General Trading ERP Software | Accutech ERP", description: "Manage general trading inventory, accounts and billing with Accutech ERP." },
  "/blogs": { title: "ERP News & Blogs | Accutech ERP", description: "Read articles and insights about ERP software, cloud accounting, GST, inventory and distribution." },
  "/videos": { title: "ERP Video Guides | Accutech ERP", description: "Watch Accutech ERP and SalesApp tutorials and video guides." },
  "/contactus": { title: "Contact Accutech ERP", description: "Contact Accutech ERP for software enquiries, product demos and customer support." },
  "/front/accuchat": { title: "AccuChat Business Communication App | Accutech ERP", description: "Explore AccuChat for team communication, task tracking and collaboration." },
  "/front/testimonials": { title: "Customer Testimonials | Accutech ERP", description: "Read testimonials from businesses using Accutech ERP." },
  "/front/privacy_policy": { title: "Privacy Policy | Accutech ERP", description: "Read the Accutech ERP privacy policy." },
  "/policies/terms": { title: "Terms and Conditions | Accutech ERP", description: "Read the terms and conditions for using Accutech ERP." },
};
const privatePaths = /^\/(login|thankyou-contact)(\/|$)/;
function setMeta(name, content, attribute = "name") {
  let tag = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!tag) { tag = document.createElement("meta"); tag.setAttribute(attribute, name); document.head.appendChild(tag); }
  tag.setAttribute("content", content);
}
function setCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
  link.href = url;
}

export default function SiteSEO() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname.replace(/\/$/, "") || "/";
    const metadata = pages[path] || (path.startsWith('/blog/')
      ? { title: "Accutech ERP Blog", description: "Accutech ERP blog article." }
      : { title: "Accutech ERP", description: HOME.description });
    const url = siteUrl(path === "/" ? "" : path);
    document.title = metadata.title;
    setMeta("description", metadata.description);
    setMeta("keywords", metadata.keywords || HOME.keywords);
    setMeta("robots", (import.meta.env.DEV || privatePaths.test(path)) ? "noindex,nofollow" : "index,follow");
    setMeta("og:title", metadata.title, "property");
    setMeta("og:description", metadata.description, "property");
    setMeta("og:url", url, "property");
    setMeta("og:type", "website", "property");
    setCanonical(url);

    const schemas = [
      { "@context": "https://schema.org", "@type": "Organization", name: "Accutech ERP", url: siteUrl(), logo: siteUrl("assets/images/imunim.webp") },
      { "@context": "https://schema.org", "@type": "WebSite", name: "Accutech ERP", url: siteUrl() },
    ];
    if (path !== '/' && !privatePaths.test(path)) {
      schemas.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
        { "@type": "ListItem", position: 2, name: metadata.title.split(' | ')[0], item: url },
      ] });
    }
    let schema = document.head.querySelector('script[data-accu-schema="true"]');
    if (!schema) { schema = document.createElement("script"); schema.type = "application/ld+json"; schema.dataset.accuSchema = "true"; document.head.appendChild(schema); }
    schema.textContent = JSON.stringify(schemas).replace(/</g, "\\u003c");
  }, [location.pathname]);
  return null;
}
