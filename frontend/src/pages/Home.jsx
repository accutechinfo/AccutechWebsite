import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DbFaIcon } from "../components/DbFaIcon";
import {
  ArrowRight, ShieldCheck, FileText, Boxes, ChartNoAxesCombined,
  Users, Play, CheckCircle2, Lock, Send, ChevronDown, ChevronLeft,
  ChevronRight, MapPin, MessageCircle, Quote, ExternalLink,
} from "lucide-react";
import "./Home.css";
import AccutechCharacterHero from "../components/AccutechCharacterHero";
import DemoEnquiryForm from "../components/DemoEnquiryForm";
import TestimonialsMarquee from "../components/TestimonialsMarquee";
import FeaturesGlowGrid from "../components/FeaturesGlowGrid";
import FaqTwoColumn from "../components/FaqTwoColumn";
import VortexContactCTA from "../components/VortexContactCTA";
import AccuChatImageSlider from "../components/AccuChatImageSlider";

import { fetchIndustryCategories, localAsset, publicPagePath } from "../services/publicPagesApi";
import { API_ENDPOINTS, apiGet } from "../services/apiConfig";

const categoryDefaults = {
  retail: "fa-solid fa-store",
  distribution: "fa-solid fa-truck",
  manufacturing: "fa-solid fa-industry",
  dmsxpert: "fa-solid fa-sitemap",
};
const asset = localAsset;
// Vite serves this file directly from frontend/public/assets/images/accounts1.webp.
const BLOG_FALLBACK_IMAGE = "/assets/images/accounts1.webp";
const features = [
  { icon: FileText, title: "GST Billing", description: "Easy invoicing & tax compliance", color: "blue" },
  { icon: Boxes, title: "Inventory", description: "Track stock across locations", color: "green" },
  { icon: ChartNoAxesCombined, title: "Reports", description: "Real-time reports & analytics", color: "purple" },
  { icon: Users, title: "Multi-User", description: "Manage multiple users with roles", color: "yellow" },
];

const testimonials = [
  { title: "A Complete ERP Solution For Business Growth", name: "Chatore Shyam Limited", text: "We started using Accutech ERP a few months ago and honestly it has made our work much easier. Earlier we were managing accounts and inventory separately, but now everything is in one place.", image: "assets/img/team/member/mbs_formulation.webp", youtubeId: "z5EJRCZluqo", letter: "C" },
  { title: "Powerful Accounting, Inventory And Sales Platform", name: "Mgee Healthcare", text: "I was looking for an ERP that could handle accounting, inventory, and sales together, and Accutech ERP turned out to be the perfect solution.", image: "assets/img/team/member/mbs_pharma.webp", youtubeId: "gF7_drspj3Q", letter: "M" },
  { title: "From Manual Work To Instant Reports", name: "Zopigo", text: "Since implementing Accutech ERP, our daily work has become much more organized. Everything is generated instantly and saves a lot of time.", image: "assets/img/team/member/zopigo.webp", letter: "Z" },
  { title: "Simple Yet Powerful ERP Software", name: "Consumer Mart", text: "Accutech ERP is exactly what we needed to organize our operations. The software is simple yet powerful, and the reporting tools provide clear insights.", image: "assets/img/team/member/consumer_mart.webp", letter: "C" },
  { title: "Positive Experience With Business Management", name: "CA Anshul Garg", text: "Our experience with Accutech ERP has been very positive. The system helps us keep track of every transaction and stock movement accurately.", image: "assets/img/team/member/chartered_acc.webp", letter: "A" },
  { title: "Improved Coordination Across Departments", name: "Ace Cooling", text: "AccutechERP has simplified our operational workflows and improved coordination across departments. The system is user-friendly and highly dependable.", image: "assets/img/team/member/ace_cooling.webp", letter: "A" },
];
const faqs = [
  ["What is Accutech ERP?", "Accutech ERP is a business management platform that unifies GST-ready accounting, billing & invoicing, inventory management, and online banking sync so you can run everything from one place."],
  ["Can I manage multiple businesses/branches?", "Yes—Accutech ERP lets you operate more than one business on a single platform, keeping books, stock and reports separate yet easy to switch between."],
  ["Which core modules are included?", "Key modules include Accounts & Ledger, Billing & Invoicing, Inventory, and Online Banking. It also supports Sale Order Management, Action Permissions, PDC Cheque Management, Target & Incentive Tracking, Order Pendency & Planning, and Security Check Management."],
  ["Is it cloud-based? How is my data kept safe?", "Accutech ERP offers cloud accounting so your data and statements are stored securely and update automatically—no manual balancing or diary entries."],
  ["Does it support GST billing and tax reports?", "Yes—create customised GST invoices, share them easily, and access detailed sales & purchase reports to help with GST and tax filing."],
  ["Do you offer a free trial or demo?", "Yes—free 30-day trial and Request a Demo are available. You can also contact sales@accutechinfo.com or +91-8091696016."],
  ["Can I access Accutech ERP on mobile?", "Yes—Accutech ERP is mobile-friendly and can be accessed through web browsers on smartphones and tablets, giving you real-time control of your business anywhere."],
];
const videos = [
  ["ztKL8Uonctw", "Getting Started"], ["DfBe35hIb8w", "Sync Orders"],
  ["oSD5-dC5Ih4", "Attendance & Visits"], ["gUaG2kIwgMM", "Quick Tip"],
];

