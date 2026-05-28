import React, { useState } from 'react';
import { useEffect } from "react";
import './Dashboard.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer'
import { useNavigate } from "react-router-dom";
import.meta.env.VITE_API_URL


const Dashboard = () => {
  
    const navigate = useNavigate();

     useEffect(() => {

    fetch(`${import.meta.env.VITE_API_URL}/me`, {
      credentials: "include"
    })
      .then((res) => {

        if (res.status === 401) {
          navigate("/SignUp");
        }

      })
      .catch(() => {
        navigate("/SignUp");
      });

  }, []);

  // 1. Component States
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeRange, setActiveRange] = useState('today'); // Added this since it's used below

  // 2. Component Functions
  const generateSummary = async (range) => {
    try {
      
      setLoading(range);
      setActiveRange(range); // Update active tab UI

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/generate-summary`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            range: range
          }),
        }
        
      );
      
      navigate("/Summary");

      const data = await response.json();
      console.log(data);
      setSummary(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. The Return Statement (Now safely inside the function)
  return (
    <div>
      <Navbar/>
    <main className="main-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Summarize Your Emails</h1>
        <p className="hero-subtitle">Select Range</p>
        
        <div className="toggle-group">
          <button 
            className={`toggle-btn ${activeRange === 'today' ? 'active' : ''}`}
            onClick={() => generateSummary("today")}
          >
              {loading === "today"
    ? "Generating..."
    : "Today"}
          </button>
          <button 
            className={`toggle-btn ${activeRange === 'week' ? 'active' : ''}`}
            onClick={() => generateSummary("week")}
          >
            {loading === "week"
    ? "Generating..."
    : "Week"}
          </button>
        </div>
      </section>

      {/* Action Cards Grid */}
      <div className="cards-grid">

  {/* Go to Tasks Card */}
  <div
    className="action-card group"
    onClick={() => navigate("/Taskpage")}
  >
    <div className="card-top-accent"></div>

    <div className="card-inner">
      <div className="card-header">
        <div className="icon-wrapper primary-bg">
          <span className="material-symbols-outlined filled-icon primary-text">
            assignment_turned_in
          </span>
        </div>

        <span className="badge primary-badge">
          3 High Priority
        </span>
      </div>

      <h2 className="card-title">Go to Tasks</h2>

      <p className="card-description">
        Review AI-extracted action items from your morning newsletters and team updates.
      </p>
    </div>

    <div className="card-footer primary-footer">
      Process Now{" "}
      <span className="material-symbols-outlined icon-arrow">
        arrow_forward
      </span>
    </div>

    <div className="card-glow"></div>
  </div>

  {/* Summary History Card */}
  <div
    className="action-card group"
    onClick={() => navigate("/SummaryHistory")}
  >
    <div className="card-top-accent"></div>

    <div className="card-inner">
      <div className="card-header">
        <div className="icon-wrapper secondary-bg">
          <span className="material-symbols-outlined secondary-text">
            history
          </span>
        </div>

        <span className="badge secondary-badge">
          Archive
        </span>
      </div>

      <h2 className="card-title">Summary History</h2>

      <p className="card-description">
        Browse your intelligent digest archive. Track trends and revisit past insights with ease.
      </p>
    </div>

    <div className="card-footer secondary-footer hover-primary-footer">
      View Archive{" "}
      <span className="material-symbols-outlined icon-arrow">
        chevron_right
      </span>
    </div>
  </div>

</div>
    </main>
    <Footer/>
    </div>
  );
};

export default Dashboard;