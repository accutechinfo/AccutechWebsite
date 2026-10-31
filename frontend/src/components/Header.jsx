
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

import "./Header.css";

const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.app.accuChat";

const MESSAGE =
  "Visit our AccuChat App on Google Play for Smarter Team Communication, Task Tracking, and Secure Collaboration";

const accountingSections = [
  ["Accounts Management", "acc_accounts-management"],
  ["Product Management", "acc_product-management"],
  ["Transaction Processing", "acc_transaction-processing"],
  ["Sale & Purchase Reports", "acc_sales-purchase-reports"],
  ["Financial Reports", "acc_financial-reports"],
  ["GST Returns & Compliance", "acc_gst-compliance"],
  ["Account Books", "acc_account-books"],
];

const bulkSections = [
  ["Accounts Management", "bd_accounts-management"],
  ["Product Management", "bd_product-management"],
  ["Transaction Processing", "bd_transaction-processing"],
  ["Sale & Purchase Reports", "bd_sales-purchase-reports"],
  ["Financial Reports", "bd_financial-reports"],
  ["GST Returns & Compliance", "bd_gst-compliance"],
];

const fmcgSections = [
  ["Accounts Management", "fmcg_accounts-management"],
  ["Product Management", "fmcg_product-management"],
  ["Transaction Processing", "fmcg_transaction-processing"],
  ["Sale & Purchase Reports", "fmcg_sales-purchase-reports"],
  ["Financial Reports", "fmcg_financial-reports"],
  ["GST Returns & Compliance", "fmcg_gst-compliance"],
  ["Account Books", "fmcg_account-books"],
];

const services = [
  {
    title: "Advance Accounting",
    slug: "advance-accounting",
    sections: accountingSections,
  },
  {
    title: "Pharma Manufacturing",
    slug: "#",
    sections: [],
  },
  {
    title: "Pharma PCD",
    slug: "pharma-pcd",
    sections: [],
  },
  {
    title: "Bulk Drug Trading",
    slug: "bulk-drug-trading",
    sections: bulkSections,
  },
  {
    title: "Food Manufacturing",
    slug: "#",
    sections: [],
  },
  {
    title: "FMCG Distribution",
    slug: "fmcg-distribution",
    sections: fmcgSections,
  },
  {
    title: "General Trading",
    slug: "#",
    sections: [],
  },
];