function SectionHeading({ badge, children, description }) {
  return <div className="hn-section-head"><span className="hn-badge">{badge}</span><h2>{children}</h2>{description && <p>{description}</p>}</div>;
}
function VideoPopup({ video, onClose }) {
  useEffect(() => {
    if (!video) return;
    const key = e => { if (e.key === "Escape") onClose(); };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", key); };
  }, [video, onClose]);
  if (!video) return null;
  return <div className="hn-video-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}><div className="hn-video-modal" role="dialog" aria-modal="true" aria-label="Video player"><button type="button" onClick={onClose}>Close ×</button><iframe src={`https://www.youtube.com/embed/${video}?autoplay=1&rel=0`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen title="Accutech ERP video" referrerPolicy="strict-origin-when-cross-origin" /></div></div>;
}
function Industries() {
  const [selected, setSelected] = useState("all");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetchIndustryCategories(controller.signal)
      .then(setCategories)
      .catch((err) => {
        if (!controller.signal.aborted) setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const shown = selected === "all"
    ? categories
    : categories.filter(c => String(c.slug) === selected);

  const descriptions = {
    retail: "Retail formats supported by Accutech ERP",
    distribution: "Distribution and wholesale verticals supported by Accutech ERP",
    manufacturing: "Manufacturing industry focus for production and business control",
  };

  return (
    <section className="hn-section hn-industries" id="industries">
      <div className="hn-container">
        <div className="hn-industries-heading">
          <h2>Run more of your <span>business</span> with <strong>Accutech ERP</strong></h2>
          <p>Pick a category to see the industries we power. Click again to show all.</p>
        </div>

        <div className="hn-industries-layout">
          <div className="hn-industry-tabs" role="group" aria-label="Select industry">
            <button
              type="button"
              className={`hn-industry-tile ${selected === "all" ? "active" : ""}`}
              onClick={() => setSelected("all")}
              aria-pressed={selected === "all"}
            >
              <span className="hn-industry-icon"><DbFaIcon iconClass="fa-solid fa-layer-group" /></span>
              <span>All</span>
            </button>
            {categories.map(c => {
              return (
                <button
                  type="button"
                  key={c.id}
                  className={`hn-industry-tile ${selected === String(c.slug) ? "active" : ""}`}
                  onClick={() => setSelected(selected === String(c.slug) ? "all" : String(c.slug))}
                  aria-pressed={selected === String(c.slug)}
                >
                  <span className="hn-industry-icon"><DbFaIcon iconClass={c.icon_class} fallback={categoryDefaults[String(c.slug).toLowerCase()] || "fa-solid fa-layer-group"} /></span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>

          <div className="hn-industry-panel">
            <h3>{selected === "all" ? "All" : (shown[0]?.name || "Industries")}</h3>
            {loading && <p role="status">Loading industries...</p>}
            {error && <p role="alert" className="hn-error">{error}</p>}
            {!loading && !error && !categories.length && <p>No industry categories found.</p>}

            {shown.map(c => {

              const isDms = String(c.slug).toLowerCase() === "dmsxpert";
              return (
                <div className="hn-industry-group" key={c.id}>
                  <h4><DbFaIcon iconClass={c.icon_class} fallback={categoryDefaults[String(c.slug).toLowerCase()] || "fa-solid fa-layer-group"} /> {isDms ? "DMSXpert" : c.name}</h4>
                  {isDms ? (
                    <div className="hn-dmsxpert-intro">
                      <strong>Seamless Control for Multi-Location Businesses</strong>
                      <p>Manage every outlet from a single dashboard. Standardize product masters, push prices and schemes in minutes, track stock and expiries, and view branch-wise performance in real time.</p>
                    </div>
                  ) : (
                    <>
                      {selected !== "all" && <p>{c.description || descriptions[c.slug] || ""}</p>}
                      <div className="hn-industry-items">
                        {c.subcategories.map(sub => (
                          sub.page_slug ? (
                            <Link key={sub.id} className="hn-industry-item" to={publicPagePath(sub.page_slug)}>
                              <DbFaIcon iconClass={sub.icon_class} fallback="fa-solid fa-circle-check" />
                              <span>{sub.name}</span>
                            </Link>
                          ) : (
                            <span key={sub.id} className="hn-industry-item hn-industry-disabled" title="No published page has been linked to this industry">
                              <DbFaIcon iconClass={sub.icon_class} fallback="fa-solid fa-circle-check" />
                              <span>{sub.name}</span>
                            </span>
                          )
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogsPreview() {
  const [posts, setPosts] = useState([]);
  useEffect(() => { const controller = new AbortController(); apiGet(`${API_ENDPOINTS.blogs}?page=1`, controller.signal).then(json => { const entries = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : Array.isArray(json.blogs?.data) ? json.blogs.data : []; setPosts(entries.slice(0, 6)); }).catch(() => {}); return () => controller.abort(); }, []);
  if (!posts.length) return null;
  return <section className="hn-section hn-blogs"><div className="hn-container"><SectionHeading badge="Blogs">Read <strong>Our Latest</strong> News &amp; Blogs</SectionHeading><div className="hn-blog-grid">{posts.map(p => <article className="hn-blog-card" key={p.id || p.slug}><Link to={`/blog/${p.slug}`}><img loading="lazy" src={p.image_url || p.imageUrl || p.image || BLOG_FALLBACK_IMAGE} alt={p.title} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = BLOG_FALLBACK_IMAGE; }}/></Link><div className="hn-blog-body">{p.tags && <span className="hn-blog-tags">{String(p.tags).split(",").slice(0,3).map(t => `#${t.trim()}`).join(" ")}</span>}<small>{p.published_at ? new Date(p.published_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }) : ""}</small><h3><Link to={`/blog/${p.slug}`}>{p.title}</Link></h3><p>{(p.excerpt || "").replace(/<[^>]+>/g, "").slice(0,180)}…</p><Link to={`/blog/${p.slug}`}>Continue reading →</Link></div></article>)}</div><div className="hn-center"><Link className="hn-primary" to="/blogs">See All Blogs <ArrowRight size={17}/></Link></div></div></section>;
}
function VideosPreview({ onPlay }) {
  const videoDetails = [
    {
      id: "ztKL8Uonctw",
      title: "Getting Started with Accutech ERP",
      category: "GETTING STARTED",
      detail: "A quick introduction to navigating Accutech ERP and getting your daily work organised.",
      layout: "featured",
    },
    {
      id: "DfBe35hIb8w",
      title: "Keep Orders in Sync",
      category: "ORDER MANAGEMENT",
      detail: "Learn how to manage orders and keep your sales workflow connected.",
      layout: "wide",
    },
    {
      id: "oSD5-dC5Ih4",
      title: "Attendance & Visits",
      category: "FIELD SALES",
      detail: "Explore how attendance and visit records support your sales team.",
      layout: "standard",
    },
    {
      id: "gUaG2kIwgMM",
      title: "Helpful ERP Quick Tips",
      category: "QUICK GUIDE",
      detail: "Useful shortcuts and simple tips for working more efficiently.",
      layout: "standard",
    },
  ];

  return (
    <div className="hn-video-resources hn-video-gallery">
      <div className="hn-resource-top hn-video-gallery-heading">
        <div>
          <span className="hn-video-eyebrow">WATCH & LEARN</span>
          <h3><strong>Learn Better</strong> With Our Video Guides</h3>
          <p>Explore Accutech ERP through easy, step-by-step video tutorials.</p>
        </div>
        <Link to="/videos" className="hn-primary hn-small">
          Explore All Videos <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <div className="hn-video-layout-grid" aria-label="Accutech ERP video guides">
        {videoDetails.map(({ id, title, category, detail, layout }) => (
          <button
            type="button"
            key={id}
            className={`hn-video-layout-card hn-video-layout-card--${layout}`}
            onClick={() => onPlay(id)}
            aria-label={`Play video: ${title}`}
          >
            <img
              className="hn-video-layout-image"
              src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              onError={(event) => {
                // Keep the card usable even if YouTube blocks a thumbnail.
                event.currentTarget.style.opacity = "0";
              }}
            />
            <span className="hn-video-layout-shade" aria-hidden="true" />
            <span className="hn-video-layout-category">{category}</span>
            <span className="hn-video-layout-play" aria-hidden="true"><Play size={25} fill="currentColor" /></span>
            <span className="hn-video-layout-copy">
              <strong>{title}</strong>
              <span>{detail}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const location = useLocation();

  // React Router does not automatically scroll after mounting a new route.
  // The 3D homepage also initializes GSAP ScrollTrigger, so retry the scroll
  // briefly as the canvas/layout settles. No modification to the 3D rig.
  useEffect(() => {
    if (location.hash !== "#EnquiryForm") return undefined;

    let cancelled = false;
    const timers = [];
    const frames = [];
    let userInterrupted = false;
    const stopAutoScroll = () => { userInterrupted = true; };
    window.addEventListener("wheel", stopAutoScroll, { passive: true });
    window.addEventListener("touchstart", stopAutoScroll, { passive: true });

    const positionDemo = (behavior = "auto") => {
      if (cancelled || userInterrupted) return;
      const target = document.getElementById("demo-info") || document.getElementById("EnquiryForm");
      if (!target) return;
      const nav = document.querySelector(".accu-navbar-container");
      const navBottom = nav?.getBoundingClientRect().bottom ?? 0;
      const clearance = Math.max(84, Math.min(155, navBottom + 16));
      const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - clearance);
      if (Math.abs(window.scrollY - top) > 4) {
        window.scrollTo({ top, behavior });
      }
    };

    // First run after route paint, then correct when async hero layout settles.
    frames.push(requestAnimationFrame(() => {
      frames.push(requestAnimationFrame(() => positionDemo("auto")));
    }));
    [100, 350, 750, 1300].forEach((delay) => {
      timers.push(window.setTimeout(() => positionDemo("auto"), delay));
    });

    return () => {
      cancelled = true;
      frames.forEach(cancelAnimationFrame);
      timers.forEach(clearTimeout);
      window.removeEventListener("wheel", stopAutoScroll);
      window.removeEventListener("touchstart", stopAutoScroll);
    };
  }, [location.pathname, location.hash, location.key]);
  // Reveal only the demo text when it enters the viewport.
  // The 3D hero and form behavior remain untouched.
  useEffect(() => {
    const section = document.getElementById("demo-info");
    if (!section || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add("hn-demo-is-visible");
        observer.disconnect();
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    section.classList.add("hn-demo-motion-ready");
    observer.observe(section);
    return () => {
      observer.disconnect();
      section.classList.remove("hn-demo-motion-ready");
    };
  }, []);

  const [playing, setPlaying] = useState(null);
  return <div className="hn-home">
    <AccutechCharacterHero onWatchVideo={() => setPlaying("ztKL8Uonctw")} />
    <section className="hn-demo-after3d" id="demo-info" aria-labelledby="hn-demo-heading">
      <div className="hn-container hn-demo-after3d-layout">
        <div className="hn-demo-after3d-intro">
          <span className="hn-demo-eyebrow"><span className="hn-demo-eyebrow-dot" /> SEE IT IN ACTION</span>
          <h2 id="hn-demo-heading">Your business runs better with <strong>Accutech ERP.</strong></h2>
          <p>See how one connected platform brings accounting, inventory, GST billing, and daily operations together. Get a personalised walkthrough tailored to your business.</p>
          <div className="hn-demo-benefits">
            <div><CheckCircle2 size={20} /><span>Explore the features that matter to your team</span></div>
            <div><CheckCircle2 size={20} /><span>See a practical demo of your daily workflows</span></div>
            <div><CheckCircle2 size={20} /><span>Ask questions directly to our ERP team</span></div>
          </div>
          <div className="hn-demo-trust">
            <span><ShieldCheck size={17} /> Guided demonstration</span>
            <span><Lock size={17} /> Your details stay private</span>
          </div>
        </div>
        <div className="hn-demo-form-shell">
          <div className="hn-demo-form-topline"><span /> BOOK YOUR DEMO <span /></div>
          <DemoEnquiryForm variant="home" />
        </div>
      </div>
    </section>
    <FeaturesGlowGrid />
    <TestimonialsMarquee testimonials={testimonials} onPlay={setPlaying} />
    <Industries />
    <AccuChatImageSlider
      slides={[
        { src: asset("assets/img/accuchat/AccuChat_bnr.webp"), alt: "AccuChat business communication app banner", href: "https://play.google.com/store/apps/details?id=com.app.accuChat", external: true },
        { src: asset("assets/img/accuchat/AccuChat_bnr2.webp"), alt: "AccuTask business communication app banner", href: "/front/accuchat", external: false }
      ]}
    />
    <BlogsPreview />

    <FaqTwoColumn faqs={faqs} />
    <VortexContactCTA />
    <section className="hn-section hn-faq-videos"><div className="hn-container"><VideosPreview onPlay={setPlaying}/></div></section>
    <section className="hn-section hn-location"><div className="hn-container"><h2>Find Us On <strong>the Map</strong></h2><div className="hn-location-frame"><iframe title="Accutech ERP office location in Panchkula" src="https://www.google.com/maps?q=SCO%2037%20Sector%2012%20Panchkula%20Haryana&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/><div className="hn-location-caption"><MapPin size={19}/><div><strong>MBS Formulation / BDR INGESTA</strong><p>SCO 37, First Floor, Sector 12, Panchkula, Haryana - 134112</p></div></div></div></div></section>
    <section className="hn-final-cta"><div className="hn-container"><a href="#EnquiryForm">Want to See Accutech ERP in Action? <strong>Book a Free Demo <ArrowRight size={19}/></strong></a></div></section>
    <VideoPopup video={playing} onClose={() => setPlaying(null)}/>
  </div>;
}
