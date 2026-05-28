import { useState, useEffect } from "react";
import "./SummaryHistory.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import.meta.env.VITE_API_URL

// ── Sub-components ──────────────────────────────────────

function RangeBadge({ range }) {
  const cls = range === "today" ? "today" : "week";
  const label = range === "today" ? "Today" : "Week";
  return (
    <span className={`tasks-badge badge--${cls}`}>
      <span className={`tasks-dot dot--${cls}`} />
      {label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <div className="tasks-row tasks-row--skeleton">
      <div className="skeleton-cell"><div className="skeleton-bar short" /></div>
      <div className="skeleton-cell"><div className="skeleton-bar short" /></div>
      <div className="skeleton-cell"><div className="skeleton-bar long" /></div>
      <div className="skeleton-cell"><div className="skeleton-bar" /></div>
      <div className="skeleton-cell"><div className="skeleton-bar short" /></div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function RetryIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M1 4v6h6" />
      <path d="M23 20v-6h-6" />
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ── Helpers ─────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  
  return d.toLocaleString("en-IN", {
    timeZone:"Asia/Kolkata",
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

// ── Main Component ───────────────────────────────────────

export default function SummaryHistory() {
   const navigate = useNavigate();
  const [allSummaries, setAllSummaries] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch ──────────────────────────────────────────────
  async function fetchSummaryHistory() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/summary/history`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      const sorted = [...data].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setAllSummaries(sorted);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSummaryHistory(); }, []);

  // ── goto_summary ───────────────────────────────────────
  function goto_summary(id) {
    // intentionally left empty
    navigate(`/summary/${id}`)

  }
  

  // ── Filtered data ──────────────────────────────────────
  const filtered =
    activeFilter === "all"
      ? allSummaries
      : allSummaries.filter((s) => s.range === activeFilter);

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="summary-history-page">
      <Navbar/>
    <main className="tasks-main">

      {/* Header */}
      <div className="tasks-header">
        <div>
          <h1 className="tasks-headline">Summary History</h1>
          <p className="tasks-subtext">Browse and revisit your past generated summaries.</p>
        </div>

        <div className="tasks-header-actions">
          <div className="tasks-filter-group">
            {["all", "week", "today"].map((f) => (
              <button
                key={f}
                className={`tasks-filter-btn${activeFilter === f ? " active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state */}
      {!loading && error && (
        <div className="tasks-error-state">
          <div className="tasks-error-icon"><AlertIcon /></div>
          <p className="tasks-error-title">Failed to load summaries</p>
          <p className="tasks-error-msg">{error}</p>
          <button className="tasks-btn-retry" onClick={fetchSummaryHistory}>
            <RetryIcon /> Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!error && (
        <>
          <div className="tasks-table-wrap">
            <div className="tasks-table-head">
              <div>#</div>
              <div>Range</div>
              <div>Overview</div>
              <div>Created At</div>
              <div />
            </div>

            <div className="tasks-table-body">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
                : filtered.length === 0
                ? (
                  <div className="tasks-empty">
                    No summaries found{activeFilter !== "all" ? " for this filter" : ""}.
                  </div>
                )
                : filtered.map((summary, idx) => (
                  <div className="tasks-row" key={summary.id}>
                    <div className="tasks-row__accent" />
                    <div className="tasks-sn">{idx + 1}</div>
                    <div><RangeBadge range={summary.range} /></div>
                    <div className="tasks-summary-cell">
                      <span className="tasks-summary-text">
                        {summary.overall_summary || "—"}
                      </span>
                    </div>
                    <div className="tasks-date">{formatDate(summary.created_at)}</div>
                    <div>
                      <button
                        className="tasks-btn-goto"
                        onClick={() => goto_summary(summary.id)}
                      >
                        <ArrowIcon /> Go to Summary
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {!loading && filtered.length > 0 && (
            <p className="tasks-count">
              Showing {filtered.length} summar{filtered.length === 1 ? "y" : "ies"}
            </p>
          )}
        </>
      )}
    </main>
    <Footer/>
    </div>
  );
}