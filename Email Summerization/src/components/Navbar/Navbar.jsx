import React from 'react';
import './Navbar.css';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
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
            <a href="" className="nav-link active">Features</a>
            <Link to="/TasksPage" className='nav-link'>Tasks</Link>
            <Link to="/SummaryHistory" className='nav-link'>Summaries</Link>
          </nav>
        </div>
        <button className="nav-btn"  onClick={() =>handleLogout()}>Log Out</button>
      </div>
    </header>
  );
}

export default Navbar;