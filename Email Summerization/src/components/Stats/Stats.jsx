import React from 'react';
import './Stats.css';

function Stats({stats}) {
  const statsData = [
    { icon: 'mail', label: 'Total Emails', value: stats.total_emails, type: 'primary' },
    { icon: 'task_alt', label: 'Needs Approval', value: stats.approvals, type: 'error' },
    { icon: 'payments', label: 'Finance', value: stats.finance_emails, type: 'tertiary' },
    { icon: 'schedule', label: 'Active Follow up', value: stats.active_follow_ups, type: 'secondary' }
  ];

  return (
    <section className="stats-section">
      <div className="stats-grid">
        {statsData.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <span className={`material-symbols-outlined icon-${stat.type}`}>
              {stat.icon}
            </span>
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;