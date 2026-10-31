import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AccuChat.css";

const playStoreLink = "https://play.google.com/store/apps/details?id=com.app.accuChat";
const screenshots = Array.from({ length: 8 }, (_, index) =>
  `/assets/img/accuchat/accuchat_${index + 1}.webp`
);
const tags = ["Company-wise Chat", "Task Management", "Self Chat", "Secure Login", "Gallery Management"];
const whyPoints = [
  {
    "title": "Centralized Communication",
    "description": "Keep messages, updates, and coordination in one place."
  },
  {
    "title": "Task Visibility",
    "description": "Create tasks from chat and track progress clearly."
  },
  {
    "title": "Better Team Alignment",
    "description": "Help departments and remote teams stay on the same page."
  },
  {
    "title": "Secure Workspaces",
    "description": "Keep company communication organized and protected."
  }
];
const problems = [
  {
    "title": "Too Many Tools",
    "description": "Switching between WhatsApp, email, and calls causes updates and decisions to get lost."
  },
  {
    "title": "Unorganized Chats",
    "description": "Important discussions, files, and instructions become difficult to find later."
  },
  {
    "title": "No Task Accountability",
    "description": "Without proper tracking, teams miss ownership, progress visibility, and deadlines."
  },
  {
    "title": "Multiple Team Challenges",
    "description": "Departments and branches struggle to stay aligned when communication is scattered."
  },
  {
    "title": "Remote Work Gaps",
    "description": "Remote and hybrid teams need structured communication to collaborate smoothly."
  }
];
const industries = [
  {
    "title": "IT & Software",
    "description": "Manage development coordination, issue discussion, and team communication."
  },
  {
    "title": "Accounting Firms",
    "description": "Assign work, follow up on reports, and manage team updates in one place."
  },
  {
    "title": "Manufacturing",
    "description": "Connect management, production, dispatch, and warehouse communication."
  },
  {
    "title": "Pharmaceutical",
    "description": "Coordinate teams across sales, warehouse, and operational units."
  },
  {
    "title": "Agencies",
    "description": "Track campaigns, team discussions, and project tasks more efficiently."
  },
  {
    "title": "Startups",
    "description": "Keep growing teams aligned without relying on multiple communication tools."
  }
];
const faqs = [
  {
    "question": "What is a business communication platform?",
    "answer": "A business communication platform is a digital tool that allows employees to communicate, collaborate, and manage work within an organization. These platforms combine features such as messaging, file sharing, task management, and team coordination to improve workplace productivity. Tools like AccuChat help companies keep communication organized and secure."
  },
  {
    "question": "Why do companies need internal communication software?",
    "answer": "Companies need internal communication software to ensure that employees can collaborate efficiently. Without a structured communication system, businesses often face problems such as missed messages, delayed decisions, and unorganized workflows. A dedicated platform centralizes communication and keeps teams aligned."
  },
  {
    "question": "Why is WhatsApp not suitable for business communication?",
    "answer": "While WhatsApp is useful for quick messaging, it is not designed for structured business communication. Important work messages can easily get lost in chats, there is no proper task tracking, and managing professional communication in large groups becomes difficult. Business platforms provide better organization and accountability."
  },
  {
    "question": "What are the benefits of using a team communication app?",
    "answer": "Team communication apps offer several advantages, including faster information sharing, improved collaboration, better task tracking, and centralized communication. They also help reduce email overload and allow teams to respond quickly to work updates."
  },
  {
    "question": "How can communication software improve team productivity?",
    "answer": "Communication software improves productivity by reducing confusion and delays. When employees can quickly communicate, assign tasks, and track progress within the same platform, work becomes more organized and efficient. This helps teams complete projects faster."
  },
  {
    "question": "What features should a business communication app have?",
    "answer": "A good business communication app should include features such as instant messaging, group chats, task management, file sharing, user management, notifications, and secure access. These features help organizations maintain smooth and organized collaboration."
  },
  {
    "question": "What industries benefit most from team communication platforms?",
    "answer": "Many industries benefit from communication platforms, including IT companies, accounting firms, manufacturing businesses, pharmaceutical companies, marketing agencies, startups, and consulting firms. Any organization with multiple team members can improve coordination using such tools."
  },
  {
    "question": "How do task management features help businesses?",
    "answer": "Task management features allow managers to assign work to employees, track progress, and ensure accountability. When tasks are clearly defined and monitored, employees understand their responsibilities and deadlines more effectively."
  },
  {
    "question": "Is internal communication software secure for company data?",
    "answer": "Most professional communication platforms are designed with security in mind. They offer controlled user access, secure login systems, and private workspaces to protect company data and sensitive conversations."
  },
  {
    "question": "Can small businesses benefit from communication platforms?",
    "answer": "Yes, small businesses can benefit significantly from communication platforms. These tools help small teams stay organized, improve coordination, and manage work efficiently without needing complex enterprise systems."
  }
];
const advantages = [
  "Organized team communication", "Task creation from chat",
  "Multi-company workspace support", "Better accountability",
  "Secure environment for business use"
];
const benefits = ["Improved productivity", "Better team coordination", "Higher accountability", "Centralized communication", "Secure work environment"];
const workflow = [
  ["Pending", "Track upcoming work"],
  ["In Progress", "Monitor active tasks"],
  ["Completed", "See finished work clearly"],
  ["Secure", "Private business communication"]
];

