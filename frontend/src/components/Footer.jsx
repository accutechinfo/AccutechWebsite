
import { Link } from "react-router-dom";
import "./Footer.css";

const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const guides = [
  {
    title: "Why Every Serious Investor Should Understand NFO",
    path: "/guide/why-every-serious-investor-should-understand-new-fund-offers-nfo",
  },
  {
    title: "File GSTR-1 Returns in Minutes, Not Hours",
    path: "/guide/gstr-1-return-filing-software",
  },
  {
    title: "GSTR2A: Complete Guide to Reconciliation, ITC, and Download Process",
    path: "/guide/gstr2a-complete-guide-reconciliation-itc",
  },
];

const socialLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/accutecherp/",
    icon: "fa-brands fa-facebook-f",
  },
  {
    name: "X",
    url: "https://x.com/accutech_erp",
    icon: "fa-brands fa-x-twitter",
  },
  {
    name: "Pinterest",
    url: "https://in.pinterest.com/accutech_erp/",
    icon: "fa-brands fa-pinterest-p",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/accutecherp/",
    icon: "fa-brands fa-linkedin-in",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/accutech_erp/",
    icon: "fa-brands fa-instagram",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@AccutechERP",
    icon: "fa-brands fa-youtube",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="accu-site-footer">
      <div className="accu-footer-container">
        <div className="accu-footer-grid">

          {/* COLUMN 1: ABOUT + GUIDES */}
          <div className="accu-footer-column">
            <h3>About</h3>

            <nav className="accu-footer-links" aria-label="About links">
              <Link to="/#about">About</Link>
              <Link to="/front/testimonials">Testimonials</Link>
            </nav>

            <div className="accu-footer-guides">
              <div className="accu-footer-guides-title">
                <span />
                <h4>Guides</h4>
                <span />
              </div>

              <nav aria-label="Guides">
                {guides.map((guide) => (
                  <Link
                    to={guide.path}
                    key={guide.path}
                    className="accu-footer-guide-link"
                  >
                    <i
                      className="fa-solid fa-arrow-right"
                      aria-hidden="true"
                    />
                    <span>{guide.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div className="accu-footer-column">
            <h3>Quick Links</h3>

            <nav
              className="accu-footer-links"
              aria-label="Quick links"
            >
              <Link to="/contactus">Contact Us</Link>
              <Link to="/#faqs">FAQs</Link>
              <Link to="/front/privacy_policy">
                Privacy Policy
              </Link>
              <Link to="/policies/terms">
                Terms & Conditions
              </Link>
            </nav>
          </div>

          {/* COLUMN 3: EXPLORE */}
          <div className="accu-footer-column">
            <h3>Explore Accutech ERP</h3>

            <nav
              className="accu-footer-links"
              aria-label="Explore Accutech ERP"
            >
              <Link to="/videos">Videos</Link>
              <Link to="/#EnquiryForm">Request Demo</Link>
              <Link to="/blogs">Blogs</Link>
              <Link to="/pages">Pages</Link>
            </nav>
          </div>

          <div className="accu-footer-column accu-footer-contact">
            <h3>Get In Touch</h3>

            <div className="accu-footer-contact-list">

              <div className="accu-footer-contact-item">
                <i
                  className="fa-solid fa-house"
                  aria-hidden="true"
                />
                <span>
                  Sector 12, Panchkula, Haryana (134112)
                </span>
              </div>

              <div className="accu-footer-contact-item">
                <i
                  className="fa-solid fa-phone"
                  aria-hidden="true"
                />

                <span>
                  <strong>Call: </strong>
                  <a href="tel:+918091696016">
                    8091696016
                  </a>
                  {" | "}
                  <a href="tel:+918091696017">
                    8091696017
                  </a>
                </span>
              </div>

              <div className="accu-footer-contact-item">
                <i
                  className="fa-brands fa-whatsapp"
                  aria-hidden="true"
                />

                <a
                  href="https://wa.me/918091696017"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  8091696017
                </a>
              </div>

              <div className="accu-footer-contact-item">
                <i
                  className="fa-solid fa-envelope"
                  aria-hidden="true"
                />

                <a href="mailto:sales@accutechinfo.com">
                  sales@accutechinfo.com
                </a>
              </div>

              <div className="accu-footer-contact-item">
                <img
                  src={asset("assets/images/arratai_logo.webp")}
                  alt=""
                  className="accu-footer-arattai-icon"
                />

                <a
                  href="https://aratt.ai/message/91-8091696016?text=Hello%20Accutech%20ERP"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Connect with us on Arattai
                </a>
              </div>

            </div>

            <div className="accu-footer-socials">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                >
                  <i
                    className={social.icon}
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>

          </div>
        </div>

        <div className="accu-footer-bottom">
          <Link
            to="/"
            aria-label="Accutech ERP Home"
            className="accu-footer-bottom-logo"
          >
            <img
              src={asset("assets/images/imunim.webp")}
              alt="Accutech ERP"
            />
          </Link>

          <p>
            Copyright © {year}{" "}
            <Link to="/">AccutechERP</Link>,
            All Rights Reserved.
          </p>
        </div>
      </div>

      <div className="accu-floating-contacts">

        <a
          href="https://aratt.ai/message/91-8091696016?text=Hello%20Accutech%20ERP"
          target="_blank"
          rel="noopener noreferrer"
          className="accu-floating-btn accu-floating-arattai"
          aria-label="Chat on Arattai"
          title="Chat on Arattai"
        >
          <img
            src={asset("assets/images/arratai_logo.webp")}
            alt=""
          />
        </a>

        <a
          href="https://wa.me/918091696017?text=Hello%20Accutech%20ERP"
          target="_blank"
          rel="noopener noreferrer"
          className="accu-floating-btn accu-floating-whatsapp"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
        >
          <i
            className="fa-brands fa-whatsapp"
            aria-hidden="true"
          />
        </a>

      </div>
    </footer>
  );
}
