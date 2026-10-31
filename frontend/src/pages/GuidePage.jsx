import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import guides from "../data/guideContent.json";
import "./GuidePage.css";

export const guideLinks = Object.values(guides).map(({ title, slug }) => ({ title, slug, to: `/guide/${slug}` }));

export default function GuidePage() {
  const { slug } = useParams();
  const { hash } = useLocation();
  const guide = Object.values(guides).find((entry) => entry.slug === slug);
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!guide) return;
    document.title = `${guide.title} | Accutech ERP`;
    const onScroll = () => {
      let current = "";
      for (const heading of guide.headings) {
        const el = document.getElementById(heading.id);
        if (el && el.getBoundingClientRect().top <= 155) current = heading.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [guide]);

  useEffect(() => {
    if (!guide || !hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const timer = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
    return () => clearTimeout(timer);
  }, [guide, hash]);

  if (!guide) return <section className="guide-missing"><h1>Guide not found</h1><Link to="/">Back to Home</Link></section>;

  return (
    <div className="acc-guide-page">
      <section className="acc-guide-hero"><div className="container">
        <div className="acc-guide-breadcrumb"><Link to="/">Home</Link><span>/</span><span>Guide</span></div>
        <span className="acc-guide-badge">{guide.badge}</span>
        <h1>{guide.title}</h1><p>{guide.description}</p>
      </div></section>
      <section className="acc-guide-main"><div className="container acc-guide-layout">
        <aside className="acc-guide-sidebar" aria-label="Table of contents"><nav className="acc-guide-toc">
          <h2>Table of Contents</h2>
          {guide.headings.map((heading) => (
            <a key={heading.id} className={`acc-toc-link ${heading.level === "h3" ? "acc-toc-sub" : ""} ${active === heading.id ? "active" : ""}`}
              href={`#${heading.id}`} aria-current={active === heading.id ? "location" : undefined}
              onClick={(event) => {
                event.preventDefault();
                window.history.replaceState(null, "", `${window.location.pathname}#${heading.id}`);
                document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                setActive(heading.id);
              }}>{heading.text}</a>
          ))}
        </nav></aside>
        <article className="acc-guide-article" dangerouslySetInnerHTML={{ __html: guide.html }} />
      </div></section>
    </div>
  );
}
