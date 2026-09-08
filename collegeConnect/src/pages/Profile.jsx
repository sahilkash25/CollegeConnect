// import { useNavigate } from "react-router-dom";
// import "../profile.css";

// function Profile() {
//     const navigate = useNavigate();
//     const user = JSON.parse(localStorage.getItem("user"));
    
//     return(
//         <div classname="profile-page">

//             <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
//             <div className ="profile-card">
//                 <div className="profile-avatar">
//                     {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
//                 </div>
           
//                 <h1>{user?.name}</h1>
//                 <p className="profile-email">{user?.email}</p>

//                 <div className="profile-detail">
//                     <div className="detail-box">
//                         <span>🎓 College</span>
//                         <strong>{user?.college}</strong>
//                     </div>
//                     <div className="detail-box">
//                         <span>💻 Course</span>
//                         <strong>{user?.course}</strong>
//                     </div>
//                     <div className="detail-box">
//                         <span>📅 Year</span>
//                         <strong>{user?.year}</strong>
//                     </div>
//                     <div className="detail-box">
//                         <span>📧 Email</span>
//                         <strong>{user?.email}</strong>
//                     </div>

//                 </div>
//                 <button className="edit-profile-btn">
//                     Edit Profile
//                 </button>

//             </div>

//         </div>
//     );
// }


// export default Profile;

import { useNavigate } from "react-router-dom";
import "../dashboard.css";
import "../profile.css";

function Profile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="premium-dashboard">

            {/* Sidebar */}
            <aside className="premium-sidebar">

                <div className="brand">
                    <div className="brand-icon">✦</div>

                    <div>
                        <h2>
                            College<span>Connect</span>
                        </h2>
                        <small>Student Network</small>
                    </div>
                </div>

                <div className="menu-label">MAIN MENU</div>

                <nav className="sidebar-menu">

                    <button
                        className="menu-item"
                        onClick={() => navigate("/dashboard")}
                    >
                        <span>⌂</span>
                        Dashboard
                    </button>

                    <button className="menu-item active">
                        <span>♙</span>
                        My Profile
                    </button>

                    <button className="menu-item">
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
                        <p className="welcome-small">
                            YOUR PROFILE
                        </p>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            Manage your College Connect profile.
                        </p>
                    </div>

                    <div className="header-actions">

                        <button className="icon-button">
                            ⌕
                        </button>

                        <button className="icon-button notification">
                            ♧
                            <span></span>
                        </button>

                        <div className="user-profile">

                            <div className="avatar">
                                {user?.name
                                    ? user.name.charAt(0).toUpperCase()
                                    : "U"}
                            </div>

                            <div>
                                <strong>{user?.name}</strong>
                                <small>Student</small>
                            </div>

                        </div>

                    </div>

                </header>


                {/* Profile */}
                <section className="profile-layout">

                    {/* Profile Header Card */}
                    <div className="glass-card profile-main-card">

                        <div className="profile-main-info">

                            <div className="profile-avatar">
                                {user?.name
                                    ? user.name.charAt(0).toUpperCase()
                                    : "U"}
                            </div>

                            <div>
                                <div className="profile-name-row">
                                    <h2>{user?.name}</h2>
                                    <span className="student-badge">
                                        STUDENT
                                    </span>
                                </div>

                                <p>{user?.email}</p>

                                <span className="profile-status">
                                    ● Active student
                                </span>
                            </div>

                        </div>

                        <button className="edit-profile-btn">
                            ✎ Edit Profile
                        </button>

                    </div>


                    {/* Personal Information */}
                    <div className="glass-card">

                        <div className="section-heading">
                            <div>
                                <span className="section-tag">
                                    PERSONAL INFORMATION
                                </span>

                                <h2>Profile Details</h2>
                            </div>
                        </div>


                        <div className="profile-details-grid">

                            <div className="profile-detail">
                                <span>FULL NAME</span>
                                <strong>{user?.name || "Not available"}</strong>
                            </div>

                            <div className="profile-detail">
                                <span>EMAIL ADDRESS</span>
                                <strong>{user?.email || "Not available"}</strong>
                            </div>

                            <div className="profile-detail">
                                <span>COLLEGE</span>
                                <strong>{user?.college || "Not available"}</strong>
                            </div>

                            <div className="profile-detail">
                                <span>COURSE</span>
                                <strong>{user?.course || "Not available"}</strong>
                            </div>

                            <div className="profile-detail">
                                <span>ACADEMIC YEAR</span>
                                <strong>Year {user?.year || "Not available"}</strong>
                            </div>

                        </div>

                    </div>


                    {/* Profile Completion */}
                    <div className="glass-card profile-completion">

                        <div className="section-heading">
                            <div>
                                <span className="section-tag">
                                    PROFILE STRENGTH
                                </span>

                                <h2>Complete Your Profile</h2>
                            </div>

                            <strong className="completion-number">
                                72%
                            </strong>
                        </div>

                        <div className="completion-bar">
                            <div></div>
                        </div>

                        <p>
                            Add more information to make your profile
                            stronger and unlock better opportunities.
                        </p>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Profile;