
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EnquiryForm.css";

const initialData = {
  first_name: "",
  last_name: "",
  name: "",
  email: "",
  phone_no: "",
  phone: "",
  company: "",
  industry: "",
  erp_requirement: "",
  message: "",
  website: "",
};

export default function EnquiryForm({
  type = "landing",
  title,
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const isLanding = type === "landing";
  const isContact = type === "contact";

  const formTitle =
    title ||
    (isContact
      ? "Contact Accutech ERP"
      : "Request a Free ERP Demo");

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setErrors({});
    setNotice("");
    setWhatsappUrl("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...form,
          form_type: type,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.status) {
        if (result.errors) {
          setErrors(result.errors);
        }

        throw new Error(
          result.message ||
          "Unable to submit your request."
        );
      }

      setForm(initialData);

      if (isContact) {
        navigate("/thankyou-contact");
        return;
      }

      setNotice(result.message);

      if (isLanding && result.whatsapp_url) {
        setWhatsappUrl(result.whatsapp_url);
      }
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  const fieldError = (name) => {
    return errors[name]?.[0] || "";
  };

  return (
    <section className="erp-form-card" id="EnquiryForm">
      <div className="erp-form-heading">
        <span>ACCUTECH ERP</span>
        <h2>{formTitle}</h2>
        <p>
          Share your requirements and our team will
          contact you.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="erp-form-grid">

          {isLanding ? (
            <div className="erp-form-field full">
              <label htmlFor="erp-name">
                Name <b>*</b>
              </label>
              <input
                id="erp-name"
                name="name"
                value={form.name}
                onChange={updateField}
                maxLength={80}
                required
                placeholder="Enter your full name"
              />
              {fieldError("name") && (
                <small>{fieldError("name")}</small>
              )}
            </div>
          ) : (
            <>
              <div className="erp-form-field">
                <label htmlFor="erp-first-name">
                  {isContact ? "First Name" : "Name"} <b>*</b>
                </label>
                <input
                  id="erp-first-name"
                  name="first_name"
                  value={form.first_name}
                  onChange={updateField}
                  maxLength={50}
                  required
                  placeholder="Enter your name"
                />
                {fieldError("first_name") && (
                  <small>{fieldError("first_name")}</small>
                )}
              </div>

              {isContact && (
                <div className="erp-form-field">
                  <label htmlFor="erp-last-name">
                    Last Name <b>*</b>
                  </label>
                  <input
                    id="erp-last-name"
                    name="last_name"
                    value={form.last_name}
                    onChange={updateField}
                    maxLength={50}
                    required
                    placeholder="Enter last name"
                  />
                  {fieldError("last_name") && (
                    <small>{fieldError("last_name")}</small>
                  )}
                </div>
              )}
            </>
          )}

          <div className="erp-form-field">
            <label htmlFor="erp-email">
              Email Address <b>*</b>
            </label>
            <input
              id="erp-email"
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              required
              placeholder="name@company.com"
            />
            {fieldError("email") && (
              <small>{fieldError("email")}</small>
            )}
          </div>

          <div className="erp-form-field">
            <label htmlFor="erp-phone">
              Phone Number <b>*</b>
            </label>
            <input
              id="erp-phone"
              type="tel"
              name={isLanding ? "phone" : "phone_no"}
              value={isLanding ? form.phone : form.phone_no}
              onChange={updateField}
              inputMode="numeric"
              pattern={isLanding ? "[6-9][0-9]{9}" : "[0-9]{10}"}
              maxLength={10}
              required
              placeholder="10-digit mobile number"
            />
            {fieldError(isLanding ? "phone" : "phone_no") && (
              <small>
                {fieldError(isLanding ? "phone" : "phone_no")}
              </small>
            )}
          </div>

          {isLanding && (
            <>
              <div className="erp-form-field">
                <label htmlFor="erp-company">Company Name</label>
                <input
                  id="erp-company"
                  name="company"
                  value={form.company}
                  onChange={updateField}
                  maxLength={100}
                  placeholder="Company name"
                />
              </div>

              <div className="erp-form-field">
                <label htmlFor="erp-industry">Industry</label>
                <select
                  id="erp-industry"
                  name="industry"
                  value={form.industry}
                  onChange={updateField}
                >
                  <option value="">Select Industry</option>
                  <option value="Pharmaceutical">Pharmaceutical</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="FMCG">FMCG</option>
                  <option value="Distribution">Distribution</option>
                  <option value="Retail">Retail</option>
                  <option value="Trading">Trading</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="erp-form-field full">
                <label htmlFor="erp-requirement">
                  ERP Requirement
                </label>
                <select
                  id="erp-requirement"
                  name="erp_requirement"
                  value={form.erp_requirement}
                  onChange={updateField}
                >
                  <option value="">Select Requirement</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Billing & GST">Billing & GST</option>
                  <option value="Inventory Management">
                    Inventory Management
                  </option>
                  <option value="Production Management">
                    Production Management
                  </option>
                  <option value="Complete ERP">
                    Complete ERP
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </>
          )}

          <div className="erp-form-field full">
            <label htmlFor="erp-message">
              Message <b>*</b>
            </label>
            <textarea
              id="erp-message"
              name="message"
              value={form.message}
              onChange={updateField}
              rows={5}
              maxLength={isLanding ? 1000 : undefined}
              required
              placeholder="Tell us about your requirements..."
            />
            {fieldError("message") && (
              <small>{fieldError("message")}</small>
            )}
          </div>

        </div>

        {/* Honeypot: hidden from legitimate visitors */}
        <div
          className="erp-honeypot"
          aria-hidden="true"
        >
          <label htmlFor="erp-website">Website</label>
          <input
            id="erp-website"
            name="website"
            value={form.website}
            onChange={updateField}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <button
          className="erp-form-submit"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Sending..."
            : isContact
              ? "Send Message"
              : "Request Free Demo"}
        </button>

        {notice && (
          <p
            className="erp-form-notice"
            role="status"
            aria-live="polite"
          >
            {notice}
          </p>
        )}

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="erp-whatsapp-button"
          >
            Continue on WhatsApp
          </a>
        )}
      </form>
    </section>
  );
}
