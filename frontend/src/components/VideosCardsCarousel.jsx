import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, ArrowUpRight } from "lucide-react";
import "./VideosCardsCarousel.css";

// Use the same video IDs and YouTube featured images already used on Home.jsx.
// If the video list is updated in Home.jsx, pass it with the `videos` prop.
const DEFAULT_VIDEOS = [
  ["ztKL8Uonctw", "Getting Started"],
  ["DfBe35hIb8w", "Sync Orders"],
  ["oSD5-dC5Ih4", "Attendance & Visits"],
  ["gUaG2kIwgMM", "Quick Tip"],
];

function normalizeVideo(entry, index) {
  if (Array.isArray(entry)) return { id: entry[0], title: entry[1] || `Video Guide ${index + 1}` };
  return { id: entry.id || entry.youtubeId, title: entry.title || `Video Guide ${index + 1}`, thumbnail: entry.thumbnail };
}

export default function VideosCardsCarousel({ onPlay, videos = DEFAULT_VIDEOS }) {
  const trackRef = useRef(null);
  const items = videos.map(normalizeVideo).filter((item) => item.id);

  function move(direction) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".avideo-card");
    const distance = card ? card.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  }

  return (
    <section className="avideo-section" aria-labelledby="avideo-title">
      <div className="avideo-shell">
        <header className="avideo-heading">
          <div>
            <span className="avideo-eyebrow">VIDEO GUIDES</span>
            <h2 id="avideo-title"><strong>Learn Better</strong> With Our Video Guides</h2>
            <p>Explore Accutech ERP through practical, step-by-step video tutorials.</p>
          </div>
          <div className="avideo-actions">
            <Link to="/videos" className="avideo-more">Learn More <ArrowUpRight size={17} /></Link>
            <div className="avideo-arrows" aria-label="Carousel navigation">
              <button type="button" aria-label="Previous videos" onClick={() => move(-1)}><ChevronLeft size={20} /></button>
              <button type="button" aria-label="Next videos" onClick={() => move(1)}><ChevronRight size={20} /></button>
            </div>
          </div>
        </header>

        <div className="avideo-track" ref={trackRef} aria-label="Accutech ERP video tutorials">
          {items.map((video, index) => (
            <article className="avideo-card" key={video.id}>
              <button type="button" className="avideo-video-button" onClick={() => onPlay?.(video.id)} aria-label={`Play ${video.title}`}>
                <img
                  src={video.thumbnail || `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                  alt={`${video.title} video thumbnail`}
                  loading="lazy"
                  onError={(event) => {
                    const img = event.currentTarget;
                    if (img.dataset.fallback) return;
                    img.dataset.fallback = "true";
                    img.src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
                  }}
                />
                <span className="avideo-thumbnail-shade" />
                <span className="avideo-play"><Play size={22} fill="currentColor" /></span>
                <span className="avideo-video-label">VIDEO GUIDE</span>
              </button>
              <div className="avideo-card-footer">
                <span className="avideo-card-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{video.title}</h3>
                <button type="button" onClick={() => onPlay?.(video.id)} aria-label={`Watch ${video.title}`}><ArrowUpRight size={20} /></button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
