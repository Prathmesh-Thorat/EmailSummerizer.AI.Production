import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./DataPolicy.css";

const SECTIONS = [
  {
    id: "overview",
    num: "01",
    title: "Overview",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    content: (
      <>
        <p>SummarizeAI ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and safeguard information when you use our email summarization service.</p>
        <p>We built SummarizeAI with a privacy-first mindset. Your email content is used exclusively to generate summaries for you and is never sold, shared with advertisers, or used to train AI models.</p>
        <div className="legal-highlight-box">
          If you have questions about this policy or your data, contact us at <strong>privacy@summarizeai.com</strong> at any time.
        </div>
      </>
    ),
  },
  {
    id: "data-collected",
    num: "02",
    title: "Data We Collect",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    content: (
      <>
        <p>We collect the minimum data necessary to provide the Service:</p>
        <table className="legal-data-table">
          <thead>
            <tr>
              <th>Data Type</th>
              <th>What We Collect</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Account Info</strong></td>
              <td>Gmail address</td>
              <td>Identify your account in our database</td>
            </tr>
            <tr>
              <td><strong>Email Content</strong></td>
              <td>Subject, body, sender, date</td>
              <td>Generate AI summaries (not stored permanently)</td>
            </tr>
            <tr>
              <td><strong>Summaries</strong></td>
              <td>AI-generated digest text</td>
              <td>Display your summary history (max 5 per user)</td>
            </tr>
            <tr>
              <td><strong>Tasks</strong></td>
              <td>AI-extracted action items</td>
              <td>Task management features</td>
            </tr>
            <tr>
              <td><strong>Auth Token</strong></td>
              <td>JWT stored in your browser</td>
              <td>Authenticate your session securely</td>
            </tr>
          </tbody>
        </table>
        <p>We do not collect payment information, location data, or any data unrelated to email summarization.</p>
      </>
    ),
  },
  {
    id: "gmail-access",
    num: "03",
    title: "How We Use Gmail Data",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    content: (
      <>
        <p>We connect to Gmail via Google OAuth 2.0 with read-only access. Here is exactly what happens to your email data:</p>
        <ul>
          <li><strong>Fetched in real-time</strong> — emails are retrieved when you request a summary</li>
          <li><strong>Processed by AI</strong> — content is sent to our AI provider (Groq) to generate a summary</li>
          <li><strong>Summary stored</strong> — only the AI output (not the raw emails) is saved to your account</li>
          <li><strong>Raw emails discarded</strong> — original email content is not persisted after summarization</li>
        </ul>
        <div className="legal-highlight-box">
          SummarizeAI's use of Gmail data complies with the Google API Services User Data Policy, including the Limited Use requirements.
        </div>
        <p>We never use Gmail data to serve advertisements, share it with third parties for their independent use, or allow humans to read your emails except in response to your explicit support request.</p>
      </>
    ),
  },
  {
    id: "ai-processing",
    num: "04",
    title: "AI Processing",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8h10M7 12h6"/>
      </svg>
    ),
    content: (
      <>
        <p>Email summarization is powered by Groq's large language model API. When you generate a summary:</p>
        <ul>
          <li>Your email text is transmitted to Groq's API over an encrypted HTTPS connection</li>
          <li>Groq processes the text and returns a summary — they do not store your data beyond their standard API processing terms</li>
          <li>The generated summary is saved to our database; the raw email text is not</li>
        </ul>
        <p>We do not use your email content to fine-tune, retrain, or improve any AI model. Your data is not used to benefit other users in any way.</p>
        <p>For Groq's data practices, please review the <strong>Groq Privacy Policy</strong> at groq.com.</p>
      </>
    ),
  },
  {
    id: "data-storage",
    num: "05",
    title: "Data Storage & Retention",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    content: (
      <>
        <p>We store only what is necessary, for only as long as needed:</p>
        <ul>
          <li><strong>Summaries</strong> — a maximum of 5 summaries are stored per user; the oldest is automatically deleted when this limit is reached</li>
          <li><strong>Tasks</strong> — completed tasks are automatically deleted 2 days after completion</li>
          <li><strong>Account record</strong> — your email address is retained while your account is active</li>
          <li><strong>Auth tokens</strong> — JWTs expire after 7 days and are stored only in your browser's local storage</li>
        </ul>
        <p>Our database is hosted on a secure cloud platform with encryption at rest and in transit. Access is restricted to authorized personnel only.</p>
      </>
    ),
  },
  {
    id: "your-rights",
    num: "06",
    title: "Your Rights & Controls",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    content: (
      <>
        <p>You have full control over your data. At any time you may:</p>
        <ul>
          <li><strong>Revoke access</strong> — remove SummarizeAI's Gmail access from Google Account → Security → Third-party apps</li>
          <li><strong>Delete your data</strong> — email <strong>privacy@summarizeai.com</strong> to request complete account deletion</li>
          <li><strong>Export your summaries</strong> — contact us to request a copy of your stored summaries</li>
          <li><strong>Correct information</strong> — request correction of any inaccurate data we hold</li>
        </ul>
        <p>If you are located in the European Economic Area (EEA) or UK, you may also have additional rights under GDPR, including the right to lodge a complaint with your local supervisory authority.</p>
      </>
    ),
  },
  {
    id: "cookies",
    num: "07",
    title: "Cookies & Local Storage",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
      </svg>
    ),
    content: (
      <>
        <p>SummarizeAI does not use tracking cookies. We use <strong>browser local storage</strong> solely to store your authentication token (JWT) between sessions.</p>
        <ul>
          <li>No advertising cookies or pixels are used</li>
          <li>No cross-site tracking is performed</li>
          <li>No analytics cookies are set (server-side logging only)</li>
        </ul>
        <p>You can clear your local storage at any time via your browser settings, which will log you out of SummarizeAI.</p>
      </>
    ),
  },
  {
    id: "security",
    num: "08",
    title: "Security",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    ),
    content: (
      <>
        <p>We take security seriously and implement industry-standard measures to protect your data:</p>
        <ul>
          <li>All data in transit is encrypted using TLS 1.2+</li>
          <li>Database data is encrypted at rest</li>
          <li>Authentication uses signed JWTs with short expiry periods</li>
          <li>Gmail credentials are stored inside your JWT on your device — not on our servers</li>
          <li>Our API enforces strict CORS policies allowing only our frontend origin</li>
        </ul>
        <p>Despite our efforts, no system is perfectly secure. If you discover a security vulnerability, please disclose it responsibly by emailing <strong>security@summarizeai.com</strong>.</p>
      </>
    ),
  },
  {
    id: "changes",
    num: "09",
    title: "Changes to This Policy",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    content: (
      <>
        <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. When we make changes:</p>
        <ul>
          <li>The "Effective Date" at the top of this page will be updated</li>
          <li>For material changes, we will notify you via email (to your Gmail address on file)</li>
          <li>Continued use of the Service after changes constitutes acceptance of the updated policy</li>
        </ul>
        <p>We encourage you to review this policy periodically.</p>
      </>
    ),
  },
  {
    id: "contact",
    num: "10",
    title: "Contact Us",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    content: (
      <>
        <p>For any privacy-related questions, requests, or concerns, please reach out to us:</p>
        <div className="legal-contact-grid">
          <div className="legal-contact-card">
            <div className="legal-contact-card-label">Privacy Requests</div>
            <div className="legal-contact-card-value">privacy@summarizeai.com</div>
          </div>
          <div className="legal-contact-card">
            <div className="legal-contact-card-label">Security Issues</div>
            <div className="legal-contact-card-value">security@summarizeai.com</div>
          </div>
          <div className="legal-contact-card">
            <div className="legal-contact-card-label">Response Time</div>
            <div className="legal-contact-card-value">Within 2 business days</div>
          </div>
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="legal-root privacy-accent">
      <Navbar />

      {/* Hero */}
      <div className="legal-hero privacy-hero" style={{ marginTop: "4rem" }}>
        <div className="legal-hero-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          Privacy
        </div>
        <h1 className="legal-hero-title">Privacy Policy</h1>
        <br />
        <p className="legal-hero-sub">
          Your email data belongs to you. Here's a transparent account of what we collect, why, and how we protect it.
        </p>
        <div className="legal-meta-row">
          <span className="legal-meta-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Effective: May 30, 2026
          </span>
          <span className="legal-meta-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            ~6 min read
          </span>
          <span className="legal-meta-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Transparent
          </span>
        </div>
      </div>

      {/* Layout */}
      <div className="legal-layout">
        {/* TOC */}
        <aside className="legal-toc">
          <div className="legal-toc-inner">
            <div className="legal-toc-title">Contents</div>
            <ul className="legal-toc-list">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.num}. {s.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <main className="legal-content">
          <button className="legal-back-btn" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>

          {SECTIONS.map((s) => (
            <section className="legal-section" id={s.id} key={s.id}>
              <div className="legal-section-header">
                <div className="legal-section-icon">{s.icon}</div>
                <div>
                  <div className="legal-section-num">Section {s.num}</div>
                  <h2 className="legal-section-title">{s.title}</h2>
                </div>
              </div>
              {s.content}
            </section>
          ))}
        </main>
      </div>

      <Footer />
    </div>
  );
}