export default function Header() {
  const location = useLocation();
  const headerRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const closeAll = () => {
    setMobileOpen(false);
    setServicesOpen(false);
    setActiveSubmenu(null);
  };

  useEffect(() => {
    closeAll();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        closeAll();
      }
    };

    const onEscape = (event) => {
      if (event.key === "Escape") {
        closeAll();
      }
    };

    document.addEventListener("pointerdown", onClickOutside);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("pointerdown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const handleUnavailableService = (event) => {
    // Keep the item visible but do not change the URL.
    event.preventDefault();
    closeAll();
  };

  const isDesktop = () => window.innerWidth >= 992;

  return (
    <header className="accu-header" ref={headerRef}>

      {/* ACCUCHAT MOVING ANNOUNCEMENT */}
      <div className="accu-top-announcement">
        <div className="accu-announcement-marquee">
          <div className="accu-announcement-track">

            {[0, 1].map((group) => (
              <div
                className="accu-announcement-group"
                key={group}
                aria-hidden={group === 1}
              >
                {[0, 1].map((item) => (
                  <a
                    key={item}
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="accu-announcement-message"
                    tabIndex={group === 1 ? -1 : 0}
                  >
                    {MESSAGE}
                  </a>
                ))}
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* STICKY NAVIGATION */}
      <div className="accu-navbar" id="siteHeader">
        <div className="accu-navbar-container">

          {/* LOGO */}
          <Link
            to="/"
            className="accu-logo-link"
            onClick={closeAll}
            aria-label="Accutech ERP Home"
          >
            <img
              src={asset("assets/images/imunim.webp")}
              alt="Accutech ERP"
              className="accu-logo-image"
            />
          </Link>

          {/* MOBILE BUTTON */}
          <button
            className="accu-mobile-menu-btn"
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={
              mobileOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={mobileOpen}
            aria-controls="accu-main-nav"
          >
            {mobileOpen ? <X size={25} /> : <Menu size={25} />}
          </button>

          {/* CENTERED MENU */}
          <div
            className={`accu-menu-wrapper ${
              mobileOpen ? "show" : ""
            }`}
            id="accu-main-nav"
          >
            <nav className="accu-menu" aria-label="Main navigation">

              <Link
                to="/"
                className={`accu-menu-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                onClick={closeAll}
              >
                Home
              </Link>

              <Link
                to="/#about"
                className="accu-menu-link"
                onClick={closeAll}
              >
                About
              </Link>

              {/* SERVICES DROPDOWN */}
              <div
                className={`accu-dropdown ${
                  servicesOpen ? "open" : ""
                }`}
                onMouseEnter={() => {
                  if (isDesktop()) {
                    setServicesOpen(true);
                  }
                }}
                onMouseLeave={() => {
                  if (isDesktop()) {
                    setServicesOpen(false);
                    setActiveSubmenu(null);
                  }
                }}
              >
                <button
                  type="button"
                  className={`accu-menu-link accu-dropdown-btn ${
                    location.pathname.startsWith("/services/")
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setServicesOpen((value) => !value);
                    setActiveSubmenu(null);
                  }}
                  aria-expanded={servicesOpen}
                  aria-controls="accu-services-menu"
                >
                  Services
                  <ChevronDown size={16} />
                </button>

                {servicesOpen && (
                  <div
                    className="accu-dropdown-menu"
                    id="accu-services-menu"
                  >
                    {services.map((service, index) => {

                      const unavailable =
                        !service.slug ||
                        service.slug.trim() === "#";

                      const servicePath = unavailable
                        ? "#"
                        : `/services/${service.slug}`;

                      const hasChildren =
                        !unavailable &&
                        Boolean(service.sections?.length);

                      const expanded =
                        activeSubmenu === index;

                      return (
                        <div
                          className="accu-dropdown-item-wrapper"
                          key={`${service.title}-${index}`}
                          onMouseEnter={() => {
                            if (isDesktop()) {
                              setActiveSubmenu(index);
                            }
                          }}
                          onMouseLeave={() => {
                            if (isDesktop()) {
                              setActiveSubmenu(null);
                            }
                          }}
                        >
                          <div className="accu-dropdown-row">

                            {unavailable ? (
                              <a
                                href="#"
                                className="accu-dropdown-link accu-service-placeholder"
                                onClick={handleUnavailableService}
                                title="Page coming soon"
                              >
                                {service.title}
                              </a>
                            ) : (
                              <Link
                                className="accu-dropdown-link"
                                to={servicePath}
                                onClick={closeAll}
                              >
                                {service.title}
                              </Link>
                            )}

                            {hasChildren && (
                              <button
                                type="button"
                                className="accu-dropdown-arrow"
                                aria-label={`Expand ${service.title}`}
                                aria-expanded={expanded}
                                onClick={() =>
                                  setActiveSubmenu(
                                    expanded ? null : index
                                  )
                                }
                              >
                                <ChevronRight size={16} />
                              </button>
                            )}

                          </div>

                          {hasChildren && expanded && (
                            <div className="accu-submenu">

                              {service.sections.map(
                                ([title, id]) => (
                                  <Link
                                    key={id}
                                    to={`${servicePath}#${id}`}
                                    onClick={closeAll}
                                  >
                                    {title}
                                  </Link>
                                )
                              )}

                              <div className="accu-submenu-divider" />

                              <Link
                                to={servicePath}
                                className="accu-show-all"
                                onClick={closeAll}
                              >
                                Show all...
                              </Link>

                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <Link
                to="/#EnquiryForm"
                className="accu-menu-link"
                onClick={closeAll}
              >
                Request Demo
              </Link>

              <Link
                to="/contactus"
                className={`accu-menu-link ${
                  location.pathname === "/contactus"
                    ? "active"
                    : ""
                }`}
                onClick={closeAll}
              >
                Contact Us
              </Link>

              <Link
                to="/front/accuchat"
                className={`accu-menu-link ${
                  location.pathname === "/front/accuchat"
                    ? "active"
                    : ""
                }`}
                onClick={closeAll}
              >
                AccuChat App
              </Link>

            </nav>
          </div>

          <div
            className="accu-navbar-balance"
            aria-hidden="true"
          />

        </div>
      </div>
    </header>
  );
}
