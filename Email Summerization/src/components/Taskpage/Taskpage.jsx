import { useState, useCallback } from "react";
import "./Taskpage.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const PRIORITY_OPTIONS = ["All", "High", "Medium", "Low"];

const STATUS_CONFIG = {
  pending:     { label: "Pending",     dot: "dot--muted",  badge: "badge--muted" },
  in_progress: { label: "In Progress", dot: "dot--active", badge: "badge--active" },
  completed:   { label: "Completed",   dot: "dot--done",   badge: "badge--done" },
};

const PRIORITY_CONFIG = {
  high:   { label: "High",   cls: "priority--high" },
  medium: { label: "Medium", cls: "priority--medium" },
  low:    { label: "Low",    cls: "priority--low" },
};

function normalizeTask(raw, index) {
  return {
    id:        raw.id ?? index,
    title:     raw.title ?? raw.name ?? "Untitled Task",
    project:   raw.project ?? raw.category ?? "",
    priority:  (raw.priority ?? "medium").toLowerCase(),
    status:    (raw.status ?? "pending").toLowerCase().replace(" ", "_"),
    createdAt: raw.created_at ?? raw.createdAt ?? "",
    updatedAt: raw.updated_at ?? raw.updatedAt ?? "",
  };
}

export default function TasksPage() {
  const [tasks, setTasks]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [filterPriority, setFilter] = useState("All");
  const [completed, setCompleted]   = useState(new Set());

  const fetchTasks = useCallback(() => {
    setLoading(true);
    setError(null);

    fetch("http://localhost:8000/tasks", {credentials : "include"})
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.tasks ?? data.results ?? [];
        setTasks(list.map(normalizeTask));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unable to reach the server.");
        setTasks([]);
        setLoading(false);
      });
  }, []);

  // Fetch on mount
  useState(() => { fetchTasks(); }, []);

 const toggleComplete = async (id, e) => {

  e.stopPropagation();

  try {

    const response = await fetch(
      `http://localhost:8000/tasks/${id}/complete`,
      {
        method: "PUT",
        credentials: "include"
      }
    );

    const data = await response.json();

    console.log(data);

    fetchTasks();

    // UPDATE UI
    setCompleted((prev) => {

      const next = new Set(prev);

      next.has(id)
        ? next.delete(id)
        : next.add(id);

      return next;
    });

  } catch (err) {

    console.log(err);

  }
};

  const visible = filterPriority === "All"
    ? tasks
    : tasks.filter((t) => t.priority === filterPriority.toLowerCase());


  const formatDate = (dateString) => {
  if (!dateString) return 'N/A'; // Handle empty or null dates safely
  
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

  return (
    <div>
        <Navbar/>
    <main className="tasks-main">
      <div className="tasks-header">
        <div>
          <h1 className="tasks-headline">Your Tasks</h1>
          <p className="tasks-subtext">Manage and track your AI-powered summarization workflows.</p>
        </div>

        <div className="tasks-header-actions">
          <div className="tasks-filter-group">
            {PRIORITY_OPTIONS.map((p) => (
              <button
                key={p}
                className={`tasks-filter-btn${filterPriority === p ? " active" : ""}`}
                onClick={() => setFilter(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <div className="tasks-error-state">
          <div className="tasks-error-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
          </div>
          <h3 className="tasks-error-title">Failed to load tasks</h3>
          <p className="tasks-error-msg">{error}</p>
          <button className="tasks-btn-retry" onClick={fetchTasks}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="tasks-table-wrap">
            <div className="tasks-table-head">
              <div className="col-sn">#</div>
              <div className="col-title">Title</div>
              <div className="col-priority">Priority</div>
              <div className="col-status">Status</div>
              <div className="col-date">Created At</div>
              <div className="col-date">Updated At</div>
              <div className="col-action"></div>
            </div>

            <div className="tasks-table-body">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="tasks-row tasks-row--skeleton">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <div key={j} className="skeleton-cell"><div className="skeleton-bar" /></div>
                    ))}
                  </div>
                ))
              ) : visible.length === 0 ? (
                <div className="tasks-empty">No tasks found.</div>
              ) : (
                visible.map((task, index) => {
                  const isDone   = completed.has(task.id) || task.status === "completed";
                  const status   = STATUS_CONFIG[task.status]     ?? STATUS_CONFIG.pending;
                  const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;

                  return (
                    <div key={task.id} className={`tasks-row${isDone ? " tasks-row--done" : ""}`}>
                      <div className="tasks-row__accent" aria-hidden="true" />

                      <div className="col-sn tasks-sn">{index + 1}</div>

                      <div className="col-title tasks-title-cell">
                        <span className="tasks-title">{task.title}</span>
                        {task.project && <span className="tasks-project">{task.project}</span>}
                      </div>

                      <div className="col-priority">
                        <span className={`tasks-priority ${priority.cls}`}>{priority.label}</span>
                      </div>

                      <div className="col-status">
                        <span className={`tasks-badge ${status.badge}`}>
                          <span className={`tasks-dot ${status.dot}`} />
                          {status.label}
                        </span>
                      </div>

                      <div className="col-date tasks-date">{formatDate( task.createdAt)}</div>
                      <div className="col-date tasks-date">{formatDate(task.updatedAt)}</div>

                      <div className="col-action">
                        <button
                          className={`tasks-tick${isDone ? " tasks-tick--done" : ""}`}
                          onClick={(e) => toggleComplete(task.id, e)}
                          title={isDone ? "Mark incomplete" : "Mark complete"}
                          aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {!loading && (
            <p className="tasks-count">
              Showing {visible.length} of {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </p>
          )}
        </>
      )}
    </main>
      <Footer/>
    </div>
  );
}