import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Boxes, FileText, ChartNoAxesCombined, Users, ShieldCheck,
  Workflow, ShoppingCart, Building2, ClipboardList,
} from "lucide-react";
import "./FeaturesGlowGrid.css";

// Accutech ERP features. Edit the copy here without touching the animation.
const FEATURES = [
  { icon: FileText, title: "GST Billing & Accounting", description: "Manage invoices, ledgers, financial statements and GST-related billing workflows in one place." },
  { icon: Boxes, title: "Inventory Management", description: "Keep track of stock movements, products and available quantities across your business." },
  { icon: Workflow, title: "Sales & Purchase Operations", description: "Connect daily sales, purchases and orders with your accounting operations." },
  { icon: ChartNoAxesCombined, title: "Business Reports", description: "Review useful sales, purchase and financial reports to support better decisions." },
  { icon: Users, title: "Multi-User Access", description: "Assign access permissions for your accounts, sales and operational teams." },
  { icon: ShieldCheck, title: "Cloud Business Access", description: "Access your ERP through a connected cloud-based platform with controlled user access." },
  { icon: ShoppingCart, title: "Sale Order Management", description: "Manage customer orders and follow their progress through your sales workflow." },
  { icon: Building2, title: "Multiple Business Locations", description: "Work with multiple companies or business locations from a connected ERP environment." },
  { icon: ClipboardList, title: "Order Tracking & Planning", description: "Keep visibility into pending orders and day-to-day business planning." },
];

function FeatureCard({ feature, index }) {
  const cardRef = useRef(null);
  const Icon = feature.icon;
  function onPointerMove(event) {
    if (event.pointerType === "touch" || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--afg-x", `${event.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--afg-y", `${event.clientY - rect.top}px`);
  }
  return (
    <li className="afg-item" style={{ "--afg-order": index }}>
      <article ref={cardRef} className="afg-card" onPointerMove={onPointerMove}>
        <div className="afg-inner">
          <div className="afg-icon" aria-hidden="true"><Icon size={24} strokeWidth={1.9} /></div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      </article>
    </li>
  );
}

export default function FeaturesGlowGrid() {
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.09 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`afg-section ${visible ? "afg-visible" : ""}`} id="erp-features" ref={sectionRef} aria-labelledby="afg-heading">
      <div className="afg-container">
        <header className="afg-heading">
          <span className="afg-eyebrow">Features</span>
          <h2 id="afg-heading">Built for businesses that <span>move smarter</span></h2>
          <p>Everything your team needs to manage accounting, inventory and daily operations in one connected ERP.</p>
        </header>

        <ul className="afg-grid">
          {FEATURES.slice(0, expanded ? FEATURES.length : 6).map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </ul>

        <div className="afg-bottom">
          <p>Need something specific for your business? <a href="#EnquiryForm">Talk to our team <ArrowRight size={15} aria-hidden="true" /></a></p>
          <button type="button" className="afg-more" aria-expanded={expanded} onClick={() => setExpanded(v => !v)}>
            {expanded ? "View Less" : "View More Features"}
            <ArrowRight size={18} aria-hidden="true" className={expanded ? "afg-arrow-up" : ""} />
          </button>
        </div>
      </div>
    </section>
  );
}
