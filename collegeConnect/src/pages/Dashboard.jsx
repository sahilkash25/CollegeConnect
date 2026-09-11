import { useNavigate } from "react-router-dom";
import "../dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <div className="premium-dashboard">

            {/* Sidebar */}
            <aside className="premium-sidebar">

                <div className="brand">
                    <div className="brand-icon">✦</div>
                    <div>
                        <h2>College<span>Connect</span></h2>
                        <small>Student Network</small>
                    </div>
                </div>

                <div className="menu-label">MAIN MENU</div>

                <nav className="sidebar-menu">
                    <button className="menu-item active">
                        <span>⌂</span>
                        Dashboard
                    </button>

                    <button className="menu-item" onClick={() => navigate("/profile")}>
                        <span>♙</span>
                        My Profile
                    </button>

                    <button className="menu-item" onClick={() => navigate("/Internship")}>
                        <span>◈</span>
                        Internships
                    </button>

                    <button className="menu-item">
                        <span>▣</span>
                        Resources
                    </button>

                    <button className="menu-item">
                        <span>◎</span>
                        Community
                    </button>

                    <button className="menu-item">
                        <span>◉</span>
                        Career Roadmap
                    </button>

                    <button className="menu-item">
                        <span>♛</span>
                        Achievements
                    </button>
                </nav>

                <div className="sidebar-bottom">
                    <button className="menu-item">
                        <span>⚙</span>
                        Settings
                    </button>

                    <button className="logout" onClick={handleLogout}>
                        <span>↪</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="premium-main">

                {/* Header */}
                <header className="top-header">

                    <div className="welcome">
                        <p className="welcome-small">YOUR STUDENT SPACE</p>
                        <h1>Good Morning, {user?.name} <span>👋</span></h1>
                        <p>Ready to take the next step in your career?</p>
                        <p className="user-details">
                            {user?.college} • {"Course: " + user?.course} •  {"Year: " + user?.year}
                        </p>
                    </div>

                    <div className="header-actions">
                        <button className="icon-button">⌕</button>
                        <button className="icon-button notification">
                            ♧
                            <span></span>
                        </button>

                        <div className="user-profile">
                            <div className="avatar">
                                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                                <strong>{user?.name}</strong>
                                <small>Student</small>
                            </div>
                        </div>
                    </div>

                </header>

                {/* Hero */}
                <section className="hero-card">

                    <div className="hero-content">
                        <div className="hero-badge">✦ YOUR CAREER JOURNEY</div>

                        <h2>
                            Build your future.<br />
                            <span>One step at a time.</span>
                        </h2>

                        <p>
                            Discover opportunities, connect with students,
                            build your skills and prepare for your dream career.
                        </p>

                        <div className="hero-buttons">
                            <button className="primary-btn">
                                Explore Opportunities →
                            </button>

                            <button className="secondary-btn">
                                Complete Profile
                            </button>
                        </div>
                    </div>

                    <div className="hero-orbit">
                        <div className="orbit-ring ring-one"></div>
                        <div className="orbit-ring ring-two"></div>
                        <div className="orbit-core">✦</div>
                    </div>

                </section>

                {/* Stats */}
                <section className="premium-stats">

                    <div className="premium-stat">
                        <div className="stat-icon blue">◈</div>
                        <div>
                            <span>APPLICATIONS</span>
                            <h3>12</h3>
                            <small>↑ 3 this month</small>
                        </div>
                    </div>

                    <div className="premium-stat">
                        <div className="stat-icon purple">◇</div>
                        <div>
                            <span>SAVED</span>
                            <h3>08</h3>
                            <small>Opportunities saved</small>
                        </div>
                    </div>

                    <div className="premium-stat">
                        <div className="stat-icon green">✦</div>
                        <div>
                            <span>PROJECTS</span>
                            <h3>04</h3>
                            <small>Projects completed</small>
                        </div>
                    </div>

                    <div className="premium-stat">
                        <div className="stat-icon orange">◎</div>
                        <div>
                            <span>PROFILE</span>
                            <h3>72%</h3>
                            <small>Almost there!</small>
                        </div>
                    </div>

                </section>

                {/* Content Grid */}
                <section className="content-grid">

                    {/* Opportunities */}
                    <div className="glass-card opportunities">

                        <div className="section-heading">
                            <div>
                                <span className="section-tag">FOR YOU</span>
                                <h2>Recommended Opportunities</h2>
                            </div>

                            <button className="view-all">View all →</button>
                        </div>

                        <div className="opportunity-card">

                            <div className="company-logo">G</div>

                            <div className="opportunity-info">
                                <h3>Frontend Developer Intern</h3>
                                <p>Growing Tech Company • Remote</p>

                                <div className="tags">
                                    <span>React</span>
                                    <span>JavaScript</span>
                                    <span>3 Months</span>
                                </div>
                            </div>

                            <button className="apply-btn">
                                View →
                            </button>

                        </div>

                        <div className="opportunity-card">

                            <div className="company-logo second">⚡</div>

                            <div className="opportunity-info">
                                <h3>Software Engineering Intern</h3>
                                <p>Technology Startup • Hybrid</p>

                                <div className="tags">
                                    <span>Node.js</span>
                                    <span>MongoDB</span>
                                    <span>Paid</span>
                                </div>
                            </div>

                            <button className="apply-btn">
                                View →
                            </button>

                        </div>

                    </div>

                    {/* Progress */}
                    <div className="glass-card progress-card">

                        <div className="section-heading">
                            <div>
                                <span className="section-tag">YOUR GROWTH</span>
                                <h2>Career Progress</h2>
                            </div>
                        </div>

                        <div className="progress-circle">
                            <div className="progress-inner">
                                <strong>72%</strong>
                                <span>Complete</span>
                            </div>
                        </div>

                        <p className="progress-text">
                            You're making great progress! Complete your profile
                            to unlock more opportunities.
                        </p>

                        <button className="full-btn">
                            Complete Profile →
                        </button>

                    </div>

                </section>

                {/* Bottom */}
                <section className="glass-card">

                    <div className="section-heading">
                        <div>
                            <span className="section-tag">LEVEL UP</span>
                            <h2>Recommended For You</h2>
                        </div>
                    </div>

                    <div className="recommendations">

                        <div className="recommendation-card">
                            <div className="recommend-icon">📄</div>
                            <div>
                                <h3>Build your Resume</h3>
                                <p>Create a profile recruiters notice.</p>
                            </div>
                            <span>→</span>
                        </div>

                        <div className="recommendation-card">
                            <div className="recommend-icon">💻</div>
                            <div>
                                <h3>Improve your Skills</h3>
                                <p>Find resources for your career goal.</p>
                            </div>
                            <span>→</span>
                        </div>

                        <div className="recommendation-card">
                            <div className="recommend-icon">🤝</div>
                            <div>
                                <h3>Meet your Seniors</h3>
                                <p>Get guidance from experienced students.</p>
                            </div>
                            <span>→</span>
                        </div>

                    </div>

                </section>

            </main>
        </div>
    );
}

export default Dashboard;