function CheckList({ items }) {
  return <ul className="accuchat-check-list">{items.map(item => <li key={item}>{item}</li>)}</ul>;
}

export default function AccuChat() {
  const [slide, setSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [imageUnavailable, setImageUnavailable] = useState(false);

  useEffect(() => {
    document.title = "AccuChat | Team Communication, Chat & Business Collaboration App";
    const id = window.setInterval(() => setSlide(prev => (prev + 1) % screenshots.length), 2500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="accuchat-page">
      <section className="accuchat-hero">
        <div className="container accuchat-hero-grid">
          <div className="accuchat-hero-copy">
            <span className="accuchat-soft-badge">Smart Business Communication App</span>
            <h1 className="accuchat-title">Smarter Team Communication <br /> with <strong>AccuChat</strong></h1>
            <p className="accuchat-lead">AccuChat keeps business chats, tasks, and team coordination in one organized workspace. It improves accountability, reduces confusion, and helps teams collaborate more efficiently.</p>
            <div className="accuchat-tag-wrap">{tags.map(tag => <span className="accuchat-tag" key={tag}>{tag}</span>)}</div>
            <div className="accuchat-btn-row"><a href={playStoreLink} target="_blank" rel="noopener noreferrer" className="accuchat-btn-primary-custom">Download On Google Play</a></div>
          </div>
          <div className="accuchat-phone-slider-wrap">
            <div className="accuchat-phone-glow" />
            <div className="accuchat-phone-frame">
              <div className="accuchat-phone-notch" />
              <div className="accuchat-phone-inner">
                {screenshots.map((src, index) => (
                  <img key={src} className={`accuchat-phone-screen ${index === slide ? "is-active" : ""}`} src={src} alt={`AccuChat screen ${index + 1}`} onError={() => setImageUnavailable(true)} />
                ))}
              </div>
            </div>
            <div className="accuchat-slider-dots" aria-label="App screenshots">
              {screenshots.map((_, index) => <button key={index} type="button" className={slide === index ? "active" : ""} onClick={() => setSlide(index)} aria-label={`Show screenshot ${index + 1}`} aria-current={slide === index ? "true" : undefined} />)}
            </div>
            {imageUnavailable && <p className="accuchat-image-hint">Copy the eight original AccuChat screenshots into frontend/public/assets/img/accuchat/</p>}
          </div>
        </div>
      </section>

      <section className="accuchat-section accuchat-why-section">
        <div className="container accuchat-two-col">
          <div>
            <span className="accuchat-soft-badge">Why AccuChat</span>
            <h2 className="accuchat-why-title">One platform for <strong>chat, tasks, and collaboration</strong></h2>
            <p className="accuchat-why-text">AccuChat helps businesses manage communication and work tracking in one simple platform. Instead of switching between multiple apps, teams can chat, assign tasks, share updates, and stay aligned inside one organized workspace.</p>
            <p className="accuchat-why-text">This improves accountability, reduces missed messages, and gives teams a faster and more professional way to work together across departments, branches, or remote locations.</p>
          </div>
          <div className="accuchat-why-points">{whyPoints.map(point => <div className="accuchat-why-point" key={point.title}><h3>{point.title}</h3><p>{point.description}</p></div>)}</div>
        </div>
      </section>

      <section className="accuchat-section accuchat-problem-section">
        <div className="container">
          <div className="accuchat-section-heading"><span className="accuchat-soft-badge">Common Communication Problems</span><h2>Why scattered tools hurt <strong>productivity</strong></h2><p>When communication and tasks are spread across multiple tools, teams lose clarity, speed, and accountability.</p></div>
          <div className="accuchat-problems-grid">{problems.map((problem, index) => <article className="accuchat-problem-card" key={problem.title}><span className="accuchat-problem-number">{String(index + 1).padStart(2, "0")}</span><h3>{problem.title}</h3><p>{problem.description}</p></article>)}</div>
        </div>
      </section>

      <section className="accuchat-section">
        <div className="container accuchat-two-col">
          <div>
            <span className="accuchat-soft-badge">How AccuChat Solves This</span>
            <h2>A smarter way to manage <strong>communication and tasks</strong></h2>
            <p>AccuChat centralizes team chat, work assignment, and progress tracking so businesses can operate with more clarity and speed.</p>
            <CheckList items={["Structured one-to-one and group chats", "Create tasks directly from conversations", "Track status clearly", "Private company-wise workspaces", "Secure internal communication"]} />
          </div>
          <div className="accuchat-highlight-box"><h3>Core advantages</h3><CheckList items={advantages} /></div>
        </div>
        <div className="container accuchat-stats-grid">{workflow.map(([title, description]) => <div className="accuchat-mini-stat" key={title}><h3>{title}</h3><p>{description}</p></div>)}</div>
      </section>

      <section className="accuchat-section accuchat-muted">
        <div className="container">
          <div className="accuchat-section-heading"><span className="accuchat-soft-badge">Who Can Use AccuChat</span><h2>Built for <strong>modern business teams</strong></h2><p>AccuChat works well for companies that need structured internal communication and task visibility.</p></div>
          <div className="accuchat-industries-grid">{industries.map(item => <article className="accuchat-card" key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
        </div>
      </section>

      <section className="accuchat-section">
        <div className="container accuchat-two-col">
          <div><span className="accuchat-soft-badge">Benefits of AccuChat</span><h2>Better productivity with <strong>one organized app</strong></h2><CheckList items={benefits} /></div>
          <div className="accuchat-highlight-box"><h3>Why teams prefer it</h3><p>AccuChat reduces tool switching, keeps tasks visible, and stores communication in one searchable business workspace.</p></div>
        </div>
      </section>

      <section className="accuchat-section accuchat-muted">
        <div className="container">
          <div className="accuchat-section-heading"><span className="accuchat-soft-badge">Frequently Asked Questions</span><h2>Common questions about <strong>AccuChat</strong></h2></div>
          <div className="accuchat-faq">{faqs.map((faq, index) => <div className="accuchat-faq-item" key={faq.question}><h3><button type="button" aria-expanded={openFaq === index} aria-controls={`accuchat-answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{index + 1}. {faq.question}</span><span className="accuchat-faq-symbol">{openFaq === index ? "−" : "+"}</span></button></h3>{openFaq === index && <div className="accuchat-faq-answer" id={`accuchat-answer-${index}`}>{faq.answer}</div>}</div>)}</div>
        </div>
      </section>

      <section className="accuchat-cta-section"><div className="container"><Link to="/#EnquiryForm" className="accuchat-cta">Want to See Accutech ERP in Action? <strong>Book a Free Demo</strong></Link></div></section>
    </div>
  );
}
