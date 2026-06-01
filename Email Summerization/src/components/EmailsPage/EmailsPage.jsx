import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './EmailsPage.css';

const CATEGORIES = ['All', 'Finance', 'Legal', 'HR', 'Support', 'Meeting', 'Personal', 'Complaints', 'Other'];

const CATEGORY_COLORS = {
  Finance:    'cat-finance',
  Legal:      'cat-legal',
  HR:         'cat-hr',
  Support:    'cat-support',
  Meeting:    'cat-meeting',
  Personal:   'cat-personal',
  Complaints: 'cat-complaints',
  Other:      'cat-other',
};

function normalizeCategory(raw) {
  if (!raw) return 'Other';
  const lower = raw.toLowerCase().trim();
  const map = {
    finance:           'Finance',
    financial:         'Finance',
    legal:             'Legal',
    law:               'Legal',
    hr:                'HR',
    'human resources': 'HR',
    h_r:               'HR',
    support:           'Support',
    meeting:           'Meeting',
    meetings:          'Meeting',
    personal:          'Personal',
    complaints:        'Complaints',
    complaint:         'Complaints',
    other:             'Other',
  };
  return map[lower] ?? 'Other';
}

function EmailCard({ email }) {
  const normalized = normalizeCategory(email.category);
  const catClass = CATEGORY_COLORS[normalized] || 'cat-other';

  const handleOpen = () => {
    if (email.message_id) {
      window.open(
        `https://mail.google.com/mail/u/0/#inbox/${email.message_id}`,
        '_blank',
        'noreferrer'
      );
    }
  };

  const displaySender = email.sender?.replace(/<[^>]+>/g, '').trim() || email.sender;

  return (
    <div className="email-card">
      <div className="email-card__accent" />
      <div className="email-card__body">
        <div className="email-card__meta">
          <span className="email-card__sender">{displaySender}</span>
          <span className={`email-card__category ${catClass}`}>{normalized}</span>
        </div>
        <h3 className="email-card__subject">{email.subject}</h3>
        <p className="email-card__summary">
          <span className="email-card__ai-label">AI</span>
          {email.one_line_summary}
        </p>
      </div>
      <div className="email-card__action">
        <button
          className="email-card__btn"
          onClick={handleOpen}
          disabled={!email.message_id}
          title={!email.message_id ? 'Link unavailable' : 'Open in Gmail'}
        >
          Go to Mail
          <span className="email-card__arrow">→</span>
        </button>
      </div>
    </div>
  );
}

export default function EmailsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const emails = (state?.emails || []).map(e => ({
    ...e,
    category: normalizeCategory(e.category),
  }));

  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? emails
    : emails.filter(e => e.category === activeCategory);

  const counts = emails.reduce((acc, e) => {
    const cat = e.category;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  if (!state?.emails) {
    return (
      <div>
        <Navbar />
        <div className="emails-empty">
          <p className="emails-empty__text">No email data found.</p>
          <button className="emails-empty__btn" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="emails-page">

        <div className="emails-header">
          <h1 className="emails-header__title">All Emails</h1>
          <p className="emails-header__subtitle">
            {emails.length} emails analysed · {filtered.length} shown
          </p>
        </div>

        <div className="emails-filters">
          {CATEGORIES.map(cat => {
            const count = cat === 'All' ? emails.length : (counts[cat] || 0);
            return (
              <button
                key={cat}
                className={`filter-pill ${activeCategory === cat ? 'filter-pill--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                {count > 0 && <span className="filter-pill__count">{count}</span>}
              </button>
            );
          })}
        </div>

        <section className="emails-list">
          {filtered.length === 0 ? (
            <div className="emails-list__empty">No emails in this category.</div>
          ) : (
            filtered.map((email, i) => (
              <EmailCard key={email.message_id || i} email={email} />
            ))
          )}
        </section>

      </main>
      <Footer />
    </div>
  );
}