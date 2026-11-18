import { useState } from "react";
import { ArrowUpRight, BookOpen, ChevronDown, Mail, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";
import "./FaqTwoColumn.css";

const CONTACTS = [
  {
    icon: MessageSquareText,
    label: "Chat with the team",
    detail: "Ask about ERP or book a demo",
    href: "https://wa.me/918091696017?text=Hello%2C%20I%20have%20a%20question%20about%20Accutech%20ERP",
    external: true,
  },
  {
    icon: Mail,
    label: "sales@accutechinfo.com",
    detail: "Product and sales enquiries",
    href: "mailto:sales@accutechinfo.com",
  },
  {
    icon: BookOpen,
    label: "Explore video guides",
    detail: "Learn how Accutech ERP works",
    href: "/videos",
    route: true,
  },
];

function SupportLink({ item }) {
  const Icon = item.icon;
  const content = <>
    <span className="afaq-contact-icon"><Icon size={19} strokeWidth={1.8} aria-hidden="true" /></span>
    <span className="afaq-contact-info"><strong>{item.label}</strong><small>{item.detail}</small></span>
    <ArrowUpRight className="afaq-contact-arrow" size={15} aria-hidden="true" />
  </>;
  return item.route
    ? <Link className="afaq-contact-link" to={item.href}>{content}</Link>
    : <a className="afaq-contact-link" href={item.href} {...(item.external ? {target:"_blank",rel:"noopener noreferrer"} : {})}>{content}</a>;
}

/** Matches the supplied two-column design, without Tailwind/shadcn/Velora dependencies. */
export default function FaqTwoColumn({ faqs = [] }) {
  // The reference image shows multiple FAQ answers expanded at once.
  const [open, setOpen] = useState(() => new Set([0]));
  const toggle = (index) => {
    setOpen(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
  };
  const trackGlow = e => {
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--afaq-mouse-x", `${e.clientX - box.left}px`);
    e.currentTarget.style.setProperty("--afaq-mouse-y", `${e.clientY - box.top}px`);
  };

  return <section id="faqs" className="afaq-section" aria-labelledby="afaq-title">
    <div className="afaq-layout">
      <div className="afaq-left">
        <div className="afaq-sticky">
          <span className="afaq-eyebrow">Support</span>
          <h2 id="afaq-title">Frequently<br />asked questions</h2>
          <p className="afaq-lead">Quick answers to common questions about Accutech ERP. Need more help? Our team is here for you.</p>
          <div className="afaq-contacts" onPointerMove={trackGlow} aria-label="Get support">
            {CONTACTS.map(item => <SupportLink item={item} key={item.label} />)}
          </div>
        </div>
      </div>
      <div className="afaq-right" aria-label="Frequently asked questions">
        {faqs.map(([question, answer], index) => {
          const expanded = open.has(index);
          const answerId = `afaq-answer-${index}`;
          return <div className={`afaq-item ${expanded ? "afaq-open" : ""}`} key={question}>
            <h3 className="afaq-question">
              <button type="button" onClick={() => toggle(index)} aria-expanded={expanded} aria-controls={answerId}>
                <span className="afaq-number">{String(index + 1).padStart(2,"0")}</span>
                <span className="afaq-question-text">{question}</span>
                <ChevronDown className="afaq-chevron" size={17} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </h3>
            <div id={answerId} className="afaq-answer-outer" inert={!expanded}>
              <div className="afaq-answer-inner"><p>{answer}</p></div>
            </div>
          </div>;
        })}
      </div>
    </div>
  </section>;
}
