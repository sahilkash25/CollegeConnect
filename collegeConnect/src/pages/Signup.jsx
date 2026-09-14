
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../auth.css";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    course: "",
    year: "",
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

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match ❌");
      return;
    }

    try {
      const response = await fetch("https://collegeconnect-cznd.onrender.com/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          college: formData.college,
          course: formData.course,
          year: Number(formData.year),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Signup failed ❌");
        return;
      }

      setMessage("Account created successfully ✅");
      
      setTimeout(() => {
      navigate("/login");
      }, 1000);

      console.log("Signup response:", data);
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Cannot connect to server ❌");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-glow glow-one"></div>
      <div className="auth-glow glow-two"></div>

      <div className="auth-container signup-container">

        <div className="auth-brand">
          <div className="auth-brand-icon">✦</div>

          <div>
            <h2>College<span>Connect</span></h2>
            <small>STUDENT NETWORK</small>
          </div>
        </div>

        <div className="auth-card signup-card">

          <div className="auth-icon">🚀</div>

          <h1>Create your account</h1>

          <p className="auth-subtitle">
            Join CollegeConnect and start building your future with your community.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="input-group">
                <label>Full Name</label>

                <div className="input-wrapper">
                  <span>👤</span>

                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Email</label>

                <div className="input-wrapper">
                  <span>✉</span>

                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Confirm Password</label>

                <div className="input-wrapper">
                  <span>🔐</span>

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group full-width">
                <label>College</label>

                <div className="input-wrapper">
                  <span>🏫</span>

                  <input
                    type="text"
                    name="college"
                    placeholder="Enter your college"
                    value={formData.college}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
  <label>Course</label>

  <div className="input-wrapper">
    <span>🎓</span>

    <select
      name="course"
      value={formData.course}
      onChange={handleChange}
      required
    >
      <option value="">Select your course</option>
      <option value="B.Tech CSE">B.Tech CSE</option>
      <option value="B.Tech AI/ML">B.Tech AI/ML</option>
      <option value="B.Tech ECE">B.Tech ECE</option>
      <option value="B.Tech ME">B.Tech Mechanical Engineering</option>
      <option value="BCA">BCA</option>
      <option value="BBA">BBA</option>
      <option value="MCA">MCA</option>
      <option value="MBA">MBA</option>
      <option value="Other">Other</option>
    </select>
  </div>
</div>

              <div className="input-group">
                <label>Year</label>

                <div className="input-wrapper">
                  <span>📅</span>

                  <input
                    type="number"
                    name="year"
                    placeholder="e.g. 3"
                    min="1"
                    max="6"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

            </div>

            <button type="submit" className="auth-btn">
              Create CollegeConnect Account
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
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>

        </div>

        <p className="auth-footer">
          ✦ Built for students. Powered by community.
        </p>

      </div>
    </div>
  );
}

export default Signup;
