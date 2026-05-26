import React, { useState } from 'react';
import './Dashboard.css';

const MainContent = () => {
  const [activeRange, setActiveRange] = useState('today');

  return (
    <main className="main-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Summarize Your Emails</h1>
        <p className="hero-subtitle">Select Range</p>
        
        <div className="toggle-group">
          <button 
            className={`toggle-btn ${activeRange === 'today' ? 'active' : ''}`}
            onClick={() => setActiveRange('today')}
          >
            Today
          </button>
          <button 
            className={`toggle-btn ${activeRange === 'week' ? 'active' : ''}`}
            onClick={() => setActiveRange('week')}
          >
            Last Week
          </button>
        </div>
      </section>

      {/* Action Cards Grid */}
      <div className="cards-grid">
        
        {/* Go to Tasks Card */}
        <div className="action-card group">
          <div className="card-top-accent"></div>
          <div className="card-inner">
            <div className="card-header">
              <div className="icon-wrapper primary-bg">
                <span className="material-symbols-outlined filled-icon primary-text">
                  assignment_turned_in
                </span>
              </div>
              <span className="badge primary-badge">3 High Priority</span>
            </div>
            
            <h2 className="card-title">Go to Tasks</h2>
            <p className="card-description">
              Review AI-extracted action items from your morning newsletters and team updates. 
            </p>
          </div>
          
          <div className="card-footer primary-footer">
            Process Now <span className="material-symbols-outlined icon-arrow">arrow_forward</span>
          </div>
          <div className="card-glow"></div>
        </div>

        {/* Summary History Card */}
        <div className="action-card group">
          <div className="card-top-accent"></div>
          <div className="card-inner">
            <div className="card-header">
              <div className="icon-wrapper secondary-bg">
                <span className="material-symbols-outlined secondary-text">
                  history
                </span>
              </div>
              <span className="badge secondary-badge">Archive</span>
            </div>
            
            <h2 className="card-title">Summary History</h2>
            <p className="card-description">
              Browse your intelligent digest archive. Track trends and revisit past insights with ease.
            </p>
          </div>
          
          <div className="card-footer secondary-footer hover-primary-footer">
            View Archive <span className="material-symbols-outlined icon-arrow">chevron_right</span>
          </div>
        </div>

        {/* Decorative Visual Section */}
        <div className="decorative-banner">
          <div className="banner-overlay">
            <span className="material-symbols-outlined large-icon">analytics</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;