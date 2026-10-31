// Backwards-compatible adapter: all ServicePage.jsx portal forms use the same API/UI component.
import DemoEnquiryForm from "./DemoEnquiryForm";
export default function ServiceDemoForm({ service }) {
  return <DemoEnquiryForm variant="service" source={`Service: ${service || "ERP"}`} />;
}
