

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://collegeconnect-cznd.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed ❌");
        return;
      }

      setMessage("Login successful ✅");

      console.log("Login response:", data);

      localStorage.setItem("user", JSON.stringify(data.user));
      
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);
      setMessage("Cannot connect to server ❌");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-glow glow-one"></div>
      <div className="auth-glow glow-two"></div>

      <div className="auth-container">

        <div className="auth-brand">
          <div className="auth-brand-icon">✦</div>
          <div>
            <h2>College<span>Connect</span></h2>
            <small>STUDENT NETWORK</small>
          </div>
        </div>

        <div className="auth-card">

          <div className="auth-icon">👋</div>

          <h1>Welcome back</h1>

          <p className="auth-subtitle">
            Login to continue your student journey and discover new opportunities.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Email Address</label>

              <div className="input-wrapper">
                <span>✉</span>

                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="input-wrapper">
                <span>🔒</span>

                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="auth-options">
              <label className="remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <a href="#" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            <button type="submit" className="auth-btn">
              Login to CollegeConnect
              <span>→</span>
            </button>

          </form>

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-switch">
            Don't have an account?
            <Link to="/signup"> Create one</Link>
          </p>

        </div>

        <p className="auth-footer">
          ✦ Built for students. Powered by community.
        </p>

      </div>
    </div>
  );
}

export default Login;