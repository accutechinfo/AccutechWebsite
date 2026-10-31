import { Link, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import "./ThankYou.css";

export default function ThankYou(){
 const submitted=useLocation().state?.enquirySubmitted===true;
 return <main className="ct-thanks"><section className="ct-thanks-card">
  {submitted ? <><CheckCircle2 size={62} color="#00bc9c"/><h1>Thank You!</h1><p>Your request has been submitted successfully. Our team will contact you soon.</p></> :
  <><h1>Contact Accutech ERP</h1><p>Send us a message using the contact form.</p></>}
  <Link to={submitted?"/":"/contactus"}>{submitted?"Back to Home":"Contact Us"}</Link>
 </section></main>;
}
