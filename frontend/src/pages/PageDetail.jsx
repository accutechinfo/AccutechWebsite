import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DemoEnquiryForm from "../components/DemoEnquiryForm";
import { fetchPublicPage, pageBannerUrl } from "../services/publicPagesApi";
import "./PageDetail.css";

function decodeEntities(value) {
  if (typeof value !== "string") return "";
  const textarea = document.createElement("textarea");
  let text = value;
  for (let index = 0; index < 5; index++) {
    textarea.innerHTML = text;
    const decoded = textarea.value;
    if (decoded === text) break;
    text = decoded;
  }
  return text;
}


/*
 * Rendering CMS HTML needs server-side sanitization too.
 * The client filter below removes executable elements/attributes and retains
 * headings, tables, images and links used by the existing CodeIgniter articles.
 */
function prepareArticle(html) {
  const raw = decodeEntities(String(html || ""));
  const doc = new DOMParser().parseFromString(raw, "text/html");

  doc.querySelectorAll(
    "script,style,iframe,object,embed,form,button,input,textarea,link,meta,base,svg,math"
  ).forEach((node) => node.remove());

  doc.body.querySelectorAll("*").forEach((el) => {
    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim();
      if (name.startsWith("on") || name === "srcdoc" || name === "style") {
        el.removeAttribute(attr.name);
        continue;
      }
      if (["href", "src", "xlink:href", "formaction"].includes(name) &&
          /^(javascript:|vbscript:|data:)/i.test(value)) {
        el.removeAttribute(attr.name);
      }
      if (name === "srcset") el.removeAttribute(attr.name);
    }
    if (el.tagName === "A" && el.getAttribute("target") === "_blank") {
      el.setAttribute("rel", "noopener noreferrer");
    }
  });

  doc.body.querySelectorAll("p").forEach((p) => {
    if (!p.textContent.trim() && !p.querySelector("img,video")) p.remove();
  });
  doc.body.querySelectorAll("table").forEach((table) => {
    if (table.parentElement?.classList.contains("pd-table-scroll")) return;
    const scroll = doc.createElement("div");
    scroll.className = "pd-table-scroll";
    table.replaceWith(scroll);
    scroll.appendChild(table);
  });

  const used = new Set();
  const toc = [];
  doc.body.querySelectorAll("h2,h3").forEach((heading, index) => {
    const title = heading.textContent.trim();
    if (!title) return;
    let id = heading.id || title.toLowerCase()
      .replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-+$/g, "");
    if (!id) id = `section-${index + 1}`;
    const base = id;
    let suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    heading.id = id;
    toc.push({ id, title, level: heading.tagName.toLowerCase() });
  });

  return { html: doc.body.innerHTML, toc };
}

export default function PageDetail() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState("");
  const [bannerFailed, setBannerFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setPage(null);
    setBannerFailed(false);
    fetchPublicPage(slug, controller.signal)
      .then(setPage)
      .catch((err) => {
        if (!controller.signal.aborted) setError(err.message || "Unable to load this page.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [slug]);

  const article = useMemo(
    () => prepareArticle(page?.content || page?.body || ""),
    [page?.content, page?.body]
  );

  useEffect(() => {
    if (!page || !article.toc.length) return;
    const elements = article.toc
      .map((entry) => document.getElementById(entry.id))
      .filter(Boolean);

    function onScroll() {
      let current = elements[0]?.id || "";
      for (const heading of elements) {
        if (heading.getBoundingClientRect().top <= 165) current = heading.id;
      }
      setActiveId(current);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [page, article]);

  useEffect(() => {
    if (!page || !window.location.hash) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  function jumpTo(event, id) {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
    history.replaceState(null, "", `${window.location.pathname}#${encodeURIComponent(id)}`);
  }

  if (loading) {
    return <main className="pd-status" role="status">Loading page...</main>;
  }
  if (error || !page) {
    return (
      <main className="pd-status">
        <h1>Page unavailable</h1>
        <p role="alert">{error || "This page could not be found."}</p>
        <Link to="/pages">Back to all pages</Link>
      </main>
    );
  }

  const title = decodeEntities(page.title || page.name || "Accutech ERP Solution");
  const excerpt = decodeEntities(page.excerpt || page.short_description || "");
  const image = !bannerFailed ? pageBannerUrl(page) : null;

  return (
    <main className="pd-page">
      <section
        className="pd-hero"
        style={{ backgroundImage: image
          ? `linear-gradient(90deg,rgba(5,24,68,.78) 0%,rgba(5,24,68,.62) 42%,rgba(5,24,68,.30) 72%,rgba(5,24,68,.14) 100%), url("${image.replace(/["\\]/g, "")}")`
          : "linear-gradient(110deg, #09234e 0%, #23539a 65%, #188eae 100%)" }}
      >
        {/* Test image loading separately because CSS background image has no onError. */}
        {image && <img
          src={image}
          alt=""
          hidden
          onError={() => setBannerFailed(true)}
        />}
        <div className="pd-container pd-hero-grid">
          <div className="pd-hero-copy">
            <h1>{title}</h1>
            {excerpt && <p>{excerpt}</p>}
          </div>
          <DemoEnquiryForm variant="hero" source={`Page: ${title}`} />
        </div>
      </section>

      <section className="pd-detail-section">
        <div className="pd-container pd-content-grid">
          <article
            className="pd-article"
            id="pageContent"
            // Only allow trusted, admin-managed CMS content; sanitize at Laravel save/read as well.
            dangerouslySetInnerHTML={{ __html: article.html }}
          />

          <aside className="pd-sidebar" aria-label="Article navigation">
            {article.toc.length > 0 && (
              <div className="pd-toc-card">
                <h2>Table of Contents</h2>
                <nav className="pd-toc-list">
                  {article.toc.map((entry) => (
                    <a
                      key={entry.id}
                      href={`#${entry.id}`}
                      className={[
                        entry.level === "h3" ? "pd-toc-h3" : "",
                        activeId === entry.id ? "active" : "",
                      ].join(" ")}
                      onClick={(event) => jumpTo(event, entry.id)}
                    >
                      {entry.title}
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
