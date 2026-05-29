import React from 'react';
import './Navbar.css';

function Navbar() {

  const handleLogout = async () => {
  await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  localStorage.removeItem("token");
  localStorage.removeItem("summaryRange");
  navigate("/SignUp");
};
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
        <button className="nav-btn"  onClick={handleLogout()}>Log Out</button>
      </div>
    </header>
  );
}

export default Navbar;