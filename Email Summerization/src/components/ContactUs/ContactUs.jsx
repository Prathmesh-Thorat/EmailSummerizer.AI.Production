import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./ContactUs.css";

const DEVELOPER_EMAIL = "developer@summarizeai.com";

export default function ContactUs() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(DEVELOPER_EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="contact-root">
      <Navbar />

      {/* Hero */}
      <div className="contact-hero">
        <div className="contact-hero-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          Contact
        </div>
        <h1 className="contact-hero-title">Get in Touch</h1>
        <p className="contact-hero-sub">
          Have a question, found a bug, or want to share feedback? Reach out directly — we'd love to hear from you.
        </p>
      </div>

      {/* Body */}
      <div className="contact-body">
        <button className="contact-back-btn" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back
        </button>

        {/* Developer card */}
        <div className="contact-dev-card">
          <div className="contact-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>

          <div className="contact-dev-info">
            <div className="contact-dev-role">Developer & Maintainer</div>
            <h2 className="contact-dev-name">SummarizeAI Team</h2>
            <p className="contact-dev-bio">
              Built SummarizeAI to make inbox management effortless using AI. Passionate about developer tooling, productivity, and clean UI. Always happy to hear feedback, bug reports, or feature ideas.
            </p>

            {/* Email row */}
            <div className="contact-email-row">
              <div className="contact-email-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <div className="contact-email-label">Email</div>
                <div className="contact-email-value">{DEVELOPER_EMAIL}</div>
              </div>
              <button
                className={`contact-copy-btn${copied ? " copied" : ""}`}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="contact-info-row">
          <div className="contact-info-card">
            <div className="contact-info-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <div className="contact-info-card-title">Response Time</div>
              <div className="contact-info-card-text">Usually within 1–2 business days</div>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <div className="contact-info-card-title">Bug Reports</div>
              <div className="contact-info-card-text">Include steps to reproduce and your browser</div>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div>
              <div className="contact-info-card-title">Feature Requests</div>
              <div className="contact-info-card-text">Ideas and suggestions are always welcome</div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="contact-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>
            For <strong>privacy or data deletion requests</strong>, please email <strong>privacy@summarizeai.com</strong>. For <strong>security vulnerabilities</strong>, please use <strong>security@summarizeai.com</strong> and we will respond within 24 hours.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}