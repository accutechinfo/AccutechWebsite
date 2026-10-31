import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DbFaIcon } from "../components/DbFaIcon";
import {
  ArrowRight, ShieldCheck, FileText, Boxes, ChartNoAxesCombined,
  Users, Play, CheckCircle2, Lock, Send, ChevronDown, ChevronLeft,
  ChevronRight, MapPin, MessageCircle, Quote, ExternalLink,
} from "lucide-react";
import "./Home.css";
import DemoEnquiryForm from "../components/DemoEnquiryForm";

import { fetchIndustryCategories, localAsset, publicPagePath } from "../services/publicPagesApi";
import { API_ENDPOINTS, apiGet } from "../services/apiConfig";

const categoryDefaults = {
  retail: "fa-solid fa-store",
  distribution: "fa-solid fa-truck",
  manufacturing: "fa-solid fa-industry",
  dmsxpert: "fa-solid fa-sitemap",
};
const asset = localAsset;
const features = [
  { icon: FileText, title: "GST Billing", description: "Easy invoicing & tax compliance", color: "blue" },
  { icon: Boxes, title: "Inventory", description: "Track stock across locations", color: "green" },
  { icon: ChartNoAxesCombined, title: "Reports", description: "Real-time reports & analytics", color: "purple" },
  { icon: Users, title: "Multi-User", description: "Manage multiple users with roles", color: "yellow" },
];
const dataCards = [
  ["Scope of Application", "AccutechERP Web ERP Platform and SalesApp Mobile Application for admins, accounts, managers and field sales teams."],
  ["User Accounts", "ERP and SalesApp users are created and managed only by the company administrator. No public signup is available."],
  ["Data We Collect", "Depending on platform access, required business data is stored in the respective company database securely."],
  ["Purpose of Data", "Data is used for ERP functionality, mobile sales operations, secure access, cloud syncing and platform performance."],
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
  return <section className="hn-section hn-blogs"><div className="hn-container"><SectionHeading badge="Blogs">Read <strong>Our Latest</strong> News &amp; Blogs</SectionHeading><div className="hn-blog-grid">{posts.map(p => <article className="hn-blog-card" key={p.id || p.slug}><Link to={`/blog/${p.slug}`}><img loading="lazy" src={p.image_url || p.imageUrl || p.image || asset("uploads/blogs/accounts1.webp")} alt={p.title} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = asset("uploads/blogs/accounts1.webp"); }}/></Link><div className="hn-blog-body">{p.tags && <span className="hn-blog-tags">{String(p.tags).split(",").slice(0,3).map(t => `#${t.trim()}`).join(" ")}</span>}<small>{p.published_at ? new Date(p.published_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }) : ""}</small><h3><Link to={`/blog/${p.slug}`}>{p.title}</Link></h3><p>{(p.excerpt || "").replace(/<[^>]+>/g, "").slice(0,180)}…</p><Link to={`/blog/${p.slug}`}>Continue reading →</Link></div></article>)}</div><div className="hn-center"><Link className="hn-primary" to="/blogs">See All Blogs <ArrowRight size={17}/></Link></div></div></section>;
}
function VideosPreview({ onPlay }) {
  return <div className="hn-video-resources"><div className="hn-resource-top"><h3><strong>Learn Better</strong> With Our Video Guides</h3><Link to="/videos" className="hn-primary hn-small">Learn More</Link></div><div className="hn-video-grid">{videos.map(([id, title]) => <button type="button" key={id} onClick={() => onPlay(id)} className="hn-thumb"><img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt={title} loading="lazy"/><span><Play size={20} fill="currentColor"/></span></button>)}</div></div>;
}
export default function Home() {
  const [openedFaq, setOpenedFaq] = useState(0);
  const [slide, setSlide] = useState(0);
  const [playing, setPlaying] = useState(null);
  useEffect(() => { const t = window.setInterval(() => setSlide(s => (s + 1) % 2), 5000); return () => window.clearInterval(t); }, []);
  return <div className="hn-home">
    <section className="hn-hero" id="home"><div className="hn-container hn-hero-grid"><div><span className="hn-badge"><ShieldCheck size={14}/> Cloud Based GST ERP Software</span><h1>Simplify Accounting,<br/>Inventory &amp; GST <span>All in One Place</span></h1><p>Accutech ERP empowers businesses with smart automation, real-time insights and complete control over their operations.</p><div className="hn-hero-features">{features.map(f => { const Icon = f.icon; return <div className="hn-hero-feature" key={f.title}><span className={`hn-feature-icon ${f.color}`}><Icon size={21}/></span><h3>{f.title}</h3><p>{f.description}</p></div>; })}</div><div className="hn-hero-actions"><a href="#EnquiryForm" className="hn-primary">Request Demo <ArrowRight size={18}/></a><button type="button" className="hn-outline" onClick={() => setPlaying("ztKL8Uonctw")}><Play size={18}/> Watch Video</button></div><p className="hn-secure"><ShieldCheck size={17}/> Secure • Reliable • Scalable</p></div><div className="hn-hero-visual"><div className="hn-hero-orb"/><span className="hn-float hn-float-gst">✓ GST Ready</span><img src={asset("assets/images/gif_image.gif")} alt="Accutech ERP Dashboard" className="hn-dashboard"/><span className="hn-float hn-float-report">↗ Live Reports</span></div></div></section>
    <section className="hn-section hn-about" id="about"><div className="hn-container hn-about-grid"><div className="hn-about-copy"><span className="hn-badge">About us</span><h2>Who Are <strong>We</strong></h2><p>Accutech ERP – a powerful, all-in-one ERP solution designed to optimize your business operations seamlessly.</p><p>With features like Sale Order Management, Single Login Access, Action Permissions, Post-Dated Cheque Management, Target Incentive Tracking, Order Pendency &amp; Planning, Security Check Management, and easy User Navigation. Accutech ERP brings everything you need in a single platform.</p><p><strong>Simplify processes, boost productivity, and drive results with a solution built for today’s dynamic business landscape.</strong></p><div className="hn-about-collage"><img src={asset("assets/img/bg-img/acc_about_2.webp")} alt="Accutech ERP"/><img src={asset("assets/img/bg-img/acc_about_1.webp")} alt="Accutech ERP Users"/><img src={asset("assets/img/bg-img/acc_about_3.webp")} alt="Accutech ERP Demo"/></div></div><DemoEnquiryForm variant="home" /></div></section>
    <section className="hn-section hn-data"><div className="hn-container"><SectionHeading badge="Your Data, Your Control" description="AccutechERP and SalesApp are built to protect your business data while helping your team work faster, smarter and more securely.">From Billing To Inventory: <strong>Complete, Cloud-Based ERP</strong> Built For Growing Teams.</SectionHeading><div className="hn-data-grid">{dataCards.map(([title, body],i) => <article key={title} className="hn-data-card"><span>{i+1}</span><h3>{title}</h3><p>{body}</p></article>)}</div><div className="hn-center"><Link to="/front/privacy_policy" className="hn-outline hn-outline-light">Learn More <ArrowRight size={17}/></Link></div></div></section>
    <section className="hn-section hn-testimonials" id="testimonial"><div className="hn-container"><SectionHeading badge="Testimonials" description="See what our customers have to say about us">Testimonials</SectionHeading><div className="hn-testimonial-grid">{testimonials.map(t => <article className="hn-test-card" key={t.name}><Quote size={23} className="hn-quote"/><h3>{t.title}</h3>{t.youtubeId ? <button type="button" onClick={() => setPlaying(t.youtubeId)} className="hn-test-picture"><img src={`https://img.youtube.com/vi/${t.youtubeId}/hqdefault.jpg`} alt={t.name} loading="lazy"/><span><Play fill="currentColor"/></span></button> : <img className="hn-test-picture-static" src={asset(t.image)} loading="lazy" alt={t.name} />}<p>“{t.text.length > 165 ? t.text.slice(0,165) + "…" : t.text}”</p><div className="hn-test-person"><span>{t.letter}</span><div><h4>{t.name}</h4><small>✓ Verified Client</small></div></div><div className="hn-stars">★★★★★</div></article>)}</div><div className="hn-center"><Link to="/front/testimonials" className="hn-outline">View More Testimonials <ArrowRight size={16}/></Link></div></div></section>
    <Industries />
    <section className="hn-section hn-app-banner"><div className="hn-container"><div className="hn-banner-slide"><button type="button" aria-label="Previous banner" onClick={() => setSlide(s => (s+1)%2)}><ChevronLeft/></button>{slide === 0 ? <a href="https://play.google.com/store/apps/details?id=com.app.accuChat" target="_blank" rel="noopener noreferrer"><img src={asset("assets/img/accuchat/AccuChat_bnr.webp")} alt="AccuChat Business Communication App Banner"/></a> : <Link to="/front/accuchat"><img src={asset("assets/img/accuchat/AccuChat_bnr2.webp")} alt="AccuTask Business Communication App Banner"/></Link>}<button type="button" aria-label="Next banner" onClick={() => setSlide(s => (s+1)%2)}><ChevronRight/></button></div><div className="hn-banner-dots"><button type="button" className={slide === 0 ? "active" : ""} onClick={() => setSlide(0)} aria-label="Show banner 1"/><button type="button" className={slide === 1 ? "active" : ""} onClick={() => setSlide(1)} aria-label="Show banner 2"/></div></div></section>
    <BlogsPreview />
    <section className="hn-ask"><div className="hn-container"><h2>Have a question? <strong>Ask us</strong> anything!</h2><p>Contact us and we'll get back to you as soon as possible.</p><Link className="hn-primary hn-primary-light" to="/contactus">Submit A Request</Link></div></section>
    <section className="hn-section hn-faq" id="faqs"><div className="hn-container"><SectionHeading badge="FAQ">How can we <strong>help you?</strong></SectionHeading><div className="hn-faq-list">{faqs.map(([q,a],i) => <div className="hn-faq-item" key={q}><button type="button" aria-expanded={openedFaq === i} onClick={() => setOpenedFaq(openedFaq === i ? -1 : i)}>{q}<ChevronDown size={18} className={openedFaq === i ? "rotate" : ""}/></button>{openedFaq === i && <p>{a}</p>}</div>)}</div><VideosPreview onPlay={setPlaying}/></div></section>
    <section className="hn-section hn-location"><div className="hn-container"><h2>Find Us On <strong>the Map</strong></h2><div className="hn-location-frame"><iframe title="Accutech ERP office location in Panchkula" src="https://www.google.com/maps?q=SCO%2037%20Sector%2012%20Panchkula%20Haryana&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/><div className="hn-location-caption"><MapPin size={19}/><div><strong>MBS Formulation / BDR INGESTA</strong><p>SCO 37, First Floor, Sector 12, Panchkula, Haryana - 134112</p></div></div></div></div></section>
    <section className="hn-final-cta"><div className="hn-container"><a href="#EnquiryForm">Want to See Accutech ERP in Action? <strong>Book a Free Demo <ArrowRight size={19}/></strong></a></div></section>
    <VideoPopup video={playing} onClose={() => setPlaying(null)}/>
  </div>;
}
