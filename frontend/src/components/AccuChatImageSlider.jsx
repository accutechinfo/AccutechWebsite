import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import "./AccuChatImageSlider.css";

/** Images and URLs are supplied by Home.jsx, retaining the site's existing assets. */
export default function AccuChatImageSlider({ slides = [], interval = 5500 }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef(null);
  const count = slides.length;
  const move = (delta) => setActive((current) => (current + delta + count) % count);

  useEffect(() => {
    if (active >= count && count) setActive(0);
  }, [count, active]);

  useEffect(() => {
    if (paused || count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => move(1), interval);
    return () => window.clearInterval(timer);
  }, [paused, count, interval]);

  if (!count) return null;

  const renderSlideLink = (slide, content) => slide.external ? (
    <a href={slide.href} target="_blank" rel="noopener noreferrer" className="acslide-link" aria-label={slide.alt}>{content}</a>
  ) : (
    <Link to={slide.href} className="acslide-link" aria-label={slide.alt}>{content}</Link>
  );

  return (
    <section className="acslide-section" aria-label="Accutech apps and product banners">
      <div
        className="acslide-frame"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}
        onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStart.current === null || count < 2) return;
          const change = e.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(change) > 45) move(change < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        <div className="acslide-track" style={{ transform: `translateX(-${active * 100}%)` }}>
          {slides.map((slide, i) => (
            <div className="acslide-item" key={slide.src} aria-hidden={i !== active}>
              {renderSlideLink(slide, <img src={slide.src} alt={slide.alt} loading={i === 0 ? "eager" : "lazy"} draggable="false" />)}
            </div>
          ))}
        </div>
        {count > 1 && (
          <>
            <button type="button" className="acslide-arrow acslide-prev" onClick={() => move(-1)} aria-label="Previous banner"><ChevronLeft size={23}/></button>
            <button type="button" className="acslide-arrow acslide-next" onClick={() => move(1)} aria-label="Next banner"><ChevronRight size={23}/></button>
          </>
        )}
      </div>
      {count > 1 && <div className="acslide-dots" role="group" aria-label="Choose banner">
        {slides.map((s, i) => <button key={s.src} type="button" className={i === active ? "is-active" : ""} aria-current={i === active ? "true" : undefined} aria-label={`Show banner ${i + 1}`} onClick={() => setActive(i)} />)}
      </div>}
    </section>
  );
}
