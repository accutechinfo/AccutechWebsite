import { Play, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./TestimonialsMarquee.css";

// Receives your existing testimonials (no invented names, roles or reviews).
const initials = (name = "") => name.trim().split(/\s+/).slice(0, 2).map(s => s[0] || "").join("").toUpperCase();
const getImage = (path) => !path ? "" : /^(https?:)?\/\//.test(path) ? path : `/${path.replace(/^\//, "")}`;

function ReviewCard({ review, onPlay }) {
  const avatar = getImage(review.image);
  return (
    <figure className="atm-card">
      <div className="atm-rating" aria-label="5 stars" role="img">
        {Array.from({ length: 5 }, (_, index) => <Star key={index} size={17} fill="currentColor" strokeWidth={1.5} />)}
      </div>
      <h3>{review.title}</h3>
      <blockquote>“{review.text}”</blockquote>
      <figcaption className="atm-person">
        <span className="atm-avatar" aria-hidden="true">
          {avatar ? <img src={avatar} loading="lazy" alt="" onError={(e) => {e.currentTarget.style.display="none";}} /> : null}
          <span>{initials(review.name)}</span>
        </span>
        <span className="atm-person-copy"><strong>{review.name}</strong><small>Accutech ERP Customer</small></span>
        {review.youtubeId && (
          <button className="atm-play" type="button" onClick={() => onPlay?.(review.youtubeId)} aria-label={`Watch video testimonial from ${review.name}`} title="Watch video testimonial">
            <Play size={16} fill="currentColor" />
          </button>
        )}
      </figcaption>
    </figure>
  );
}

function ReviewRow({ reviews, reverse = false, onPlay }) {
  if (!reviews.length) return null;
  // Two identical groups create a seamless continuous loop; the second is hidden from screen readers.
  return (
    <div className={`atm-viewport ${reverse ? "atm-reverse" : ""}`}>
      <div className="atm-track">
        {[0, 1].map(copy => (
          <div key={copy} className="atm-group" aria-hidden={copy === 1 ? "true" : undefined}>
            {reviews.map((review, index) => <ReviewCard key={`${copy}-${review.name}-${index}`} review={review} onPlay={onPlay} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsMarquee({ testimonials = [], onPlay }) {
  const top = testimonials.filter((_, i) => i % 2 === 0);
  const bottom = testimonials.filter((_, i) => i % 2 === 1);
  return (
    <section className="atm-section" id="testimonial" aria-labelledby="atm-heading">
      <div className="atm-glow" aria-hidden="true" />
      <div className="atm-heading">
        <span className="atm-eyebrow">Testimonials</span>
        <h2 id="atm-heading">Trusted by businesses <span>growing with Accutech ERP</span></h2>
        <p>See how our customers use Accutech ERP to simplify accounting, inventory, reporting and business operations.</p>
      </div>
      <div className="atm-rows">
        <ReviewRow reviews={top} onPlay={onPlay} />
        <ReviewRow reviews={bottom} reverse onPlay={onPlay} />
      </div>
      <div className="atm-footer">
        <Link to="/front/testimonials" className="atm-more">View More Testimonials <ArrowRight size={17} /></Link>
      </div>
    </section>
  );
}
