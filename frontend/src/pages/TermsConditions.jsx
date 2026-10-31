import { Link } from 'react-router-dom';
import './LegalPages.css';

const sections = [
  ['Introduction', <><p>These terms govern use of the Accutech ERP cloud software, accounting, GST, billing and inventory modules, and associated services and integrations. By using the platform, a user agrees to comply with the applicable terms.</p></>],
  ['License & Permitted Use', <><p>Subject to applicable fees, Accutech ERP grants a limited, non-exclusive, non-transferable license for authorized business use.</p><ul><li>Use the ERP for your own business operations and reporting</li><li>Access through supported web or authorized applications</li><li>Do not resell, rent, redistribute, reverse engineer, or copy the platform without authorization</li></ul></>],
  ['User Eligibility', <p>Users must be 18 or older, legally capable of entering an agreement, and provide accurate registration information. Access may be suspended when eligibility requirements are not met.</p>],
  ['User Responsibilities', <p>Users are responsible for accurate accounting, billing, inventory and tax data; reviewing calculations and reports; and complying with applicable law, including GST obligations. Incorrect user-entered data may lead to errors for which the provider disclaims responsibility.</p>],
  ['Subscription & Payments', <ul><li>Use is based on subscription plans.</li><li>Fees are non-refundable unless otherwise stated.</li><li>Non-payment may result in service suspension.</li></ul>],
  ['Data & Privacy', <p>Business data may be stored on secure servers and processed for service operations, improvement and compliance. Users must protect account credentials. The company states that it does not sell users’ data.</p>],
  ['Service Availability', <p>The service aims for reliable availability, but does not guarantee uninterrupted uptime, error-free operation, or compatibility with every system. Maintenance and technical issues may cause downtime.</p>],
  ['Limitation of Liability', <p>The published terms exclude liability for financial losses from incorrect data entry, tax penalties, compliance errors, and technical downtime, and limit total liability to the amount paid for the service.</p>],
  ['Intellectual Property', <p>Software code, designs, functionality, trademarks and other platform intellectual property belong to Accutech ERP and may not be copied, modified or distributed without authorization.</p>],
  ['Termination', <p>Access may be suspended or terminated for violations of the terms, misuse, or non-payment.</p>],
  ['Communication Consent', <p>The published terms include consent to receive service-related and promotional communication by email, SMS, WhatsApp and telephone.</p>],
  ['Security', <p>Users must safeguard their login credentials, prevent unauthorized access, and maintain appropriate security protections on their devices.</p>],
  ['Dispute Resolution', <p>The published terms specify the jurisdiction of courts in Punjab, India.</p>],
  ['Updates to Terms', <p>Accutech ERP may revise its terms and publish the updated version on the website.</p>],
  ['Contact Us', <p>For enquiries contact <a href="mailto:sales@accutecherp.com">sales@accutecherp.com</a> or <a href="mailto:hr@accutecherp.com">hr@accutecherp.com</a>. Website: <a href="https://accutecherp.com">accutecherp.com</a>.</p>],
];
export default function TermsConditions() {
  return <main className="accu-legal-page" id="top">
    <section className="accu-legal-hero"><div className="accu-legal-wrap"><div className="accu-legal-breadcrumb"><Link to="/">Home</Link><span>/</span> Terms & Conditions</div><span className="accu-legal-kicker">Legal information</span><h1>Terms & Conditions</h1><p>Please review the terms governing the use of Accutech ERP software, website and related services.</p></div></section>
    <div className="accu-legal-wrap accu-legal-layout"><aside className="accu-legal-toc"><strong>On this page</strong>{sections.map(([title], i) => <a key={title} href={`#terms-${i+1}`}>{i+1}. {title}</a>)}</aside>
      <article className="accu-legal-article"><p className="accu-legal-intro">These sections summarize the terms published by Accutech ERP. Before replacing your production legal notice, have the final text reviewed and approved for your business.</p>
        {sections.map(([title, body], i) => <section key={title} id={`terms-${i+1}`}><h2>{i+1}. {title}</h2>{body}</section>)}
        <a className="accu-legal-back" href="#top">Back to top ↑</a>
      </article>
    </div>
  </main>;
}
