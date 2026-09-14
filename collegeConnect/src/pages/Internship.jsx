import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../internship.css";

// Auto-detect: Local par localhost:5000, Render par render URL
const API_BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://collegeconnect-cznd.onrender.com";

// Smart Course Family Extractor
const getCourseFamily = (value = "") => {
  if (!value) return "";
  let clean = value.split("(")[0].split("-")[0].trim().toLowerCase();
  clean = clean.replace(/[^a-z0-9]/g, "");

  if (
    clean.includes("btech") ||
    clean.includes("bacheloroftechnology") ||
    clean === "be" ||
    clean.startsWith("be")
  ) {
    return "btech";
  }
  if (clean.includes("bca")) return "bca";
  if (
    clean.includes("mtech") ||
    clean.includes("masteroftechnology") ||
    clean === "me" ||
    clean.startsWith("me")
  ) {
    return "mtech";
  }
  if (clean.includes("mca")) return "mca";
  if (clean.includes("bba")) return "bba";
  if (clean.includes("mba")) return "mba";
  if (clean.includes("law") || clean.includes("llb")) return "law";
  return clean;
};

const isCourseEligible = (userCourse, eligibleList = []) => {
  if (!userCourse || !eligibleList || eligibleList.length === 0) return true;
  const userFamily = getCourseFamily(userCourse);
  return eligibleList.some((course) => getCourseFamily(course) === userFamily);
};

