
import { useState } from "react";
import { Lock, Send } from "lucide-react";
import "./DemoEnquiryForm.css";

const EMPTY = {
  first_name: "",
  last_name: "",
  email: "",
  phone_no: "",
  message: "",
  website: "",
};

export default function DemoEnquiryForm({
  variant = "hero",
  source = "Website",
  title = "Book a Demo",
  description = "Get a quick ERP consultation from Accutech ERP team.",
}) {
  const isContact = variant === "contact";
  const isHome = variant === "home";
  const isService = variant === "service";

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [sending, setSending] = useState(false);

  const change = (name) => (event) => {
    setForm((previous) => ({
      ...previous,
      [name]: event.target.value,
    }));
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (sending) return;

    setSending(true);
    setErrors({});
    setFeedback(null);

    try {
      const base = (
        import.meta.env.VITE_API_URL || "/api"
      ).replace(/\/+$/, "");

      const response = await fetch(`${base}/enquiries`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: form.first_name.trim(),

          ...(isContact
            ? { last_name: form.last_name.trim() }
            : {}),

          email: form.email.trim(),
          phone_no: form.phone_no.trim(),
          message: form.message.trim(),

          website: form.website,
          form_type: isContact ? "contact" : "demo",
          source,
          current_url: window.location.pathname,
        }),
      });

      const result = await response.json().catch(() => ({}));

      const failed =
        !response.ok ||
        result.success === false ||
        result.status === false ||
        result.status === "error" ||
        result.status === "failed";

      if (failed) {
        if (result.errors && typeof result.errors === "object") {
          setErrors(result.errors);
        }

        const firstError = Object.values(
          result.errors || {}
        ).flat()[0];

        throw new Error(
          firstError ||
          result.message ||
          `Unable to submit request (${response.status}).`
        );
      }

      // Clear fields only after Laravel confirms success.
      setForm(EMPTY);

      // Show success below the button.
      // No navigation or redirect.
      setFeedback({
        success: true,
        message:
          result.message ||
          "Your request has been submitted successfully. Our team will contact you soon.",
      });

    } catch (error) {
      setFeedback({
        success: false,
        message:
          error.message ||
          "Email not sent. Please try again.",
      });
    } finally {
      setSending(false);
    }
  }

  const wrapperClass = isContact
    ? "demo-common demo-common-contact"
    : isHome
    ? "hn-demo-card demo-common demo-common-home"
    : isService
    ? "demo-common demo-common-service"
    : "pd-demo-card demo-common demo-common-hero";

  const fields = [
    {
      name: "first_name",
      label: isContact ? "First Name" : "Name",
      type: "text",
      placeholder: "Name*",
      maxlength: 50,
    },
    ...(isContact
      ? [{
          name: "last_name",
          label: "Last Name",
          type: "text",
          placeholder: "Last Name*",
          maxlength: 50,
        }]
      : []),
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Email*",
      maxlength: 255,
    },
    {
      name: "phone_no",
      label: "Phone Number",
      type: "tel",
      placeholder: "Phone Number*",
      maxlength: 10,
    },
  ];

  return (
    <div className={wrapperClass} id="EnquiryForm">

      {isContact ? (
        <h3 className="demo-contact-heading">
          <strong>Send Us</strong> a Message
        </h3>
      ) : !isService && (
        isHome ? (
          <>
            <h3>
              <span>Book</span> a Demo
            </h3>
            <div className="hn-heading-line" />
            <p>
              Fill out the form and our team will get back to you.
            </p>
          </>
        ) : (
          <div className="pd-demo-head">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        )
      )}

      <form
        className={`demo-common-form${
          isService ? " service-demo-form" : ""
        }`}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        {fields.map((field) => (
          <label
            className="demo-common-field"
            key={field.name}
          >
            {(isHome || isContact) && (
              <span className="demo-common-label">
                {field.label}*
              </span>
            )}

            <input
              name={field.name}
              aria-label={field.label}
              type={field.type}
              maxLength={field.maxlength}
              pattern={
                field.name === "phone_no"
                  ? "[0-9]{10}"
                  : undefined
              }
              inputMode={
                field.name === "phone_no"
                  ? "numeric"
                  : undefined
              }
              value={form[field.name]}
              onChange={change(field.name)}
              placeholder={
                isContact
                  ? ""
                  : isHome
                  ? `Enter your ${field.label.toLowerCase()}`
                  : field.placeholder
              }
              required
            />

            {errors[field.name] && (
              <small role="alert">
                {[]
                  .concat(errors[field.name])[0]}
              </small>
            )}
          </label>
        ))}

        <label className="demo-common-field">
          {(isHome || isContact) && (
            <span className="demo-common-label">
              Message*
            </span>
          )}

          <textarea
            name="message"
            aria-label="Message"
            rows={isHome ? 3 : 4}
            placeholder={
              isContact
                ? ""
                : isHome
                ? "Type your message here..."
                : "Message"
            }
            value={form.message}
            onChange={change("message")}
            required
          />

          {errors.message && (
            <small role="alert">
              {[]
                .concat(errors.message)[0]}
            </small>
          )}
        </label>

        {/* Anti-spam honeypot */}
        <div
          className="demo-common-trap"
          aria-hidden="true"
        >
          <label>
            Leave this field empty
            <input
              name="website"
              value={form.website}
              tabIndex={-1}
              autoComplete="off"
              onChange={change("website")}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={sending}
          className="demo-common-submit"
        >
          {isHome && <Send size={16} />}

          {sending ? "Sending..." : "Send Message"}
        </button>

        {/* COMMON SUCCESS / ERROR MESSAGE */}
        {feedback && (
          <div
            role={feedback.success ? "status" : "alert"}
            className={
              feedback.success
                ? "demo-common-success"
                : "demo-common-error"
            }
            aria-live="polite"
          >
            {feedback.message}
          </div>
        )}

        {isHome ? (
          <p className="demo-common-privacy">
            <Lock size={13} />
            We respect your privacy. Your information is safe with us.
          </p>
        ) : !isService && !isContact ? (
          <a
            href="tel:+918091696016"
            className="pd-demo-phone"
          >
            Call: 8091696016
          </a>
        ) : null}

      </form>
    </div>
  );
}
