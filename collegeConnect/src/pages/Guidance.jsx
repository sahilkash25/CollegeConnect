import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";
import "../guidance.css";

// Auto detect: Agar local pe chal raha hai toh localhost, nahi toh Render URL
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://collegeconnect-cznd.onrender.com";

// ==========================================
// SMART NORMALIZERS & MATCHING HELPERS
// ==========================================

// Comma ke baad ka city/branch ignore karega ("Amity university, Patna" -> "amity university")
const normalizeCollege = (value = "") => {
  return value
    .toString()
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

const normalizeCourse = (value = "") => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

// Branch ignore karke core degree nikalta hai: "B.Tech (CSE)" -> "btech"
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
  if (
    clean.includes("mtech") ||
    clean.includes("masteroftechnology") ||
    clean === "me" ||
    clean.startsWith("me")
  ) {
    return "mtech";
  }
  if (clean.includes("bca")) return "bca";
  if (clean.includes("mca")) return "mca";
  if (clean.includes("bba")) return "bba";
  if (clean.includes("mba")) return "mba";
  if (clean.includes("law") || clean.includes("llb")) return "law";

  return clean;
};

const coursesMatch = (courseA, courseB) => {
  return getCourseFamily(courseA) === getCourseFamily(courseB);
};

const collegesMatch = (colA, colB) => {
  return normalizeCollege(colA) === normalizeCollege(colB);
};

