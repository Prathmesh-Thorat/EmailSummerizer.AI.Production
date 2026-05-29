import React from 'react';
import './Navbar.css';
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    localStorage.removeItem("token");
    localStorage.removeItem("summaryRange");
    navigate("/SignUp");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-left">
          <span className="navbar-logo">SummarizeAI</span>
          <nav className="navbar-links">
            <Link to="/" className={`nav-link ${isActive('/Dashboard') ? 'active' : ''}`}>Dashboard</Link>
            <Link to="/TaskPage" className={`nav-link ${isActive('/TaskPage') ? 'active' : ''}`}>Tasks</Link>
            <Link to="/SummaryHistory" className={`nav-link ${isActive('/SummaryHistory') ? 'active' : ''}`}>Summaries</Link>
          </nav>
        </div>
        <button className="nav-btn" onClick={handleLogout}>Log Out</button>
      </div>
    </header>
  );
}

export default Navbar;