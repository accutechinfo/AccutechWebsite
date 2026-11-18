import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import "./Header.css";

// Preserve the original logo asset and navigation destinations.
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.app.accuChat";
const MESSAGE = "Visit our AccuChat App on Google Play for Smarter Team Communication, Task Tracking, and Secure Collaboration";

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
  { title: "Advance Accounting", slug: "advance-accounting", sections: accountingSections },
  { title: "Pharma Manufacturing", slug: "#", sections: [] },
  { title: "Pharma PCD", slug: "pharma-pcd", sections: [] },
  { title: "Bulk Drug Trading", slug: "bulk-drug-trading", sections: bulkSections },
  { title: "Food Manufacturing", slug: "#", sections: [] },
  { title: "FMCG Distribution", slug: "fmcg-distribution", sections: fmcgSections },
  { title: "General Trading", slug: "#", sections: [] },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  // A brief grace period makes desktop hover menus easy to enter and click.
  const menuCloseTimer = useRef(null);
  const submenuCloseTimer = useRef(null);

  const cancelMenuClose = () => window.clearTimeout(menuCloseTimer.current);
  const cancelSubmenuClose = () => window.clearTimeout(submenuCloseTimer.current);

  const scheduleMenuClose = () => {
    cancelMenuClose();
    menuCloseTimer.current = window.setTimeout(() => {
      setServicesOpen(false);
      setActiveSubmenu(null);
    }, 350);
  };
  const scheduleSubmenuClose = () => {
    cancelSubmenuClose();
    submenuCloseTimer.current = window.setTimeout(() => setActiveSubmenu(null), 350);
  };

  useEffect(() => () => {
    cancelMenuClose();
    cancelSubmenuClose();
  }, []);

  const closeAll = () => {
    cancelMenuClose();
    cancelSubmenuClose();
    setMobileOpen(false);
    setServicesOpen(false);
    setActiveSubmenu(null);
  };

  useEffect(() => {
    closeAll();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const handleOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) closeAll();
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") closeAll();
    };
    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleUnavailableService = (event) => {
    event.preventDefault();
    closeAll();
  };
  // This homepage has a large GSAP 3D hero above the demo form.
  // Prefer the outer demo section (headline + form) over the form element alone.
  // Both IDs are supported so this remains compatible with older Home.jsx files.
  const scrollToDemo = (behavior = "smooth") => {
    const target = document.getElementById("demo-info") || document.getElementById("EnquiryForm");
    if (!target) return false;
    const navbar = headerRef.current?.querySelector(".accu-navbar-container");
    const headerBottom = navbar?.getBoundingClientRect().bottom || 0;
    const offset = Math.max(16, Math.min(110, headerBottom + 16));
    const destination = window.scrollY + target.getBoundingClientRect().top - offset;
    window.scrollTo({ top: Math.max(0, destination), behavior });
    return true;
  };

  const handleDemoClick = (event) => {
    closeAll();
    if (location.pathname === "/") {
      event.preventDefault();
      // Push the hash through React Router; same-hash clicks still scroll.
      if (location.hash !== "#EnquiryForm") {
        navigate({ pathname: "/", hash: "#EnquiryForm" });
      }
      scrollToDemo();
    }
    // On other routes, allow <Link> to navigate home. The effect below
    // retries until the homepage and its demo section have mounted.
  };

  useEffect(() => {
    if (location.pathname !== "/" || location.hash !== "#EnquiryForm") return;
    let raf = 0;
    let attempts = 0;
    const findAndScroll = () => {
      if (scrollToDemo("smooth")) return;
      if (++attempts < 120) raf = window.requestAnimationFrame(findAndScroll);
    };
    raf = window.requestAnimationFrame(findAndScroll);
    return () => window.cancelAnimationFrame(raf);
  }, [location.pathname, location.hash]);

  const isDesktop = () => window.innerWidth >= 992;

  return (
    <header className={`accu-header accu-split-glass accu-resizable-navbar${scrolled ? " is-scrolled" : ""}`} ref={headerRef}>
      {/* ACCUCHAT ANNOUNCEMENT: original continuous marquee and destination */}
      <div className="accu-top-announcement">
        <div className="accu-announcement-marquee">
          <div className="accu-announcement-track">
            {[0, 1].map((group) => (
              <div className="accu-announcement-group" key={group} aria-hidden={group === 1}>
                {[0, 1].map((item) => (
                  <a
                    key={item}
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="accu-announcement-message"
                    tabIndex={group === 1 ? -1 : 0}
                  >
                    <span className="accu-announcement-sparkle" aria-hidden="true">✦</span>
                    {MESSAGE}
                    <span className="accu-announcement-sparkle" aria-hidden="true">✦</span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resizable frosted navigation: watches window scrolling, not a demo scroll box */}
      <div className="accu-navbar" id="siteHeader">
        <div className="accu-navbar-container">
          <Link to="/" className="accu-logo-link" onClick={closeAll} aria-label="Accutech ERP Home">
            <img src={asset("assets/images/imunim.webp")} alt="Accutech ERP" className="accu-logo-image" />
          </Link>

          <button
            className="accu-mobile-menu-btn"
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="accu-main-nav"
          >
            {mobileOpen ? <X size={25} /> : <Menu size={25} />}
          </button>

          <div className={`accu-menu-wrapper ${mobileOpen ? "show" : ""}`} id="accu-main-nav">
            <nav className="accu-menu" aria-label="Main navigation">
              <Link to="/" className={`accu-menu-link ${location.pathname === "/" ? "active" : ""}`} onClick={closeAll}>Home</Link>
              <Link to="/#about" className="accu-menu-link" onClick={closeAll}>About</Link>
              <div
                className={`accu-dropdown ${servicesOpen ? "open" : ""}`}
                onMouseEnter={() => {
                  if (!isDesktop()) return;
                  cancelMenuClose();
                  cancelSubmenuClose();
                  setServicesOpen(true);
                }}
                onMouseLeave={() => {
                  if (isDesktop()) scheduleMenuClose();
                }}
              >
                <button
                  type="button"
                  className={`accu-menu-link accu-dropdown-btn ${location.pathname.startsWith("/services/") ? "active" : ""}`}
                  onClick={() => { setServicesOpen((value) => !value); setActiveSubmenu(null); }}
                  aria-expanded={servicesOpen}
                  aria-controls="accu-services-menu"
                >
                  Services <ChevronDown size={16} />
                </button>
                {servicesOpen && (
                  <div className="accu-dropdown-menu" id="accu-services-menu">
                    {services.map((service, index) => {
                      const unavailable = !service.slug || service.slug.trim() === "#";
                      const servicePath = unavailable ? "#" : `/services/${service.slug}`;
                      const hasChildren = !unavailable && Boolean(service.sections?.length);
                      const expanded = activeSubmenu === index;
                      return (
                        <div
                          className="accu-dropdown-item-wrapper"
                          key={`${service.title}-${index}`}
                          onMouseEnter={() => {
                            if (!isDesktop()) return;
                            cancelMenuClose();
                            cancelSubmenuClose();
                            setActiveSubmenu(index);
                          }}
                          onMouseLeave={() => {
                            if (isDesktop()) scheduleSubmenuClose();
                          }}
                        >
                          <div className="accu-dropdown-row">
                            {unavailable ? (
                              <a href="#" className="accu-dropdown-link accu-service-placeholder" onClick={handleUnavailableService} title="Page coming soon">{service.title}</a>
                            ) : (
                              <Link className="accu-dropdown-link" to={servicePath} onClick={closeAll}>{service.title}</Link>
                            )}
                            {hasChildren && (
                              <button
                                type="button"
                                className="accu-dropdown-arrow"
                                aria-label={`Expand ${service.title}`}
                                aria-expanded={expanded}
                                onClick={() => setActiveSubmenu(expanded ? null : index)}
                              ><ChevronRight size={16} /></button>
                            )}
                          </div>
                          {hasChildren && expanded && (
                            <div className="accu-submenu" onMouseEnter={() => { cancelMenuClose(); cancelSubmenuClose(); }}>
                              {service.sections.map(([title, id]) => (
                                <Link key={id} to={`${servicePath}#${id}`} onClick={closeAll}>{title}</Link>
                              ))}
                              <div className="accu-submenu-divider" />
                              <Link to={servicePath} className="accu-show-all" onClick={closeAll}>Show all...</Link>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <Link to="/#EnquiryForm" className="accu-menu-link accu-demo-link" onClick={handleDemoClick}>Request Demo</Link>
              <Link to="/contactus" className={`accu-menu-link ${location.pathname === "/contactus" ? "active" : ""}`} onClick={closeAll}>Contact Us</Link>
              <Link to="/front/accuchat" className={`accu-menu-link ${location.pathname === "/front/accuchat" ? "active" : ""}`} onClick={closeAll}>AccuChat App</Link>
            </nav>
          </div>
          <div className="accu-navbar-balance" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