function Guidance() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Ask Question Modal State
  const [showAskModal, setShowAskModal] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  // Answers State
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [answersMap, setAnswersMap] = useState({});
  const [replyInputMap, setReplyInputMap] = useState({});
  const [submittingAnswerId, setSubmittingAnswerId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(stored);
    setCurrentUser(user);
    loadQuestions(user);
  }, []);

  const loadQuestions = async (user) => {
    setLoading(true);
    try {
      const userId = user.id || user._id;
      const res = await fetch(
        `${API_BASE_URL}/api/guidance?college=${encodeURIComponent(
          user.college
        )}&course=${encodeURIComponent(user.course)}&year=${user.year}&userId=${userId}`
      );
      const data = await res.json();
      if (res.ok) {
        setQuestions(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to load questions:", data.message);
      }
    } catch (err) {
      console.error("Error loading guidance:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle and load answers for a question
  const handleToggleAnswers = async (questionId) => {
    if (expandedQuestionId === questionId) {
      setExpandedQuestionId(null);
      return;
    }

    setExpandedQuestionId(questionId);

    if (!answersMap[questionId]) {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/guidance/${questionId}/answers`
        );
        const data = await res.json();
        if (res.ok) {
          setAnswersMap((prev) => ({ ...prev, [questionId]: data }));
        }
      } catch (err) {
        console.error("Error fetching answers:", err);
      }
    }
  };

  // Submit Answer
  const handlePostAnswer = async (questionId, question) => {
    const answer = replyInputMap[questionId]?.trim();
    if (!answer) {
      alert("Please write an answer before submitting.");
      return;
    }

    const userId = currentUser.id || currentUser._id;
    setSubmittingAnswerId(questionId);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/guidance/${questionId}/answers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answer,
            studentName: currentUser.name,
            college: currentUser.college,
            course: currentUser.course,
            year: currentUser.year,
            userId,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to post answer");
        return;
      }

      setAnswersMap((prev) => ({
        ...prev,
        [questionId]: [...(prev[questionId] || []), data.answer],
      }));

      setQuestions((prev) =>
        prev.map((q) =>
          q._id === questionId ? { ...q, status: "Answered" } : q
        )
      );

      setReplyInputMap((prev) => ({ ...prev, [questionId]: "" }));
      alert("Answer posted successfully! ✅");
    } catch (err) {
      console.error("Error submitting answer:", err);
      alert("Server error. Check connection.");
    } finally {
      setSubmittingAnswerId(null);
    }
  };

  // Submit Question
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) {
      alert("Please enter your question.");
      return;
    }

    const userId = currentUser.id || currentUser._id;
    setSubmittingQuestion(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/guidance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionText,
          studentName: currentUser.name,
          college: currentUser.college,
          course: currentUser.course,
          year: currentUser.year,
          userId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to ask question");
        return;
      }

      const added = data.guidance || data.question || data;
      setQuestions((prev) => [added, ...prev]);
      setQuestionText("");
      setShowAskModal(false);
      alert("Question posted successfully! 🎉");
    } catch (err) {
      console.error("Error submitting question:", err);
      alert("Unable to post question. Check server.");
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Filtered Questions list
  const filteredQuestions = questions.filter((q) => {
    const search = searchTerm.toLowerCase();
    return (
      q.question?.toLowerCase().includes(search) ||
      q.studentName?.toLowerCase().includes(search) ||
      q.course?.toLowerCase().includes(search)
    );
  });

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
          <button className="menu-item" onClick={() => navigate("/profile")}>
            <span>♙</span>
            My Profile
          </button>
          <button className="menu-item" onClick={() => navigate("/internship")}>
            <span>◈</span>
            Internships
          </button>
          <button className="menu-item active">
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

      {/* Main Container */}
      <main className="premium-main">
        {/* Top Header */}
        <header className="top-header">
          <div className="welcome">
            <p className="welcome-small">PEER & SENIOR GUIDANCE</p>
            <h1>Guidance Network</h1>
            <p>Ask doubts to seniors and help juniors grow.</p>
          </div>

          <div className="header-actions">
            <button
              className="primary-btn"
              onClick={() => setShowAskModal(true)}
              style={{ padding: "8px 16px", fontSize: "14px" }}
            >
              + Ask Question
            </button>

            <div className="user-profile">
              <div className="avatar">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <strong>{currentUser?.name || "Student"}</strong>
                <small>Year {currentUser?.year || "1"}</small>
              </div>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <section style={{ marginBottom: "20px" }}>
          <div className="search-box" style={{ maxWidth: "450px" }}>
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search guidance questions, students or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        {/* Questions Section */}
        <section className="guidance-list" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {loading ? (
            <div className="glass-card" style={{ textAlign: "center", padding: "40px" }}>
              <p>Loading questions from your campus...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="glass-card" style={{ textAlign: "center", padding: "40px" }}>
              <h3>No questions found for your college network</h3>
              <p style={{ color: "#94a3b8", marginTop: "8px" }}>
                Be the first to ask a question to your seniors!
              </p>
              <button
                className="primary-btn"
                style={{ marginTop: "16px" }}
                onClick={() => setShowAskModal(true)}
              >
                Ask a Question Now
              </button>
            </div>
          ) : (
            filteredQuestions.map((q) => {
            //   const isOwnQuestion =
                // String(q.userId) === String(currentUser?.id || currentUser?._id);


                const userYear = Number(currentUser?.year || 0);
              const questionYear = Number(q.year || 0);
              const isOwnQuestion = String(q.userId) === String(currentUser?.id || currentUser?._id);
                        
              // Sirf senior answer karega, peer sirf dekhega
              const canAnswer = !isOwnQuestion && userYear > questionYear;
              return (
                <div key={q._id} className="glass-card guidance-card" style={{ padding: "20px" }}>
                  {/* Card Top */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div className="avatar" style={{ width: "40px", height: "40px" }}>
                        {q.studentName ? q.studentName.charAt(0).toUpperCase() : "S"}
                      </div>
                      <div>
                        <strong style={{ fontSize: "15px" }}>{q.studentName}</strong>
                        <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                          {q.college} • {q.course} • Year {q.year}
                        </p>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: "11px",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        background: q.status === "Answered" ? "rgba(34, 197, 94, 0.15)" : "rgba(234, 179, 8, 0.15)",
                        color: q.status === "Answered" ? "#4ade80" : "#facc15",
                        fontWeight: "600",
                      }}
                    >
                      {q.status || "Open"}
                    </span>
                  </div>

                  {/* Question Content */}
                  <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", lineHeight: "1.4" }}>
                    {q.question}
                  </h3>

                  {/* Footer Actions */}
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <button
                      className="secondary-btn"
                      style={{ fontSize: "13px", padding: "6px 14px" }}
                      onClick={() => handleToggleAnswers(q._id)}
                    >
                      💬 Answers {answersMap[q._id] ? `(${answersMap[q._id].length})` : ""}
                    </button>
                  </div>

                 {/* Collapsible Answers Section */}
{expandedQuestionId === q._id && (
  <div style={{ marginTop: "18px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
    
    {/* Answers List */}
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
      {/* answers render honge... */}
    </div>

    {/* Reply Box Logic */}
    {canAnswer ? (
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Give senior guidance / answer..."
          value={replyInputMap[q._id] || ""}
          onChange={(e) =>
            setReplyInputMap({ ...replyInputMap, [q._id]: e.target.value })
          }
          style={{
            flex: 1,
            background: "#1e2238",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            padding: "8px 12px",
            color: "#fff",
            fontSize: "13px",
            outline: "none",
          }}
        />
        <button
          className="primary-btn"
          disabled={submittingAnswerId === q._id}
          onClick={() => handlePostAnswer(q._id, q)}
          style={{ padding: "8px 16px", fontSize: "13px" }}
        >
          {submittingAnswerId === q._id ? "Posting..." : "Reply"}
        </button>
      </div>
    ) : isOwnQuestion ? (
      <p style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>
        ✦ This is your question. Seniors will answer it.
      </p>
    ) : (
      <div style={{ padding: "8px 12px", background: "rgba(255, 255, 255, 0.02)", borderRadius: "6px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "12px" }}>🔒</span>
        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
          Only seniors (Year {questionYear + 1}+) can answer this question.
        </span>
      </div>
    )}
  </div>
)}       
                </div>
              );
            })
          )}
        </section>

        {/* Ask Question Modal */}
        {showAskModal && (
          <div className="modal-overlay">
            <div className="glass-card edit-modal" style={{ maxWidth: "520px" }}>
              <h2 style={{ marginBottom: "14px" }}>Ask Your Campus Seniors</h2>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
                Your question will be visible to students of {currentUser?.college}.
              </p>

              <form onSubmit={handleAskQuestion}>
                <div className="input-group">
                  <label>Your Question</label>
                  <textarea
                    rows="4"
                    placeholder="e.g. How to prepare for 3rd semester DSA exams? Which teachers to consult?"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-actions" style={{ marginTop: "20px" }}>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setShowAskModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={submittingQuestion}
                  >
                    {submittingQuestion ? "Posting..." : "Post Question"}
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

export default Guidance;