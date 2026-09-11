import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../guidance.css";

function Guidance() {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState("");
    const [category, setCategory] = useState("Internship");
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);

    const [answers, setAnswers] = useState({});
    const [answerText, setAnswerText] = useState({});

    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            setLoading(false);
            return;
        }

        const user = JSON.parse(storedUser);

        setCurrentUser(user);
        fetchQuestions(user);
    }, []);

    const fetchQuestions = async (user) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/guidance?college=${encodeURIComponent(
                    user.college
                )}&course=${encodeURIComponent(
                    user.course
                )}&year=${user.year}&userId=${user.id}`
            );

            const data = await response.json();

            if (response.ok) {
                setQuestions(data);

                data.forEach((item) => {
                    fetchAnswers(item._id);
                });
            }
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!question.trim()) {
            return;
        }

        try {
            setPosting(true);

            const response = await fetch(
                "http://localhost:5000/api/guidance",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        question: question.trim(),
                        category,
                        studentName: currentUser.name,
                        college: currentUser.college,
                        course: currentUser.course,
                        year: currentUser.year,
                        userId: currentUser.id
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setQuestion("");
                setCategory("Internship");

                alert("Question posted successfully!");

                fetchQuestions(currentUser);
            } else {
                alert(data.message || "Failed to post question");
            }
        } catch (error) {
            console.error("POST QUESTION ERROR:", error);
            alert("Something went wrong");
        } finally {
            setPosting(false);
        }
    };

    const handleAnswer = async (guidanceId) => {
        const text = answerText[guidanceId]?.trim();

        if (!text) {
            alert("Please write an answer first.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/guidance/${guidanceId}/answers`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        answer: text,
                        studentName: currentUser.name,
                        college: currentUser.college,
                        course: currentUser.course,
                        year: currentUser.year,
                        userId: currentUser.id
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setAnswerText((prev) => ({
                    ...prev,
                    [guidanceId]: ""
                }));

                await fetchAnswers(guidanceId);
                await fetchQuestions(currentUser);

                alert("Answer posted successfully!");
            } else {
                alert(data.message || "Failed to post answer");
            }
        } catch (error) {
            console.error("POST ANSWER ERROR:", error);
            alert("Something went wrong");
        }
    };

    const fetchAnswers = async (guidanceId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/guidance/${guidanceId}/answers`
            );

            const data = await response.json();

            if (response.ok) {
                setAnswers((prev) => ({
                    ...prev,
                    [guidanceId]: data
                }));
            }
        } catch (error) {
            console.error("Failed to fetch answers:", error);
        }
    };

    const isSenior = currentUser && Number(currentUser.year) >= 4;

    const filteredQuestions = questions.filter((item) => {
    const matchesSearch =
        item.question
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
        item.studentName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

    const matchesCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;

    return matchesSearch && matchesCategory;
});

    return (
        <div className="guidance-page">

            {/* HEADER */}
            <header className="guidance-header">

                <div>
                    <div className="guidance-eyebrow">
                        COLLEGECONNECT • SENIOR NETWORK
                    </div>

                    <h1>
                        {isSenior
                            ? "Senior Guidance 🎓"
                            : "Ask a Senior 🎓"}
                    </h1>

                    <p>
                        {isSenior
                            ? "Help your juniors with your experience, knowledge and advice."
                            : "Have a question? Get genuine guidance from seniors of your college and course."}
                    </p>

                    {currentUser && (
                        <div className="guidance-user-info">
                            <span>{currentUser.course}</span>
                            <span>•</span>
                            <span>Year {currentUser.year}</span>
                            <span>•</span>
                            <span>{currentUser.college}</span>
                        </div>
                    )}
                </div>

                <button
                    className="guidance-back-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

            </header>


            {/* ASK QUESTION */}
            {currentUser && Number(currentUser.year) < 4 && (
                <section className="ask-question-card">

                    <div className="ask-question-heading">
                        <div className="ask-icon">?</div>

                        <div>
                            <h2>Ask Your Senior</h2>
                            <p>
                                Stuck somewhere? Ask seniors who have already
                                been through it.
                            </p>
                        </div>
                    </div>

                    <div className="guidance-filters">

                    <div className="guidance-search">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="guidance-category-filter"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >               
                        <option value="All">All Categories</option>
                        <option value="Internship">Internship</option>
                        <option value="Placement">Placement</option>
                        <option value="Academics">Academics</option>
                        <option value="Projects">Projects</option>
                        <option value="DSA">DSA</option>
                        <option value="Resume">Resume</option>
                        <option value="College Life">College Life</option>
                        <option value="Other">Other</option>
                    </select>

                </div>

                    <form onSubmit={handleSubmit}>

                        <textarea
                            className="guidance-textarea"
                            placeholder="What do you want to ask your senior?"
                            value={question}
                            onChange={(e) =>
                                setQuestion(e.target.value)
                            }
                            rows="5"
                        />

                        <div className="question-form-bottom">

                            <select
                                className="guidance-select"
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                            >
                                <option>Internship</option>
                                <option>Placement</option>
                                <option>Academics</option>
                                <option>Projects</option>
                                <option>DSA</option>
                                <option>Resume</option>
                                <option>College Life</option>
                                <option>Other</option>
                            </select>

                            <button
                                type="submit"
                                className="ask-question-btn"
                                disabled={posting}
                            >
                                {posting
                                    ? "Posting..."
                                    : "Ask Senior →"}
                            </button>

                        </div>

                    </form>
                </section>
            )}


            {/* SENIOR INFO */}
            {isSenior && (
                <section className="senior-info-card">

                    <div className="senior-info-icon">
                        🎓
                    </div>

                    <div>
                        <h3>You're now a Senior!</h3>

                        <p>
                            Questions from juniors in your same college
                            and course will appear below. Share your
                            experience and help them move forward.
                        </p>
                    </div>

                </section>
            )}


            {/* QUESTIONS */}
            <section className="questions-section">

                <div className="questions-heading">

                    <div>
                        <span className="section-eyebrow">
                            COMMUNITY GUIDANCE
                        </span>

                        <h2>
                            {isSenior
                                ? "Questions from Juniors"
                                : "Your Questions"}
                        </h2>
                    </div>

                    <span className="question-count">
                        {filteredQuestions.length}{" "}
                        {filteredQuestions.length === 1
                            ? "Question"
                            : "Questions"}
                    </span>

                </div>


                {loading ? (
                    <div className="guidance-empty">
                        <div className="loading-dot">●</div>
                        <p>Loading guidance...</p>
                    </div>
                ) : filteredQuestions.length === 0 ? (
                    <div className="guidance-empty">

                        <div className="empty-icon">
                            💬
                        </div>

                        <h3>
                            No questions yet
                        </h3>

                        <p>
                            {isSenior
                                ? "Your juniors haven't asked anything yet."
                                : "Ask your first question and get guidance from a senior."}
                        </p>

                    </div>
                ) : (

                    <div className="questions-list">

                        {filteredQuestions.map((item) => {

                            const isOwnQuestion =
                                currentUser &&
                                String(item.userId) ===
                                    String(currentUser.id);

                            const canAnswer =
                                currentUser &&
                                !isOwnQuestion &&
                                currentUser.college?.toLowerCase() ===
                                    item.college?.toLowerCase() &&
                                currentUser.course?.toLowerCase() ===
                                    item.course?.toLowerCase() &&
                                Number(currentUser.year) >
                                    Number(item.year);

                            return (
                                <article
                                    className="question-card"
                                    key={item._id}
                                >

                                    {/* CARD TOP */}
                                    <div className="question-card-top">

                                        <span className="guidance-category">
                                            {item.category}
                                        </span>

                                        <span
                                            className={`question-status ${
                                                item.status === "Answered"
                                                    ? "answered"
                                                    : "unanswered"
                                            }`}
                                        >
                                            {item.status === "Answered"
                                                ? "Answered ✓"
                                                : "Unanswered"}
                                        </span>

                                    </div>


                                    {/* QUESTION */}
                                    <h3 className="question-title">
                                        {item.question}
                                    </h3>


                                    {/* USER INFO */}
                                    <div className="question-author">

                                        <div className="author-avatar">
                                            {item.studentName
                                                ?.charAt(0)
                                                ?.toUpperCase()}
                                        </div>

                                        <div>
                                            <strong>
                                                {isOwnQuestion
                                                    ? "You"
                                                    : item.studentName}
                                            </strong>

                                            <p>
                                                {item.course} • Year{" "}
                                                {item.year}
                                            </p>
                                        </div>

                                    </div>


                                    {/* ANSWERS */}
                                    {answers[item._id]?.length > 0 && (
                                        <div className="answers-section">

                                            <div className="answers-heading">
                                                <span>
                                                    Senior Answers
                                                </span>

                                                <span>
                                                    {answers[item._id].length}
                                                </span>
                                            </div>


                                            {answers[item._id].map(
                                                (answer) => (
                                                    <div
                                                        className="answer-card"
                                                        key={answer._id}
                                                    >

                                                        <div className="answer-top">

                                                            <div className="answer-avatar">
                                                                {answer.studentName
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase()}
                                                            </div>

                                                            <div>
                                                                <strong>
                                                                    {
                                                                        answer.studentName
                                                                    }
                                                                </strong>

                                                                <p>
                                                                    {
                                                                        answer.course
                                                                    }{" "}
                                                                    • Year{" "}
                                                                    {
                                                                        answer.year
                                                                    }
                                                                </p>
                                                            </div>

                                                            <span className="senior-label">
                                                                Senior
                                                            </span>

                                                        </div>

                                                        <p className="answer-text">
                                                            {answer.answer}
                                                        </p>

                                                    </div>
                                                )
                                            )}

                                        </div>
                                    )}


                                    {/* ANSWER FORM */}
                                    {canAnswer && (
                                        <div className="answer-form">

                                            <div className="answer-form-title">
                                                <span>💡</span>
                                                Help this junior
                                            </div>

                                            <textarea
                                                placeholder="Share your experience or guidance..."
                                                value={
                                                    answerText[item._id] ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setAnswerText((prev) => ({
                                                        ...prev,
                                                        [item._id]:
                                                            e.target.value
                                                    }))
                                                }
                                                rows="4"
                                            />

                                            <button
                                                onClick={() =>
                                                    handleAnswer(item._id)
                                                }
                                            >
                                                Post Guidance →
                                            </button>

                                        </div>
                                    )}

                                </article>
                            );
                        })}

                    </div>
                )}

            </section>

        </div>
    );
}

export default Guidance;