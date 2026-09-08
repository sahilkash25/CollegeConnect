// // 



// import { useNavigate } from "react-router-dom";
// import "../internship.css";
// import { useState } from "react";

// function Internships() {
//     const navigate = useNavigate();

//     const [showForm, setShowForm] = useState(false)

//     const internships = [
//         {
//             logo: "G",
//             title: "Frontend Developer Intern",
//             company: "GrowthTech Solutions",
//             mode: "Remote",
//             duration: "3 Months",
//             stipend: "₹10K / month",
//             skills: ["React", "JavaScript", "CSS"]
//         },
//         {
//             logo: "T",
//             title: "Software Engineering Intern",
//             company: "TechNova Labs",
//             mode: "Hybrid",
//             duration: "6 Months",
//             stipend: "₹15K / month",
//             skills: ["Node.js", "MongoDB", "Git"]
//         },
//         {
//             logo: "D",
//             title: "Data Science Intern",
//             company: "DataSphere AI",
//             mode: "Remote",
//             duration: "4 Months",
//             stipend: "₹12K / month",
//             skills: ["Python", "Pandas", "SQL"]
//         },
//         {
//             logo: "A",
//             title: "AI / ML Intern",
//             company: "Artificial Labs",
//             mode: "On-site",
//             duration: "6 Months",
//             stipend: "₹18K / month",
//             skills: ["Python", "Machine Learning", "AI"]
//         }
//     ];

//     return (
//         <div className="internships-page">

//           {showForm && (
//     <div className="modal-overlay">

//         <div className="opportunity-modal">

//             <div className="modal-header">
//                 <div>
//                     <h2>Share an Opportunity</h2>
//                     <p>Help another student discover an opportunity.</p>
//                 </div>

//                 <button
//                     className="close-modal"
//                     onClick={() => setShowForm(false)}
//                 >
//                     ×
//                 </button>
//             </div>

//             <div className="opportunity-form">

//                 <input
//                     type="text"
//                     placeholder="Opportunity Title"
//                 />

//                 <input
//                     type="text"
//                     placeholder="Company Name"
//                 />

//                 <select>
//                     <option>Select Domain</option>
//                     <option>Web Development</option>
//                     <option>Software Development</option>
//                     <option>Data Science</option>
//                     <option>AI / ML</option>
//                     <option>Cyber Security</option>
//                 </select>

//                 <select>
//                     <option>Select Work Mode</option>
//                     <option>Remote</option>
//                     <option>Hybrid</option>
//                     <option>On-site</option>
//                 </select>

//                 <div className="form-row">

//                     <input
//                         type="text"
//                         placeholder="Duration (e.g. 3 Months)"
//                     />

//                     <input
//                         type="text"
//                         placeholder="Stipend (e.g. ₹10,000/month)"
//                     />

//                 </div>

//                 <input
//                     type="text"
//                     placeholder="Eligibility (e.g. B.Tech CSE)"
//                 />

//                 <input
//                     type="url"
//                     placeholder="Application Link"
//                 />

//                 <input
//                     type="date"
//                 />

//                 <textarea
//                     placeholder="Tell other students about this opportunity..."
//                     rows="4"
//                 ></textarea>

//                 <button className="submit-opportunity">
//                     Share Opportunity
//                 </button>

//             </div>

//         </div>

//     </div>
// )} 

//             <header className="internships-header">
//                 <div>
//                     <h1>Internships</h1>
//                     <p>
//                         Discover opportunities and grow your career.
//                     </p>
//                 </div>
//                 <div className="header-buttons">
//                     <button
//                         className="share-opportunity-btn"
//                         onClick={() => setShowForm(true)}
//                             >
//                         + Share Opportunity
//                         </button>

//                         <button
//                             className="back-btn"
//                             onClick={() => navigate("/dashboard")}
//                         >
//                             ← Dashboard
//                         </button>
//                     </div>
//             </header>

//             <section className="internship-tools">

//                 <div className="search-box">
//                     <span>⌕</span>

//                     <input
//                         type="text"
//                         placeholder="Search internships, skills or companies..."
//                     />
//                 </div>

//                 <select>
//                     <option>All Domains</option>
//                     <option>Web Development</option>
//                     <option>Software Development</option>
//                     <option>Data Science</option>
//                     <option>AI / ML</option>
//                     <option>Cyber Security</option>
//                 </select>

//                 <select>
//                     <option>All Work Modes</option>
//                     <option>Remote</option>
//                     <option>Hybrid</option>
//                     <option>On-site</option>
//                 </select>

