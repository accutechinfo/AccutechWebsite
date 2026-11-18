import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import './VortexContactCTA.css';

/**
 * Lightweight canvas recreation of the blue elliptical particle vortex.
 * No Tailwind, shadcn or Velora installation required.
 * The animation is decorative; the heading and CTA remain normal accessible HTML.
 */
function VortexCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionAllowed = !media.matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let rafId = 0;
    let visible = true;
    const total = 920;

    // Deterministic PRNG: no particle reshuffling on redraw.
    let seed = 73591;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const particles = Array.from({ length: total }, () => ({
      angle: rand() * Math.PI * 2,
      radius: Math.sqrt(rand()),
      length: 0.9 + rand() * 2.7,
      width: 0.75 + rand() * 0.95,
      speed: 0.18 + rand() * 0.56,
      opacity: 0.40 + rand() * 0.60,
      tint: rand(),
      offset: (rand() - 0.5) * 0.11,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);
      const cx = width * 0.5;
      const cy = height * 0.50;
      const rx = Math.min(width * 0.46, 620);
      const ry = Math.min(height * 0.38, 190);
      const t = frame * 0.002;

      for (const p of particles) {
        // Radial bands and gaps create the streaked vortex appearance.
        const ring = 0.19 + p.radius * 0.82;
        const wobble = Math.sin(p.angle * 4 + t * 0.5) * 0.012;
        const r = ring + p.offset + wobble;
        const a = p.angle + t * p.speed * (1.3 - p.radius * 0.2);
        const x = cx + Math.cos(a) * rx * r;
        const y = cy + Math.sin(a) * ry * r;
        const outerFade = Math.min(1, (1.04 - r) * 7);
        const centerFade = Math.min(1, Math.max(0, (r - 0.19) * 5));
        const alpha = Math.max(0, p.opacity * outerFade * centerFade * 0.91);
        if (alpha < 0.02) continue;

        // Short tangent-aligned strokes like the supplied reference.
        const dx = -Math.sin(a) * (p.length * (2.0 + r * 2.1));
        const dy = Math.cos(a) * (p.length * (0.7 + r * 0.9));
        ctx.strokeStyle = p.tint > 0.72
          ? `rgba(0, 119, 230, ${alpha})`
          : p.tint > 0.23
            ? `rgba(20, 63, 177, ${alpha})`
            : `rgba(49, 95, 207, ${alpha * 0.85})`;
        ctx.lineWidth = p.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x - dx, y - dy);
        ctx.lineTo(x + dx, y + dy);
        ctx.stroke();
      }
    };

    const tick = () => {
      frame += 1;
      draw();
      if (motionAllowed && visible) rafId = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(() => { resize(); draw(); });
    observer.observe(canvas);
    const visibilityObserver = new IntersectionObserver(entries => {
      const next = entries[0]?.isIntersecting ?? false;
      if (next === visible) return;
      visible = next;
      cancelAnimationFrame(rafId);
      if (visible && motionAllowed) rafId = requestAnimationFrame(tick);
    }, { threshold: 0.01 });
    visibilityObserver.observe(canvas);
    resize();
    if (motionAllowed) rafId = requestAnimationFrame(tick);
    else draw();

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  return <canvas className="avcta-vortex-canvas" ref={canvasRef} aria-hidden="true" />;
}

export default function VortexContactCTA() {
  return (
    <section className="avcta-section" aria-labelledby="avcta-heading">
      <VortexCanvas />
      <div className="avcta-content">
        <span className="avcta-eyebrow">WE'RE HERE TO HELP</span>
        <h2 id="avcta-heading">Have a question? <strong>Ask us anything!</strong></h2>
        <p>Contact us and we'll get back to you as soon as possible.</p>
        <Link className="avcta-shimmer-button" to="/contactus">
          <span className="avcta-shimmer-inner">
            <Rocket size={18} aria-hidden="true" />
            Submit A Request
          </span>
        </Link>
      </div>
    </section>
  );
}
