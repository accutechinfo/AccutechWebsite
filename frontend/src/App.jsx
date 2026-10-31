
import { useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  Link,
} from "react-router-dom";

// Common Components
import Header from "./components/Header";
import SiteSEO from "./components/SiteSEO";
import SiteTracking from "./components/SiteTracking";
import Footer from "./components/Footer";

// Main Website Pages
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";

// Demo & Contact Pages
import RequestDemo from "./pages/RequestDemo";
import ContactUs from "./pages/ContactUs";
import ThankYou from "./pages/ThankYou";

// Information Pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Videos from "./pages/Videos";

import CustomerLogin from "./pages/CustomerLogin";
import CustomerVerify from "./pages/CustomerVerify";
import CustomerPassword from "./pages/CustomerPassword";
import AccuChat from "./pages/AccuChat";
import ServicePage from "./pages/ServicePage";
import { servicePages } from "./data/servicePages";
import GuidePage from "./pages/GuidePage";
import Testimonials from "./pages/Testimonials";
import Pages from "./pages/Pages";
import PageDetail from "./pages/PageDetail";
// Global CSS
import "./App.css";

/**
 * Scroll to top on route change.
 * Scroll to section when URL contains #section.
 */
function ScrollToSection() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    let timeoutId;
    let attempts = 0;
    let cancelled = false;

    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      return;
    }

    const id = decodeURIComponent(hash.substring(1));

    function scrollToTarget() {
      if (cancelled) return;

      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }

      if (attempts < 10) {
        attempts++;
        timeoutId = window.setTimeout(scrollToTarget, 100);
      }
    }

    timeoutId = window.setTimeout(scrollToTarget, 100);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [pathname, hash]);

  return null;
}

/**
 * 404 Page
 */
function NotFound() {
  return (
    <section
      className="accu-not-found"
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "50px 20px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "64px",
          marginBottom: "10px",
          color: "#172447",
        }}
      >
        404
      </h1>

      <h2>Page Not Found</h2>

      <p style={{ color: "#66728b", marginTop: "10px" }}>
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        style={{
          marginTop: "25px",
          padding: "12px 26px",
          background: "#2451df",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
          display: "inline-block",
          fontWeight: "600",
        }}
      >
        Back to Home
      </Link>
    </section>
  );
}

/**
 * Main React Application
 *
 * React Frontend:
 * http://127.0.0.1:5173
 *
 * Laravel Filament:
 * http://127.0.0.1:8000/admin
 */
export default function App() {
  const backendUrl = (
    import.meta.env.VITE_BACKEND_URL ||
    "http://127.0.0.1:8000"
  ).replace(/\/$/, "");

  return (
    <>
      {/* Scroll Management */}
      <ScrollToSection />
        <SiteSEO />
        <SiteTracking />

      {/* Common Website Header */}
      <Header
        isAuthenticated={false}
        loginUrl="/login"
      />

      {/* Main Website Content */}
      <main id="main-content">
        <Routes>

          {/* Homepage */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Blog Listing */}
          <Route
            path="/blogs"
            element={<Blogs />}
          />

          {/* Single Blog */}
          <Route
            path="/blog/:slug"
            element={<BlogDetail />}
          />

          {/* Legacy Blog Detail URLs */}
          <Route
            path="/blogs/:slug"
            element={<BlogDetail />}
          />

          {/* Blog Redirect */}
          <Route
            path="/blog"
            element={<Navigate to="/blogs" replace />}
          />

          {/* Request Demo */}
          <Route
            path="/request-demo"
            element={<RequestDemo />}
          />

          {/* Contact Us */}
          <Route
            path="/contactus"
            element={<ContactUs />}
          />

          {/* Thank You */}
          <Route
            path="/thankyou-contact"
            element={<ThankYou />}
          />

          {/* Privacy Policy */}
          <Route
            path="/front/privacy_policy"
            element={<PrivacyPolicy />}
          />

          {/* Optional Privacy URL */}
          <Route
            path="/privacy-policy"
            element={
              <Navigate
                to="/front/privacy_policy"
                replace
              />
            }
          />

          {/* Terms & Conditions */}
          <Route
            path="/policies/terms"
            element={<TermsConditions />}
          />

          {/* Videos */}
          <Route
            path="/videos"
            element={<Videos />}
          />

          {/* Customer Login */}
          <Route
            path="/login"
            element={<CustomerLogin />}
          />

          {/* New Customer Registration */}
          <Route
            path="/login/verify_user"
            element={<CustomerVerify />}
          />

          {/* Forgot Password */}
          <Route
            path="/login/forgot_password"
            element={<CustomerVerify />}
          />

          {/* Create Password */}
          <Route
            path="/login/create_password"
            element={<CustomerPassword />}
          />

          {/* Reset Password */}
          <Route
            path="/login/update_password"
            element={<CustomerPassword />}
          />


          {/* All seven service pages — original URLs */}
          {Object.entries(servicePages).map(([slug, page]) => (
            <Route
              key={slug}
              path={`/services/${slug}`}
              element={<ServicePage page={page} />}
            />
          ))}

          {/* Short URLs used by your Footer */}
          {Object.entries(servicePages).map(([slug, page]) => (
            <Route
              key={`short-${slug}`}
              path={`/${slug}`}
              element={<ServicePage page={page} />}
            />
          ))}
          {/* Guide Pages */}
            <Route
              path="/guide/:slug"
              element={<GuidePage />}
            />

            {/* Testimonials */}
            <Route
              path="/front/testimonials"
              element={<Testimonials />}
            />
          <Route path="/pages" element={<Pages />} />

          <Route path="/page/:slug" element={<PageDetail />} />
          {/* 404 Fallback - Always Last */}
          <Route
            path="*"
            element={<NotFound />}
          />
          {/* AccuChat Page */}
          <Route
            path="/front/accuchat"
            element={<AccuChat />}
          />

          {/* Optional Short URL */}
          <Route
            path="/accuchat"
            element={
              <Navigate to="/front/accuchat" replace />
            }
          />
        </Routes>
      </main>

      {/* Common Website Footer */}
      <Footer />
    </>
  );
}