//             </section>

//             <div className="section-heading">
//                 <h2>Latest Internships</h2>
//                 <span>{internships.length} opportunities</span>
//             </div>

//             <section className="internship-grid">

//                 {internships.map((internship, index) => (

//                     <div className="internship-card" key={index}>

//                         <div className="company-logo">
//                             {internship.logo}
//                         </div>

//                         <div className="card-content">

//                             <div className="card-top">
//                                 <span className="type">
//                                     INTERNSHIP
//                                 </span>

//                                 <button className="save-btn">
//                                     ♡
//                                 </button>
//                             </div>

//                             <h3>{internship.title}</h3>

//                             <p className="company">
//                                 {internship.company}
//                             </p>

//                             <div className="meta">
//                                 <span>◉ {internship.mode}</span>
//                                 <span>◷ {internship.duration}</span>
//                                 <span>💰 {internship.stipend}</span>
//                             </div>

//                             <div className="tags">
//                                 {internship.skills.map((skill) => (
//                                     <span key={skill}>
//                                         {skill}
//                                     </span>
//                                 ))}
//                             </div>

//                             <button className="view-btn">
//                                 View Opportunity →
//                             </button>

//                         </div>

//                     </div>

//                 ))}

//             </section>

//         </div>
//     );
// }

// export default Internships;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../internship.css";

function Internships() {
    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);

    const [opportunities, setOpportunities] = useState([]);
useEffect(() => {
    const fetchOpportunities = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/opportunities"
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
        link: "",
        deadline: "",
        description: ""
    });

    const internships = [
        {
            logo: "G",
            title: "Frontend Developer Intern",
            company: "GrowthTech Solutions",
            mode: "Remote",
            duration: "3 Months",
            stipend: "₹10K / month",
            skills: ["React", "JavaScript", "CSS"]
        },
        {
            logo: "T",
            title: "Software Engineering Intern",
            company: "TechNova Labs",
            mode: "Hybrid",
            duration: "6 Months",
            stipend: "₹15K / month",
            skills: ["Node.js", "MongoDB", "Git"]
        },
        {
            logo: "D",
            title: "Data Science Intern",
            company: "DataSphere AI",
            mode: "Remote",
            duration: "4 Months",
            stipend: "₹12K / month",
            skills: ["Python", "Pandas", "SQL"]
        },
        {
            logo: "A",
            title: "AI / ML Intern",
            company: "Artificial Labs",
            mode: "On-site",
            duration: "6 Months",
            stipend: "₹18K / month",
            skills: ["Python", "Machine Learning", "AI"]
        }
    ];

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (
        !form.title ||
        !form.company ||
        !form.domain ||
        !form.mode ||
        !form.link
    ) {
        alert("Please fill all required fields.");
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:5000/api/opportunities",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...form,
                    studentName: "You",
                    course: "B.Tech CSE",
                    year: "Student"
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Failed to share opportunity");
            return;
        }

        setOpportunities((prev) => [
            data.opportunity,
            ...prev
        ]);

        setForm({
            title: "",
            company: "",
            domain: "",
            mode: "",
            duration: "",
            stipend: "",
            eligibility: "",
            link: "",
            deadline: "",
            description: ""
        });

        setShowForm(false);

        alert("Opportunity shared successfully! 🎉");

    } catch (error) {
        console.error("SHARE OPPORTUNITY ERROR:", error);

        alert(
            "Unable to connect to server. Please make sure backend is running."
        );
    }
};

