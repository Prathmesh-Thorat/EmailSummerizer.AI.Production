import React from 'react';
import './DailyOverview.css';

function DailyOverview({daily}) {
  return (
    <section className="overview-section">
      <div className="overview-card">
        <div className="overview-header">
          <div>
            <h2 className="overview-title">Daily Intelligence Overview</h2>
            <p className="overview-date">Oct 24, 2024 • Synthesis complete</p>
          </div>
          <div className="overview-icon-container">
            <span className="material-symbols-outlined overview-icon">insights</span>
          </div>
        </div>
        <div className="overview-content">
          <p>
            {daily}
          </p>
        </div>
      </div>
    </section>
  );
}

export default DailyOverview;