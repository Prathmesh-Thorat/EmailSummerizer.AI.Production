import React from 'react';
import './Footer.css';

function Footer() {
  const linksStructure = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Integrations"]
    },
    {
      title: "Legal",
      links: ["Terms of Service", "Privacy Policy", "Security"]
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers"]
    },
    {
      title: "Support",
      links: ["Contact Us", "Help Center", "API Docs"]
    }
  ];

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">SummarizeAI</span>
          <p className="footer-copy">
            © 2024 SummarizeAI. Synthesized precision for your inbox. Empowering productivity through intelligent automation.
          </p>
        </div>
        <div className="footer-links-grid">
          {linksStructure.map((group, idx) => (
            <div key={idx} className="footer-links-group">
              <span className="group-title">{group.title}</span>
              {group.links.map((link, lIdx) => (
                <a key={lIdx} href="#" className="footer-link">{link}</a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;