import { ArrowRight, Mail, Phone, MapPin, MessageCircle, ExternalLink, ShieldCheck } from "lucide-react";
import DemoEnquiryForm from "../components/DemoEnquiryForm";
import "./ContactUs.css";

const socialLinks = [
  { label: "Facebook", url: "https://www.facebook.com/accutecherp/" },
  { label: "X", url: "https://x.com/accutech_erp" },
  { label: "Pinterest", url: "https://in.pinterest.com/accutech_erp/" },
  { label: "LinkedIn", url: "https://www.linkedin.com/company/accutecherp/" },
  { label: "Instagram", url: "https://www.instagram.com/accutech_erp/" },
  { label: "YouTube", url: "https://www.youtube.com/@AccutechERP" },
];

export default function ContactUs() {
  function goToForm() {
    document.getElementById("EnquiryForm")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className="ct-page">
      <section className="ct-hero" aria-labelledby="ct-main-heading">
        <div className="ct-container ct-hero-inner">
          <div className="ct-hero-copy">
            <span className="ct-pill"><span className="ct-dot" /> GET IN TOUCH</span>
            <h1 id="ct-main-heading">Contact <span>Us</span></h1>
            <p>Have a question about Accutech ERP? We're here to help with accounting, inventory, GST, demos and onboarding.</p>
            <div className="ct-actions">
              <button type="button" className="ct-btn-primary" onClick={goToForm}>
                Send an Enquiry <ArrowRight size={17} />
              </button>
              <a className="ct-btn-outline" href="tel:+918091696016"><Phone size={17} /> Call Our Team</a>
            </div>
          </div>
          <div className="ct-hero-aside">
            <span className="ct-aside-icon"><MessageCircle size={26} strokeWidth={1.7} /></span>
            <div>
              <strong>We're here to help</strong>
              <p>Talk to our team about the right ERP solution for your business.</p>
              <a href="mailto:sales@accutechinfo.com">sales@accutechinfo.com <ArrowRight size={15} /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="ct-contact-section" id="demo-section">
        <div className="ct-container ct-contact-grid">
          <div className="ct-details">
            <span className="ct-kicker">CONTACT ACCUTECH ERP</span>
            <h2>We’re just a <span>message away.</span></h2>
            <p className="ct-lead">Whether you want to book a demo or have a question about your business operations, choose the easiest way to reach us.</p>
            <div className="ct-contact-cards">
              <a className="ct-contact-card" href="mailto:sales@accutechinfo.com">
                <span className="ct-card-icon"><Mail size={21}/></span>
                <span><small>EMAIL US</small><strong>sales@accutechinfo.com</strong><em>Send your questions to our team</em></span>
                <ExternalLink size={16} className="ct-external" />
              </a>
              <a className="ct-contact-card" href="tel:+918091696016">
                <span className="ct-card-icon"><Phone size={21}/></span>
                <span><small>CALL OUR TEAM</small><strong>+91-8091696016</strong><em>Also available: +91-8091696017</em></span>
                <ExternalLink size={16} className="ct-external" />
              </a>
              <a className="ct-contact-card" href="https://wa.me/918091696016" target="_blank" rel="noopener noreferrer">
                <span className="ct-card-icon"><MessageCircle size={21}/></span>
                <span><small>WHATSAPP</small><strong>Chat with Accutech ERP</strong><em>Start a conversation</em></span>
                <ExternalLink size={16} className="ct-external" />
              </a>
            </div>
            <div className="ct-office">
              <MapPin size={21}/>
              <div><strong>Visit our office</strong><p>SCO 37, First Floor, Sector 12, Panchkula, Haryana – 134112</p></div>
            </div>
            <div className="ct-social">
              <h3>Follow us</h3>
              <div className="ct-social-links">
                {socialLinks.map(({ label, url }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>{label}</a>
                ))}
              </div>
            </div>
          </div>

          <div className="ct-form-wrap">
            <div className="ct-form-note">BOOK A CONSULTATION</div>
            <div className="ct-form-panel">
              <DemoEnquiryForm variant="contact" source="Contact Us" />
            </div>
            <p className="ct-privacy"><ShieldCheck size={14}/> Your enquiry goes directly to our team.</p>
          </div>
        </div>
      </section>

      <section className="ct-map-section">
        <div className="ct-container">
          <div className="ct-map-head">
            <div><span className="ct-kicker">OUR OFFICE</span><h2>Find us <span>on the map.</span></h2></div>
            <a href="https://www.google.com/maps/search/?api=1&query=SCO+37+Sector+12+Panchkula+Haryana" target="_blank" rel="noopener noreferrer">Get directions <ExternalLink size={16}/></a>
          </div>
          <div className="ct-map-frame">
            <iframe title="Accutech ERP office in Panchkula" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=SCO%2037%20Sector%2012%20Panchkula%20Haryana&output=embed" allowFullScreen />
          </div>
        </div>
      </section>
    </main>
  );
}
