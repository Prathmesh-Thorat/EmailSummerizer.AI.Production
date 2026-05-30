import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const linksStructure = [
    {
      title: "Legal",
      links: [ { label: "Terms of Service", to: "/terms" },
        { label: "Privacy Policy", to: "/privacy" }]
    },
    {
      title: "Support",
      links: [{label : "Contact Us" , to: "/contact" }]
    }
  ];

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">SummarizeAI</span>
          <p className="footer-copy">
            © 2026 SummarizeAI. Synthesized precision for your inbox. Empowering productivity through intelligent automation.
          </p>
        </div>
         <div className="footer-links-grid">
          {linksStructure.map((group, idx) => (
            <div key={idx} className="footer-links-group">
              <span className="group-title">{group.title}</span>
              {group.links.map((link, lIdx) =>
                link.to.startsWith("/") ? (
                  <Link key={lIdx} to={link.to} className="footer-link">{link.label}</Link>
                ) : (
                  <a key={lIdx} href={link.to} className="footer-link">{link.label}</a>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;