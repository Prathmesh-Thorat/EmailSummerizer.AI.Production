import { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign up submitted", { fullName, password });
    window.location.href = "http://localhost:8000/login";
  };

  return (
    <div className="signup-root">
      {/* Ambient background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <main className="signup-main">
        <div className="signup-card">
          {/* Top accent bar */}
          <div className="card-accent" />

          <div className="card-body">
            {/* Logo / Brand */}
            <div className="brand">
              <div className="brand-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" fill="currentColor" opacity="0.9"/>
                </svg>
              </div>
              <span className="brand-name">SummarizeAI</span>
            </div>

            {/* Header */}
            <div className="card-header">
              <h1 className="card-title">Create your account</h1>
              <p className="card-subtitle">Start synthesizing your inbox today.</p>
            </div>

            {/* Divider */}
            <div className="divider">
              <span className="divider-line" />
              <span className="divider-text">or continue with email</span>
              <span className="divider-line" />
            </div>

            {/* Form */}
            <form className="signup-form" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className={`field-group ${focused === "name" ? "field-focused" : ""}`}>
                <label className="field-label" htmlFor="full_name">
                  Full Name
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input
                    id="full_name"
                    type="text"
                    className="field-input"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`field-group ${focused === "password" ? "field-focused" : ""}`}>
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="field-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button type="submit" className="submit-btn">
                <span className="submit-btn-text">Sign up with Google</span>
                <span className="submit-btn-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </button>
            </form>

            {/* Footer */}
            <p className="card-footer">
              Already have an account?{" "}
              <a href="#" className="login-link">
                Log in
              </a>
            </p>
          </div>
        </div>

        {/* Floating trust badge */}
        <div className="trust-badge">
          <span className="trust-dot" />
          <span>256-bit encrypted · SOC 2 compliant</span>
        </div>
      </main>
    </div>
  );
}