import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Internship from "./pages/Internship";

function LandingPage() {

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          🎓 College<span>Connect</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>

          <a href="/login">
            <button className="login-btn">Login</button>
          </a>

          <a href="/signup">
            <button className="signup-btn">Sign Up</button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero">

        <div className="hero-content">

          <p className="badge">
            🚀 Built by Students, For Students
          </p>

          <h1>
            Everything Students
            <br />
            <span>Need, In One Place.</span>
          </h1>

          <p className="hero-text">
            Discover internships, resources, placement guides,
            interview experiences, projects and opportunities —
            all shared by students.
          </p>

          <div className="hero-buttons">

            <a href="/signup">
              <button className="primary-btn">
                Get Started →
              </button>
            </a>

            <a href="#features">
              <button className="secondary-btn">
                Explore Resources
              </button>
            </a>

          </div>

        </div>

        {/* Preview Card */}
        <div className="heroo-card">

          <div className="card-header">
            <span>🔥 Trending</span>
            <span>•••</span>
          </div>

          <div className="post">
            <span className="post-icon">💼</span>

            <div>
              <h3>Frontend Developer Internship</h3>
              <p>React • JavaScript • Remote</p>
            </div>
          </div>

          <div className="post">
            <span className="post-icon">🎓</span>

            <div>
              <h3>Placement Preparation Guide</h3>
              <p>DSA • DBMS • Interview Tips</p>
            </div>
          </div>

          <div className="post">
            <span className="post-icon">📚</span>

            <div>
              <h3>Free Learning Resources</h3>
              <p>Web Development Roadmap</p>
            </div>
          </div>

        </div>

      </main>

      {/* Features */}
      <section className="features" id="features">

        <h2>Everything You Need</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <div>💼</div>
            <h3>Internships</h3>
            <p>
              Find and share internship opportunities.
            </p>
          </div>

          <div className="feature-card">
            <div>📚</div>
            <h3>Resources</h3>
            <p>
              Notes, courses, PDFs and useful resources.
            </p>
          </div>

          <div className="feature-card">
            <div>🎓</div>
            <h3>Placement Guides</h3>
            <p>
              Learn from seniors and their experiences.
            </p>
          </div>

          <div className="feature-card">
            <div>🗣️</div>
            <h3>Interview Experiences</h3>
            <p>
              Real experiences shared by students.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}



function App() {
  return (

      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/internship" element={<Internship />} />
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
  );
}

export default App;