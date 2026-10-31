import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./SiteTracking.css";

const KEY = "accutech_tracking_consent_v1";
const GA_ID = "G-HR86L3R1VW";
const PIXEL_IDS = ["1401547758404169", "1393627371828678"];
const LINKEDIN_ID = "6877116";
const AHREFS_KEY = "ln4jOrr9I2S0R5sJwTnEoA";
let initialized = false;

function addScript(src, attrs = {}) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value));
  document.head.appendChild(script);
}
function startTrackers() {
  if (initialized) return;
  initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });
  addScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);

  if (!window.fbq) {
    const fbq = function () { if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments); else fbq.queue.push(arguments); };
    fbq.queue = []; fbq.loaded = true; fbq.version = "2.0";
    window.fbq = fbq; window._fbq = fbq;
  }
  PIXEL_IDS.forEach(id => window.fbq("init", id));
  addScript("https://connect.facebook.net/en_US/fbevents.js");

  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  if (!window._linkedin_data_partner_ids.includes(LINKEDIN_ID)) window._linkedin_data_partner_ids.push(LINKEDIN_ID);
  if (!window.lintrk) { window.lintrk = function () { window.lintrk.q.push(arguments); }; window.lintrk.q = []; }
  addScript("https://snap.licdn.com/li.lms-analytics/insight.min.js");
  addScript("https://analytics.ahrefs.com/analytics.js", { "data-key": AHREFS_KEY });
}
function trackRoute() {
  const path = window.location.pathname + window.location.search;
  window.gtag?.("event", "page_view", { page_path: path, page_location: window.location.href, page_title: document.title, send_to: GA_ID });
  window.fbq?.("track", "PageView");
}

export function trackContactConversion(name = "conversion_event_contact") {
  // Call ONLY after the real form/API confirms success. Not on each page load.
  if (localStorage.getItem(KEY) === "accepted") window.gtag?.("event", name);
}

export default function SiteTracking() {
  const location = useLocation();
  const [consent, setConsent] = useState(() => {
    try { return localStorage.getItem(KEY); } catch { return null; }
  });
  useEffect(() => { if (consent === "accepted") startTrackers(); }, [consent]);
  useEffect(() => {
    if (consent !== "accepted") return;
    // SEO metadata has already been updated by SiteSEO in normal render order.
    trackRoute();
  }, [consent, location.pathname, location.search]);
  const choose = (value) => {
    try { localStorage.setItem(KEY, value); } catch { /* storage unavailable */ }
    setConsent(value);
  };
  if (consent) return null;
  return <div className="accu-consent" role="dialog" aria-label="Cookie consent" aria-modal="false">
    <p>We use cookies to measure site traffic and improve your experience. You can accept or reject optional analytics and advertising cookies.</p>
    <div className="accu-consent-actions">
      <button type="button" onClick={() => choose("accepted")}>Accept All</button>
      <button type="button" className="secondary" onClick={() => choose("rejected")}>Reject Optional</button>
    </div>
  </div>;
}
