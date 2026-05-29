import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from '../Navbar/Navbar';
import Stats from '../Stats/Stats';
import DailyOverview from '../DailyOverview/DailyOverview';
import PriorityFocus from '../PriorityFocus/PriorityFocus';
import Footer from '../Footer/Footer';
import './Summaryid.css';
import { useParams } from "react-router-dom";
import.meta.env.VITE_API_URL

function Summaryid() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const[createdat,setcreatedat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/summary/${id}`,{ headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  }})
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        setData(data.summary);
        setcreatedat(data.created_at);
        setLoading(false);
        
      })
      .catch(err => {
        setError(err.message || "Unable to connect to the server.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="state-screen">
        <div className="loader-wrapper">
          <div className="loader-ring">
            <span></span><span></span><span></span>
          </div>
          <p className="loader-text">Fetching your summary<span className="dots"><span>.</span><span>.</span><span>.</span></span></p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-screen">
        <div className="error-card">
          <div className="error-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="error-title">Connection Failed</h2>
          <p className="error-message">{error}</p>
          <p className="error-hint">Make sure the server is running at <code>localhost:8000</code> and try again.</p>
          <button className="retry-btn" onClick={() => { setLoading(true); setError(null); }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.51 9a9 9 0 0114.36-3.36L23 10M1 14l5.13 4.36A9 9 0 0020.49 15"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Stats stats={data.stats} />
        <DailyOverview daily={data.overall_summary} createdat={createdat} />
        <PriorityFocus impemails={data.important_emails} />
      </main>
      <Footer />
    </div>
  );
}

export default Summaryid;