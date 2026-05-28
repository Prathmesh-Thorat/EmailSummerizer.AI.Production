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
        <button className="nav-btn"  onClick={async () => {

            await fetch(
              "http://localhost:8000/logout",
              {
                credentials: "include"
              }
            );

            window.location.reload();
          }}>Log Out</button>
      </div>
    </header>
  );
}

export default Navbar;