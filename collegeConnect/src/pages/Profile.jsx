import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";
import "../profile.css";

// Profile Completion Formula (10 fields = 100%)
const calculateProfileCompletion = (user) => {
  if (!user) return 0;

  const checks = [
    Boolean(user.name?.trim()),
    Boolean(user.email?.trim()),
    Boolean(user.college?.trim()),
    Boolean(user.course?.trim()),
    Boolean(user.year),
    Boolean(user.bio?.trim()),
    Boolean(user.skills && user.skills.length > 0),
    Boolean(user.github?.trim()),
    Boolean(user.linkedin?.trim()),
    Boolean(user.resume?.trim()),
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Saari details form state mein
  const [formData, setFormData] = useState({
    name: user?.name || "",
    college: user?.college || "",
    course: user?.course || "",
    year: user?.year || "",
    bio: user?.bio || "",
    skills: user?.skills ? user.skills.join(", ") : "",
    github: user?.github || "",
    linkedin: user?.linkedin || "",
    resume: user?.resume || "",
  });

  const completionRate = calculateProfileCompletion(user);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openEditModal = () => {
    setFormData({
      name: user?.name || "",
      college: user?.college || "",
      course: user?.course || "",
      year: user?.year || "",
      bio: user?.bio || "",
      skills: user?.skills ? user.skills.join(", ") : "",
      github: user?.github || "",
      linkedin: user?.linkedin || "",
      resume: user?.resume || "",
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = user.id || user._id;
      const res = await fetch(`http://localhost:5000/api/users/update-profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile save error:", err);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
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
          <button className="menu-item" onClick={() => navigate("/dashboard")}>
            <span>⌂</span>
            Dashboard
          </button>
          <button className="menu-item active">
            <span>♙</span>
            My Profile
          </button>
          <button className="menu-item" onClick={() => navigate("/internship")}>
            <span>◈</span>
            Internships
          </button>
          <button className="menu-item" onClick={() => navigate("/guidance")}>
            <span>◉</span>
            Guidance
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="logout" onClick={handleLogout}>
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="premium-main">
        <header className="top-header">
          <div className="welcome">
            <p className="welcome-small">YOUR PROFILE</p>
            <h1>My Profile</h1>
            <p>Manage your College Connect profile.</p>
          </div>

          <div className="header-actions">
            <div className="user-profile">
              <div className="avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <strong>{user?.name || "Student"}</strong>
                <small>Student</small>
              </div>
            </div>
          </div>
        </header>

        <section className="profile-layout">
          {/* Header Card */}
          <div className="glass-card profile-main-card">
            <div className="profile-main-info">
              <div className="profile-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <div className="profile-name-row">
                  <h2>{user?.name || "User"}</h2>
                  <span className="student-badge">STUDENT</span>
                </div>
                <p>{user?.email || "No email available"}</p>
                <span className="profile-status">● Active student</span>
              </div>
            </div>

            <button className="edit-profile-btn" onClick={openEditModal}>
              ✎ Edit Profile
            </button>
          </div>

          {/* Strength Bar */}
          <div className="glass-card profile-completion">
            <div className="section-heading">
              <div>
                <span className="section-tag">PROFILE STRENGTH</span>
                <h2>Complete Your Profile</h2>
              </div>
              <strong className="completion-number">{completionRate}%</strong>
            </div>

            <div className="completion-bar">
              <div
                style={{
                  width: `${completionRate}%`,
                  transition: "width 0.4s ease-in-out",
                }}
              ></div>
            </div>

            <p>
              {completionRate === 100
                ? "Awesome! Your profile is 100% complete and ready for recruiters."
                : "Add your bio, skills, and links to reach 100% profile strength."}
            </p>
          </div>

          {/* Details Card */}
          <div className="glass-card">
            <div className="section-heading">
              <div>
                <span className="section-tag">PERSONAL INFORMATION</span>
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
                <strong>
                  {user?.year ? `Year ${user.year}` : "Not available"}
                </strong>
              </div>
              <div className="profile-detail">
                <span>BIO</span>
                <strong>{user?.bio || "Not added yet"}</strong>
              </div>
              <div className="profile-detail">
                <span>SKILLS</span>
                <strong>
                  {user?.skills && user.skills.length > 0
                    ? user.skills.join(", ")
                    : "No skills added"}
                </strong>
              </div>
              <div className="profile-detail">
                <span>GITHUB</span>
                <strong>{user?.github || "Not connected"}</strong>
              </div>
              <div className="profile-detail">
                <span>LINKEDIN</span>
                <strong>{user?.linkedin || "Not connected"}</strong>
              </div>
              <div className="profile-detail">
                <span>RESUME</span>
                <strong>{user?.resume ? "Uploaded / Linked" : "Not uploaded"}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* EDIT PROFILE MODAL */}
        {isEditing && (
          <div className="modal-overlay">
            <div className="glass-card edit-modal" style={{ maxHeight: "90vh", overflowY: "auto" }}>
              <h2 style={{ marginBottom: "16px" }}>Edit Profile</h2>
              <form onSubmit={handleSaveProfile}>
                
                {/* Basic Academic Info */}
                <div className="modal-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Full Name"
                    required
                  />
                </div>

                <div className="modal-field">
                  <label>College</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    placeholder="College / University Name"
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div className="modal-field">
                    <label>Course</label>
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      placeholder="e.g. BTech, BCA"
                      required
                    />
                  </div>
                  <div className="modal-field">
                    <label>Year</label>
                    <input
                      type="number"
                      name="year"
                      min="1"
                      max="5"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="e.g. 2"
                      required
                    />
                  </div>
                </div>

                {/* Career Info */}
                <div className="modal-field">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Short summary about yourself..."
                    rows="3"
                  />
                </div>

                <div className="modal-field">
                  <label>Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g. React, Node.js, MongoDB"
                  />
                </div>

                <div className="modal-field">
                  <label>GitHub Profile URL</label>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="modal-field">
                  <label>LinkedIn Profile URL</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="modal-field">
                  <label>Resume / Portfolio Link</label>
                  <input
                    type="url"
                    name="resume"
                    value={formData.resume}
                    onChange={handleInputChange}
                    placeholder="https://drive.google.com/..."
                  />
                </div>

                <div className="modal-buttons">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;