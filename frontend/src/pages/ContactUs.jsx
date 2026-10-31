import DemoEnquiryForm from "../components/DemoEnquiryForm";
import "./ContactUs.css";

const asset = path => `${import.meta.env.BASE_URL}${path}`;
const socials = [
 ["Facebook", "facebook-f", "https://www.facebook.com/accutecherp/"],
 ["X", "x-twitter", "https://x.com/accutech_erp"],
 ["Pinterest", "pinterest-p", "https://in.pinterest.com/accutech_erp/"],
 ["LinkedIn", "linkedin-in", "https://www.linkedin.com/company/accutecherp/"],
 ["Instagram", "instagram", "https://www.instagram.com/accutech_erp/"],
 ["YouTube", "youtube", "https://www.youtube.com/@AccutechERP"]
];

export default function ContactUs(){
 return <main className="ct-page">
   <section className="ct-hero"><div className="ct-container ct-hero-grid">
    <div><span className="ct-badge">Get in touch</span><h1>Contact <strong>Us</strong></h1>
     <p>Get in touch with us to see how our company can help you grow your business online.</p>
     <ul><li>Quick responses within business hours</li><li>Expert team for demo &amp; onboarding</li></ul></div>
    <img src={asset("assets/images/contact-person.svg")} alt="Contact Accutech ERP" onError={e=>e.currentTarget.style.display="none"} />
   </div></section>
   <section className="ct-main" id="demo-section"><div className="ct-container ct-grid">
    <div className="ct-info">
     <span className="ct-badge">Contacts</span>
     <h2>We Will Love To Hear From You. Feel Free To <strong>Leave Us Some Words.</strong></h2>
     <div className="ct-address"><h3>Our address</h3>
      <a href="mailto:sales@accutechinfo.com"><i className="fa-solid fa-envelope"/> sales@accutechinfo.com</a>
      <a href="tel:+918091696016"><i className="fa-solid fa-phone"/> Call: +91-8091696016 | +91-8091696017</a>
      <a href="https://wa.me/918091696016" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"/> WhatsApp: +91-8091696016</a>
      <p><i className="fa-solid fa-location-arrow"/> Sector 12, Panchkula Haryana (134112)</p>
     </div>
     <div className="ct-social"><h3>Follow Us On <strong>Social Media</strong></h3>
      <p>We are active on various social media platforms. Like, share and follow to get updates.</p>
      <div className="ct-icons">{socials.map(([label,icon,url])=><a key={label} href={url} aria-label={label} title={label} rel="noopener noreferrer" target="_blank"><i className={`fa-brands fa-${icon}`}/></a>)}</div>
     </div>
    </div>
    <div><DemoEnquiryForm variant="contact" source="Contact Us"/></div>
   </div>
   <div className="ct-container ct-map"><h2>Find Us On <strong>the Map</strong></h2>
    <iframe title="Accutech ERP Panchkula office" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=SCO%2037%20Sector%2012%20Panchkula%20Haryana&output=embed"/>
   </div></section>
 </main>;
}
