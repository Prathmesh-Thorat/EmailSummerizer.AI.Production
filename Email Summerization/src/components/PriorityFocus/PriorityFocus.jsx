import React from 'react';
import EmailCard from '../EmailCard/EmailCard';
import './PriorityFocus.css';
import { useNavigate } from "react-router-dom";

function PriorityFocus({impemails,all_emails}) {
  const priorityEmails = [{impemails}
  ];
  const navigate = useNavigate();  

  console.log({priorityEmails})

  return (
    <section className="priority-section">
      <div className="priority-header">
        <div>
          <h2 className="priority-title">Priority Focus</h2>
          <p className="priority-subtitle">High-impact communications requiring your decision.</p>
        </div>
        <button className="view-all-btn" onClick={() => navigate("/EmailsPage", { state: { emails : all_emails } })}>
  View All Emails
          <span className="material-symbols-outlined arrow-icon">arrow_forward</span>
        </button>
      </div>
      <div className="email-cards-container">
        {impemails.map((email, idx) => (
          <EmailCard 
            key={idx}
            title={email.one_line_summary}
            description={email.detailed_summary}
            priority={email.priority}
            id={email.message_id}
          />
        ))}
      </div>
    </section>
  );
}

export default PriorityFocus;