import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";

function App() {

  const { user, loading } = useAuth();

  const [summary, setSummary] = useState(null);

  useEffect(() => {

    if (!user) return;

    fetch("http://localhost:8000/summary", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        setSummary(data);
      });

  }, [user]);

  // Loading state
  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "1rem"
        }}
      >
        <h1>Email Summarizer</h1>

        <button
          onClick={() => {
            window.location.href =
              "http://localhost:8000/login";
          }}
        >
          Login with Google
        </button>
      </div>
    );
  }

  // Logged in UI
  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1000px",
        margin: "auto"
      }}
    >

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem"
        }}
      >
        <div>
          <h2>Email Summarizer</h2>
          <p>{user.email}</p>
        </div>

        <button
          onClick={async () => {

            await fetch(
              "http://localhost:8000/logout",
              {
                credentials: "include"
              }
            );

            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>

      {/* Summary */}
      {!summary ? (

        <h2>Loading summary...</h2>

      ) : (

        <div>

          {/* Overall Summary */}
          <div
            style={{
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "10px",
              marginBottom: "2rem"
            }}
          >
            <h2>Overall Summary</h2>

            <p>
              {summary.overall_summary}
            </p>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "2rem",
              flexWrap: "wrap"
            }}
          >

            <div
              style={{
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "10px"
              }}
            >
              <h3>Total Emails</h3>
              <p>{summary.stats.total_emails}</p>
            </div>

            <div
              style={{
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "10px"
              }}
            >
              <h3>Finance Emails</h3>
              <p>{summary.stats.finance_emails}</p>
            </div>

            <div
              style={{
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "10px"
              }}
            >
              <h3>Approvals</h3>
              <p>{summary.stats.approvals}</p>
            </div>

            <div
              style={{
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "10px"
              }}
            >
              <h3>Follow Ups</h3>
              <p>{summary.stats.active_follow_ups}</p>
            </div>

          </div>

          {/* Important Emails */}
          <div>

            <h2>Important Emails</h2>

            {summary.important_emails.map(
              (email, index) => (

                <div
                  key={index}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    padding: "1rem",
                    marginBottom: "1rem"
                  }}
                >

                  <h3>
                    {email.one_line_summary}
                  </h3>

                  <p>
                    <strong>From:</strong>{" "}
                    {email.sender}
                  </p>

                  <p>
                    {email.detailed_summary}
                  </p>

                  <p>
                    <strong>Priority:</strong>{" "}
                    {email.priority}
                  </p>

                </div>
              )
            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default App;