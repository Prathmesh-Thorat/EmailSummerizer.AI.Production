import React, { useState } from 'react';
import EmailCard from '../EmailCard/EmailCard';
import './PriorityFocus.css';
import { useNavigate } from "react-router-dom";

const PRIORITY_OPTIONS = ["All", "High", "Medium", "Low"];

function PriorityFocus({ impemails, all_emails }) {
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const visible = filter === "All"
    ? impemails
    : impemails.filter((e) => e.priority?.toLowerCase() === filter.toLowerCase());

  return (
    <section className="priority-section">
      <div className="priority-header">
        <div>
          <h2 className="priority-title">Priority Focus</h2>
          <p className="priority-subtitle">High-impact communications requiring your Attention.</p>
        </div>
        <button
          className="view-all-btn"
          onClick={() => navigate("/EmailsPage", { state: { emails: all_emails } })}
        >
          View All Emails
          <span className="material-symbols-outlined arrow-icon">arrow_forward</span>
        </button>
      </div>

      {/* Filter pills — same style as Taskpage */}
      <div className="priority-filter-group">
        {PRIORITY_OPTIONS.map((p) => (
          <button
            key={p}
            className={`priority-filter-btn${filter === p ? " active" : ""}`}
            onClick={() => setFilter(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="email-cards-container">
        {visible.length === 0 ? (
          <p className="priority-empty">No {filter.toLowerCase()} priority emails.</p>
        ) : (
          visible.map((email, idx) => (
            <EmailCard
              key={idx}
              title={email.one_line_summary}
              description={email.detailed_summary}
              priority={email.priority}
              id={email.message_id}
              sender={email.sender}
            />
          ))
        )}
      </div>

      <p className="priority-count">
        Showing {visible.length} of {impemails.length} email{impemails.length !== 1 ? "s" : ""}
      </p>
    </section>
  );
}

export default PriorityFocus;