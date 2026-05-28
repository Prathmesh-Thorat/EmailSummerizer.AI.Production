import React, {useState} from 'react';
import './DailyOverview.css';

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  
  return d.toLocaleString("en-IN", {
    timeZone:"Asia/Kolkata",
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}


function DailyOverview({daily, createdat}) {
  
  const [loading, setLoading] = useState(false);
  const regenerateSummary = async () => {

  try {
    setLoading(true)
    await fetch(
      "http://localhost:8000/regenerate-summary",
      {
        method: "POST",
        credentials: "include"
      }
    );

    window.location.reload();

  } catch (err) {

    console.log(err);

  }

  finally{
    setLoading(false)
  }
};

  return (
    <section className="overview-section">
      <div className="overview-card">
        <div className="overview-header">
          <div>
            <h2 className="overview-title">Daily Intelligence Overview</h2>
            <p className="overview-date">{formatDate(createdat)}</p>
          </div>
          <button className="regen-btn" onClick={regenerateSummary}>
  <i className="ti ti-refresh" aria-hidden="true" />
  {loading ? "Generating" : "Regenerate"}
</button>
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