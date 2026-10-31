import { Link } from 'react-router-dom';
import './LegalPages.css';

const sections = [
  { title: 'Scope of Application', body: <><p>This policy applies to the AccutechERP web ERP platform used by administrators, accountants, and business managers, and to the SalesApp mobile application used by field sales personnel.</p></> },
  { title: 'User Accounts', body: <p>ERP and SalesApp user accounts are created and managed by the company administrator. Neither platform offers public self-registration.</p> },
  { title: 'Data We Collect', body: <><h3>AccutechERP web platform</h3><ul><li>Company and user profiles, such as names, email addresses, roles, and business information</li><li>Financial, sales, inventory, and billing records</li><li>Activity and audit logs</li></ul><h3>SalesApp mobile application</h3><ul><li>Administrator-assigned user ID, name, and phone number</li><li>Precise or approximate location during work-related functions such as attendance, tagged order entries, and field-visit verification</li><li>Device model, operating system, and IP address for application security and analytics</li></ul></> },
  { title: 'Purpose of Data Collection', body: <p>Information supports accounting, inventory, orders, customer management, attendance, field visits, sales orders, offline synchronization, application security, and performance improvements.</p> },
  { title: 'Data Storage and Protection', body: <ul><li>Each client company has a separate, isolated database.</li><li>Data in transit is protected by SSL/TLS encryption.</li><li>Hosting uses backups, firewall protection, and other security measures.</li></ul> },
  { title: 'Location Data Usage (SalesApp only)', body: <ul><li>Location is collected during logged-in, work-related activities such as attendance or order tagging.</li><li>The stated policy does not provide for background location collection outside business use.</li><li>Location is retained when relevant to company operations.</li></ul> },
  { title: 'Data Sharing Policy', body: <p>The current policy states that user data is not sold or shared with external third parties. Authorized company users and approved AccutechERP support personnel may access relevant information.</p> },
  { title: 'Third-Party Services', body: <p>Services such as Google Maps, Firebase Analytics, or similar SDKs may be used to enable functionality and collect technical usage information according to their respective policies.</p> },
  { title: 'User Control and Rights', body: <p>User data is created, updated, or deleted through administrator access. Contact your company administrator for requests relating to your data.</p> },
  { title: 'Policy Updates', body: <p>The policy may change over time; the latest version is published on the website.</p> },
  { title: 'Contact Information', body: <p>For privacy enquiries, email <a href="mailto:sales@accutechinfo.com">sales@accutechinfo.com</a> or call <a href="tel:+919418094412">+91-9418094412</a>.</p> },
];

export default function PrivacyPolicy() {
  return <main className="accu-legal-page" id="top">
    <section className="accu-legal-hero"><div className="accu-legal-wrap"><div className="accu-legal-breadcrumb"><Link to="/">Home</Link><span>/</span> Privacy Policy</div><span className="accu-legal-kicker">Legal & privacy</span><h1>Privacy Policy — AccutechERP & SalesApp</h1><p>How we collect, use, store and protect information across our ERP platform and field sales application.</p><div className="accu-legal-date">Last updated: July 1, 2026</div></div></section>
    <div className="accu-legal-wrap accu-legal-layout"><aside className="accu-legal-toc"><strong>On this page</strong>{sections.map((s, i) => <a key={s.title} href={`#privacy-${i+1}`}>{i+1}. {s.title}</a>)}</aside>
      <article className="accu-legal-article"><p className="accu-legal-intro">AccutechERP and its associated SalesApp mobile application are committed to privacy and data security. The following sections describe the policy currently published for both services.</p>
        {sections.map((s, i) => <section key={s.title} id={`privacy-${i+1}`}><h2>{i+1}. {s.title}</h2>{s.body}</section>)}
        <a className="accu-legal-back" href="#top">Back to top ↑</a>
      </article>
    </div>
  </main>;
}