function Internships() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [opportunities, setOpportunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [domainFilter, setDomainFilter] = useState("All Domains");
  const [modeFilter, setModeFilter] = useState("All Work Modes");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    setCurrentUser(user);

    const fetchOpportunities = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/opportunities?course=${encodeURIComponent(user.course || "")}`
        );
        const data = await response.json();

        if (response.ok) {
          setOpportunities(data);
        }
      } catch (error) {
        console.error("Failed to fetch opportunities:", error);
      }
    };

    fetchOpportunities();
  }, []);

  const [form, setForm] = useState({
    title: "",
    company: "",
    domain: "",
    mode: "",
    duration: "",
    stipend: "",
    eligibility: "",
    eligibleCourses: "",
    link: "",
    deadline: "",
    description: ""
  });

  const internships = [
    {
      logo: "G",
      title: "Frontend Developer Intern",
      company: "GrowthTech Solutions",
      domain: "Web Development",
      eligibleCourse: ["BCA", "B.Tech"],
      mode: "Remote",
      duration: "3 Months",
      stipend: "₹10K / month",
      skills: ["React", "JavaScript", "CSS"]
    },
    {
      logo: "T",
      title: "Software Engineering Intern",
      company: "TechNova Labs",
      domain: "Software Development",
      eligibleCourse: ["BCA", "B.Tech"],
      mode: "Hybrid",
      duration: "6 Months",
      stipend: "₹15K / month",
      skills: ["Node.js", "MongoDB", "Git"]
    },
    {
      logo: "D",
      title: "Data Science Intern",
      company: "DataSphere AI",
      domain: "Data Science",
      eligibleCourse: ["BCA", "B.Tech"],
      mode: "Remote",
      duration: "4 Months",
      stipend: "₹12K / month",
      skills: ["Python", "Pandas", "SQL"]
    },
    {
      logo: "A",
      title: "AI / ML Intern",
      company: "Artificial Labs",
      domain: "AI / ML",
      eligibleCourse: ["B.Tech"],
      mode: "On-site",
      duration: "6 Months",
      stipend: "₹18K / month",
      skills: ["Python", "Machine Learning", "AI"]
    },
    {
      logo: "L",
      title: "Legal Research Intern",
      company: "LexCore Legal",
      domain: "Law",
      eligibleCourse: ["Law"],
      mode: "Hybrid",
      duration: "3 Months",
      stipend: "₹8K / month",
      skills: ["Legal Research", "Case Analysis", "Legal Writing"]
    }
  ];

  const filteredOpportunities = opportunities.filter((opportunity) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      opportunity.title?.toLowerCase().includes(search) ||
      opportunity.company?.toLowerCase().includes(search) ||
      opportunity.domain?.toLowerCase().includes(search) ||
      opportunity.course?.toLowerCase().includes(search);

    const matchesDomain =
      domainFilter === "All Domains" || opportunity.domain === domainFilter;

    const matchesMode =
      modeFilter === "All Work Modes" || opportunity.mode === modeFilter;

    return matchesSearch && matchesDomain && matchesMode;
  });

  const filteredInternships = internships.filter((internship) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      internship.title?.toLowerCase().includes(search) ||
      internship.company?.toLowerCase().includes(search) ||
      internship.domain?.toLowerCase().includes(search) ||
      internship.skills?.some((skill) => skill.toLowerCase().includes(search));

    const matchesDomain =
      domainFilter === "All Domains" || internship.domain === domainFilter;

    const matchesMode =
      modeFilter === "All Work Modes" || internship.mode === modeFilter;

    // Smart Matching for B.Tech (CSE), BCA, etc.
    const eligibleList = internship.eligibleCourse || internship.eligibleCourses || [];
    const matchesCourse = isCourseEligible(currentUser?.course, eligibleList);

    return matchesSearch && matchesDomain && matchesMode && matchesCourse;
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.company || !form.domain || !form.mode || !form.link) {
      alert("Please fill all required fields.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id || user?._id;

    if (!user || !userId) {
      alert("Please login again.");
      return;
    }

    try {
      if (editingOpportunity) {
        const response = await fetch(
          `${API_BASE_URL}/api/opportunities/${editingOpportunity._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...form,
              eligibleCourses: form.eligibleCourses
                .split(",")
                .map((course) => course.trim())
                .filter(Boolean),
              studentName: user.name,
              college: user.college,
              course: user.course,
              year: user.year,
              userId: userId
            })
          }
        );

        const data = await response.json();
        if (!response.ok) {
          alert(data.message || "Failed to update opportunity");
          return;
        }

        setOpportunities((prev) =>
          prev.map((opportunity) =>
            opportunity._id === editingOpportunity._id ? data.opportunity : opportunity
          )
        );

        alert("Opportunity updated successfully! ✅");
      } else {
        const response = await fetch(`${API_BASE_URL}/api/opportunities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            eligibleCourses: form.eligibleCourses
              .split(",")
              .map((course) => course.trim())
              .filter(Boolean),
            studentName: user.name,
            college: user.college,
            course: user.course,
            year: user.year,
            userId: userId
          })
        });

        const data = await response.json();
        if (!response.ok) {
          alert(data.message || "Failed to share opportunity");
          return;
        }

        setOpportunities((prev) => [data.opportunity, ...prev]);
        alert("Opportunity shared successfully! 🎉");
      }

      setForm({
        title: "",
        company: "",
        domain: "",
        mode: "",
        duration: "",
        stipend: "",
        eligibility: "",
        eligibleCourses: "",
        link: "",
        deadline: "",
        description: ""
      });

      setEditingOpportunity(null);
      setShowForm(false);
    } catch (error) {
      console.error("OPPORTUNITY ERROR:", error);
      alert("Unable to connect to server.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this opportunity?"
    );
    if (!confirmDelete) return;

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id || user?._id;

    try {
      const response = await fetch(`${API_BASE_URL}/api/opportunities/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to delete opportunity");
        return;
      }

      setOpportunities((prev) =>
        prev.filter((opportunity) => opportunity._id !== id)
      );

      alert("Opportunity deleted successfully.");
    } catch (error) {
      console.error("DELETE OPPORTUNITY ERROR:", error);
      alert("Unable to connect to server.");
    }
  };

  const handleEdit = (opportunity) => {
    setEditingOpportunity(opportunity);
    setForm({
      title: opportunity.title || "",
      company: opportunity.company || "",
      domain: opportunity.domain || "",
      mode: opportunity.mode || "",
      duration: opportunity.duration || "",
      stipend: opportunity.stipend || "",
      eligibility: opportunity.eligibility || "",
      eligibleCourses:
        opportunity.eligibleCourses?.join(", ") ||
        opportunity.eligibleCourse?.join(", ") ||
        "",
      link: opportunity.link || "",
      deadline: opportunity.deadline || "",
      description: opportunity.description || ""
    });
    setShowForm(true);
  };

  return (
    <div className="internships-page">
      <header className="internships-header">
        <div>
          <h1>Internships</h1>
          <p>Discover opportunities and grow your career.</p>
        </div>

        <div className="header-buttons">
          <button
            className="share-opportunity-btn"
            onClick={() => {
              setEditingOpportunity(null);
              setForm({
                title: "",
                company: "",
                domain: "",
                mode: "",
                duration: "",
                stipend: "",
                eligibility: "",
                eligibleCourses: "",
                link: "",
                deadline: "",
                description: ""
              });
              setShowForm(true);
            }}
          >
            + Share Opportunity
          </button>

          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ← Dashboard
          </button>
        </div>
      </header>

      <section className="internship-tools">
        <div className="search-box">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search internships, skills or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
        >
          <option>All Domains</option>
          <option>Web Development</option>
          <option>Software Development</option>
          <option>Data Science</option>
          <option>AI / ML</option>
          <option>Cyber Security</option>
          <option>Law</option>
        </select>

        <select
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
        >
          <option>All Work Modes</option>
          <option>Remote</option>
          <option>Hybrid</option>
          <option>On-site</option>
        </select>
      </section>

      {/* Latest Internships */}
      <div className="section-heading">
        <h2>Latest Internships</h2>
        <span>{filteredInternships.length} internships</span>
      </div>

      <section className="internship-grid">
        {filteredInternships.map((internship, index) => (
          <div className="internship-card" key={index}>
            <div className="company-logo">{internship.logo}</div>
            <div className="card-content">
              <div className="card-top">
                <span className="type">INTERNSHIP</span>
                <button className="save-btn">♡</button>
              </div>

              <h3>{internship.title}</h3>
              <p className="company">{internship.company}</p>

              <div className="meta">
                <span>◉ {internship.mode}</span>
                <span>◷ {internship.duration}</span>
                <span>💰 {internship.stipend}</span>
              </div>

              <div className="tags">
                {internship.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              <button className="view-btn">View Opportunity →</button>
            </div>
          </div>
        ))}
      </section>

      {/* Student Shared Opportunities */}
      {opportunities.length > 0 && (
        <section className="student-shared-section">
          <div className="section-heading">
            <div>
              <span className="shared-label">STUDENT NETWORK</span>
              <h2>Student Shared Opportunities</h2>
            </div>
            <span>{filteredOpportunities.length} shared</span>
          </div>

          <div className="shared-opportunity-grid">
            {filteredOpportunities.map((opportunity) => (
              <div className="shared-opportunity-card" key={opportunity._id}>
                <div className="shared-card-top">
                  <div className="student-avatar">
                    {opportunity.studentName
                      ? opportunity.studentName.charAt(0).toUpperCase()
                      : "S"}
                  </div>

                  <div>
                    <strong>{opportunity.studentName}</strong>
                    <p>{opportunity.college || "College not Specified"}</p>
                    <p>{opportunity.course}</p>
                  </div>

                  <span className="shared-badge">STUDENT SHARED</span>
                </div>

                <h3>{opportunity.title}</h3>
                <p className="company">{opportunity.company}</p>

                <div className="meta">
                  <span>◉ {opportunity.mode}</span>
                  <span>◷ {opportunity.duration || "N/A"}</span>
                  <span>💰 {opportunity.stipend || "Unpaid"}</span>
                </div>

                <div className="tags">
                  <span>{opportunity.domain}</span>
                  {opportunity.eligibility && (
                    <span>{opportunity.eligibility}</span>
                  )}
                </div>

                {opportunity.description && (
                  <p className="shared-description">
                    "{opportunity.description}"
                  </p>
                )}

                <a
                  href={opportunity.link}
                  target="_blank"
                  rel="noreferrer"
                  className="view-btn shared-view-btn"
                >
                  View Opportunity →
                </a>

                {String(currentUser?.id || currentUser?._id) ===
                  String(opportunity.userId) && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    <button
                      className="edit-opportunity-btn"
                      onClick={() => handleEdit(opportunity)}
                    >
                      ✏️ Edit Opportunity
                    </button>
                    <button
                      className="delete-opportunity-btn"
                      onClick={() => handleDelete(opportunity._id)}
                    >
                      🗑 Delete Opportunity
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Share Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="opportunity-modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingOpportunity
                    ? "Edit Opportunity"
                    : "Share an Opportunity"}
                </h2>
                <p>
                  {editingOpportunity
                    ? "Update the details of your opportunity."
                    : "Help another student discover an opportunity."}
                </p>
              </div>

              <button
                className="close-modal"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form className="opportunity-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Opportunity Title *"
              />

              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company Name *"
              />

              <select
                name="domain"
                value={form.domain}
                onChange={handleChange}
              >
                <option value="">Select Domain *</option>
                <option>Web Development</option>
                <option>Software Development</option>
                <option>Data Science</option>
                <option>AI / ML</option>
                <option>Cyber Security</option>
              </select>

              <select name="mode" value={form.mode} onChange={handleChange}>
                <option value="">Select Work Mode *</option>
                <option>Remote</option>
                <option>Hybrid</option>
                <option>On-site</option>
              </select>

              <div className="form-row">
                <input
                  type="text"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="Duration"
                />

                <input
                  type="text"
                  name="stipend"
                  value={form.stipend}
                  onChange={handleChange}
                  placeholder="Stipend"
                />
              </div>

              <input
                type="text"
                name="eligibility"
                value={form.eligibility}
                onChange={handleChange}
                placeholder="Eligibility"
              />

              <input
                type="text"
                name="eligibleCourses"
                value={form.eligibleCourses}
                onChange={handleChange}
                placeholder="Eligible Courses (e.g. BCA, B.Tech, Law)"
              />

              <input
                type="url"
                name="link"
                value={form.link}
                onChange={handleChange}
                placeholder="Application Link *"
              />

              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell other students about this opportunity..."
                rows="4"
              ></textarea>

              <button type="submit" className="submit-opportunity">
                {editingOpportunity
                  ? "Update Opportunity"
                  : "Share Opportunity"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Internships;