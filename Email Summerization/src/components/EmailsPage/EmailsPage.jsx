import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './EmailsPage.css';

const CATEGORIES = ['All', 'Finance', 'Legal', 'HR', 'Support', 'Meeting', 'Personal', 'Complaints', 'Other'];

const CATEGORY_STYLES = {
  Finance:    { background: '#fef3c7', color: '#92400e' },
  Legal:      { background: '#fce7f3', color: '#9d174d' },
  HR:         { background: '#d1fae5', color: '#065f46' },
  Support:    { background: '#dbeafe', color: '#1e40af' },
  Meeting:    { background: '#ede9fe', color: '#5b21b6' },
  Personal:   { background: '#ffedd5', color: '#9a3412' },
  Complaints: { background: '#fee2e2', color: '#b91c1c' },
  Other:      { background: '#f1f5f9', color: '#475569' },
};

const NORMALIZE_MAP = {
  finance:           'Finance',
  financial:         'Finance',
  legal:             'Legal',
  law:               'Legal',
  hr:                'HR',
  'human resources': 'HR',
  support:           'Support',
  meeting:           'Meeting',
  meetings:          'Meeting',
  personal:          'Personal',
  complaints:        'Complaints',
  complaint:         'Complaints',
  other:             'Other',
};

function normalizeCategory(raw) {
  if (!raw) return 'Other';
  return NORMALIZE_MAP[raw.toLowerCase().trim()] ?? 'Other';
}

function buildStableKey(email, index) {
  return [
    email.message_id,
    email.subject,
    email.sender,
    index,
  ]
    .filter(Boolean)
    .join('::');
}

function EmailCard({ email }) {
  const badgeStyle = CATEGORY_STYLES[email.category] ?? CATEGORY_STYLES.Other;

  const handleOpen = () => {
    if (email.message_id) {
      window.open(
        `https://mail.google.com/mail/u/0/#inbox/${email.message_id}`,
        '_blank',
        'noreferrer'
      );
    }
  };

  const displaySender = email.sender?.replace(/<[^>]+>/g, '').trim() || '—';

  return (
    <div className="email-card">
      <div className="email-card__accent" />
      <div className="email-card__body">
        <div className="email-card__meta">
          <span className="email-card__sender">{displaySender}</span>
          <span className="email-card__category" style={badgeStyle}>
            {email.category}
          </span>
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
  const [activeCategory, setActiveCategory] = useState('All');

  const emails = useMemo(() =>
    (state?.emails || []).map((e, i) => ({
      ...e,
      category: normalizeCategory(e.category),
      _stableKey: buildStableKey(e, i),
    })),
    [state?.emails]
  );

  const filtered = useMemo(() =>
    activeCategory === 'All'
      ? emails
      : emails.filter(e => e.category === activeCategory),
    [emails, activeCategory]
  );

  const counts = useMemo(() =>
    emails.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1;
      return acc;
    }, {}),
    [emails]
  );

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
            filtered.map(email => (
              <EmailCard key={email._stableKey} email={email} />
            ))
          )}
        </section>

      </main>
      <Footer />
    </div>
  );
}