const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this opportunity?"
    );

    if (!confirmDelete) return;

    try {
        const response = await fetch(
            `http://localhost:5000/api/opportunities/${id}`,
            {
                method: "DELETE"
            }
        );

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

    return (
        <div className="internships-page">

            {/* Header */}

            <header className="internships-header">

                <div>
                    <h1>Internships</h1>

                    <p>
                        Discover opportunities and grow your career.
                    </p>
                </div>

                <div className="header-buttons">

                    <button
                        className="share-opportunity-btn"
                        onClick={() => setShowForm(true)}
                    >
                        + Share Opportunity
                    </button>

                    <button
                        className="back-btn"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Dashboard
                    </button>

                </div>

            </header>


            {/* Search + Filters */}

            <section className="internship-tools">

                <div className="search-box">

                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search internships, skills or companies..."
                    />

                </div>

                <select>
                    <option>All Domains</option>
                    <option>Web Development</option>
                    <option>Software Development</option>
                    <option>Data Science</option>
                    <option>AI / ML</option>
                    <option>Cyber Security</option>
                </select>

                <select>
                    <option>All Work Modes</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>On-site</option>
                </select>

            </section>


            {/* Latest Internships */}

            <div className="section-heading">

                <h2>Latest Internships</h2>

                <span>
                    {internships.length} opportunities
                </span>

            </div>


            <section className="internship-grid">

                {internships.map((internship, index) => (

                    <div
                        className="internship-card"
                        key={index}
                    >

                        <div className="company-logo">
                            {internship.logo}
                        </div>

                        <div className="card-content">

                            <div className="card-top">

                                <span className="type">
                                    INTERNSHIP
                                </span>

                                <button className="save-btn">
                                    ♡
                                </button>

                            </div>

                            <h3>
                                {internship.title}
                            </h3>

                            <p className="company">
                                {internship.company}
                            </p>

                            <div className="meta">

                                <span>
                                    ◉ {internship.mode}
                                </span>

                                <span>
                                    ◷ {internship.duration}
                                </span>

                                <span>
                                    💰 {internship.stipend}
                                </span>

                            </div>

                            <div className="tags">

                                {internship.skills.map(
                                    (skill) => (
                                        <span key={skill}>
                                            {skill}
                                        </span>
                                    )
                                )}

                            </div>

                            <button className="view-btn">
                                View Opportunity →
                            </button>

                        </div>

                    </div>

                ))}

            </section>


            {/* Student Shared Opportunities */}

            {opportunities.length > 0 && (

                <section className="student-shared-section">

                    <div className="section-heading">

                        <div>
                            <span className="shared-label">
                                STUDENT NETWORK
                            </span>

                            <h2>
                                Student Shared Opportunities
                            </h2>
                        </div>

                        <span>
                            {opportunities.length} shared
                        </span>

                    </div>


                    <div className="shared-opportunity-grid">

                        {opportunities.map(
                            (opportunity) => (

                                <div
                                    className="shared-opportunity-card"
                                    key={opportunity.id}
                                >

                                    <div className="shared-card-top">

                                        <div className="student-avatar">
                                            Y
                                        </div>

                                        <div>
                                            <strong>
                                                {opportunity.studentName}
                                            </strong>

                                            <p>
                                                {opportunity.course}
                                            </p>
                                        </div>

                                        <span className="shared-badge">
                                            STUDENT SHARED
                                        </span>

                                    </div>


                                    <h3>
                                        {opportunity.title}
                                    </h3>

                                    <p className="company">
                                        {opportunity.company}
                                    </p>


                                    <div className="meta">

                                        <span>
                                            ◉ {opportunity.mode}
                                        </span>

                                        <span>
                                            ◷ {opportunity.duration}
                                        </span>

                                        <span>
                                            💰 {opportunity.stipend}
                                        </span>

                                    </div>


                                    <div className="tags">

                                        <span>
                                            {opportunity.domain}
                                        </span>

                                        <span>
                                            {opportunity.eligibility}
                                        </span>

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
                                    <button
                                        className="delete-opportunity-btn"
                                        onClick={() => handleDelete(opportunity._id)}
                                        >
                                        🗑 Delete Opportunity
                                    </button>

                                </div>

                            )
                        )}

                    </div>

                </section>

            )}


            {/* Share Opportunity Modal */}

            {showForm && (

                <div className="modal-overlay">

                    <div className="opportunity-modal">

                        <div className="modal-header">

                            <div>

                                <h2>
                                    Share an Opportunity
                                </h2>

                                <p>
                                    Help another student discover an opportunity.
                                </p>

                            </div>

                            <button
                                className="close-modal"
                                onClick={() => setShowForm(false)}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            className="opportunity-form"
                            onSubmit={handleSubmit}
                        >

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
                                <option value="">
                                    Select Domain *
                                </option>

                                <option>
                                    Web Development
                                </option>

                                <option>
                                    Software Development
                                </option>

                                <option>
                                    Data Science
                                </option>

                                <option>
                                    AI / ML
                                </option>

                                <option>
                                    Cyber Security
                                </option>

                            </select>


                            <select
                                name="mode"
                                value={form.mode}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select Work Mode *
                                </option>

                                <option>
                                    Remote
                                </option>

                                <option>
                                    Hybrid
                                </option>

                                <option>
                                    On-site
                                </option>

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


                            <button
                                type="submit"
                                className="submit-opportunity"
                            >
                                Share Opportunity
                            </button>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Internships;