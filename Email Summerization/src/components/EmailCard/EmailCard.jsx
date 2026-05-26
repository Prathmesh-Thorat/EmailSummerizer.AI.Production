import React from 'react';
import './EmailCard.css';

function EmailCard({ title, description,priority }) {
  return (
    <article className="email-card">
      <div className="email-card-body">
        <div className="email-card-meta">
          <h3 className="email-card-title">{title}</h3>
          <span className={`priority-${priority}`}>{priority.toUpperCase()}</span>
        </div>
        <p className="email-card-desc">{description}</p>
      </div>
      <div className="email-card-action">
        <button className="reply-btn">Reply</button>
      </div>
    </article>
  );
}

export default EmailCard;