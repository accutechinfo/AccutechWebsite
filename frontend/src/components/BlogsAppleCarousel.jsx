import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import "./BlogsAppleCarousel.css";

const plainText = (value = "") => String(value ?? "")
  .replace(/<[^>]*>/g, " ")
  .replace(/&nbsp;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;/gi, "'")
  .replace(/\s+/g, " ").trim();

function BlogImage({ src, fallback, alt }) {
  const [image, setImage] = useState(src || fallback);
  useEffect(() => setImage(src || fallback), [src, fallback]);
  return <img src={image} alt={alt} loading="lazy" onError={() => { if (image !== fallback) setImage(fallback); }} />;
}

export default function BlogsAppleCarousel({ posts = [], fallbackImage = "/uploads/blogs/accounts1.webp" }) {
  const railRef = useRef(null);
  const modalRef = useRef(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!selected) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => { if (e.key === "Escape") setSelected(null); };
    document.addEventListener("keydown", onKeyDown);
    modalRef.current?.focus();
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener("keydown", onKeyDown); };
  }, [selected]);

  function step(direction) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector(".ablog-card");
    const width = card?.getBoundingClientRect().width || 340;
    rail.scrollBy({ left: direction * (width + 20), behavior: "smooth" });
  }

  if (!posts.length) return null;

  return (
    <section className="ablog-section" aria-labelledby="ablog-heading">
      <div className="ablog-head">
        <div>
          <span className="ablog-kicker">INSIGHTS & ARTICLES</span>
          <h2 id="ablog-heading">Discover our <strong>latest stories.</strong></h2>
          <p>Practical ideas on accounting, inventory, GST and smarter business operations.</p>
        </div>
        <div className="ablog-controls">
          <button type="button" onClick={() => step(-1)} aria-label="Previous blog"><ArrowLeft size={20} /></button>
          <button type="button" onClick={() => step(1)} aria-label="Next blog"><ArrowRight size={20} /></button>
        </div>
      </div>

      <div className="ablog-track" ref={railRef} aria-label="Latest blog articles">
        {posts.map((post, index) => {
          const title = plainText(post.title) || "Accutech ERP Insights";
          const image = post.image_url || post.imageUrl || post.image || fallbackImage;
          const category = plainText(post.category?.name || post.category_name || post.category || (typeof post.tags === "string" ? post.tags.split(",")[0] : "Blog"));
          return (
            <button className="ablog-card" type="button" key={post.id || post.slug || index}
              onClick={() => setSelected(post)} aria-label={`Read details for ${title}`}>
              <BlogImage src={image} fallback={fallbackImage} alt="" />
              <div className="ablog-image-shade" />
              <div className="ablog-card-top">{category || "BLOG"}</div>
              <div className="ablog-card-bottom"><h3>{title}</h3><span className="ablog-card-icon"><ArrowUpRight size={22} /></span></div>
            </button>
          );
        })}
      </div>

      <div className="ablog-footer">
        <span>Swipe or use the arrows to discover more</span>
        <Link to="/blogs">View All Blogs <ArrowUpRight size={17} /></Link>
      </div>

      {selected && (
        <div className="ablog-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="ablog-modal" ref={modalRef} role="dialog" aria-modal="true" tabIndex={-1} aria-label={plainText(selected.title)}>
            <button className="ablog-close" type="button" onClick={() => setSelected(null)} aria-label="Close article details"><X size={22} /></button>
            <div className="ablog-modal-image">
              <BlogImage src={selected.image_url || selected.imageUrl || selected.image} fallback={fallbackImage} alt="" />
            </div>
            <div className="ablog-modal-body">
              <span className="ablog-kicker">ACCUTECH ERP BLOG</span>
              <h2>{plainText(selected.title)}</h2>
              {selected.published_at && <small>{new Date(selected.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })}</small>}
              <p>{plainText(selected.excerpt || selected.short_description || selected.description || "Explore the full article for more insights and practical business guidance.").slice(0, 430)}</p>
              {selected.slug && <Link to={`/blog/${selected.slug}`} onClick={() => setSelected(null)}>Read Full Article <ArrowUpRight size={18} /></Link>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
