import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-left">
          <span className="navbar-logo">SummarizeAI</span>
          <nav className="navbar-links">
            <a href="#" className="nav-link active">Features</a>
            <a href="#" className="nav-link">Pricing</a>
            <a href="#" className="nav-link">About</a>
          </nav>
        </div>
        <button className="nav-btn">Get Started</button>
      </div>
    </header>
  );
}

export default Navbar;