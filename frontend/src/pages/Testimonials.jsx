import { useEffect, useState } from "react";
import testimonials from "../data/testimonials.json";
import "./Testimonials.css";

export default function Testimonials() {
  const [video, setVideo] = useState(null);
  useEffect(() => {
    if (!video) return;
    const onKey = (e) => e.key === "Escape" && setVideo(null);
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = previous; };
  }, [video]);
  return <section className="acc-test-page" id="testimonial"><div className="container">
    <header className="acc-test-heading"><span>Testimonials</span><h1>Testimonials</h1><p>See what our customers have to say about us</p></header>
    <div className="acc-test-grid">{testimonials.map((t, i) => <article className="acc-test-card" key={`${t.name}-${i}`}>
      <div className="acc-test-quote">“</div><h2>{t.title}</h2>
      {t.youtubeId ? <button className="acc-test-media acc-test-play" onClick={() => setVideo(t)} type="button" aria-label={`Watch testimonial from ${t.name}`}>
         <img src={`https://img.youtube.com/vi/${t.youtubeId}/hqdefault.jpg`} alt={t.name} onError={(e) => { e.currentTarget.onerror=null;e.currentTarget.src=`/${t.image}`; }} /><span>▶</span>
      </button> : <div className="acc-test-media"><img src={`/${t.image}`} alt={t.name} loading="lazy" /></div>}
      <p className="acc-test-text">“{t.text.length > 165 ? t.text.slice(0, 165).trimEnd() + "…" : t.text}”</p>
      <div className="acc-test-user"><span className="acc-test-avatar">{t.letter}</span><div><strong>{t.name}</strong><small>✓ Verified Client</small></div></div>
      <div className="acc-test-stars" aria-label="Five stars">★★★★★</div>
    </article>)}</div>
  </div>
  {video && <div className="acc-test-overlay" onMouseDown={e => { if(e.target===e.currentTarget)setVideo(null); }}><div className="acc-test-modal" role="dialog" aria-modal="true" aria-label={video.title}>
    <button type="button" onClick={() => setVideo(null)} aria-label="Close video">Close ×</button>
    <iframe title={video.title} src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
  </div></div>}
  </section>;
}
