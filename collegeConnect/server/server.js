const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Opportunity = require("./models/Opportunity");
const Guidance = require("./models/Guidance");
const Answer = require("./models/Answer");
const Application = require("./models/Application");
const SavedOpportunity = require("./models/SavedOpportunity");
const bcrypt = require("bcryptjs");

const app = express();

// Escape regex special chars
const escapeRegex = (text = "") => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

// Comma ya bracket ke baad ka city/branch ignore karega
const normalizeCollege = (value = "") => {
  return value
    .toString()
    .split(",")[0]
    .split("(")[0]
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

const normalizeText = (value = "") => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

// Universal Course Family Matching
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
  if (clean.includes("bsc")) return "bsc";
  if (clean.includes("bcom")) return "bcom";

  return clean;
};

const coursesMatch = (courseA, courseB) => {
  if (!courseA || !courseB) return false;
  return getCourseFamily(courseA) === getCourseFamily(courseB);
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "College Connect Backend is running 🚀" });
});

// Signup API
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, college, course, year } = req.body;
    if (!name || !email || !password || !college || !course || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User({ name, email, password, college, course, year });
    await user.save();

    res.status(201).json({
      message: "User registered successfully ✅",
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        year: user.year
      }
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login API
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful ✅",
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        year: user.year,
        bio: user.bio || "",
        skills: user.skills || [],
        github: user.github || "",
        linkedin: user.linkedin || "",
        resume: user.resume || ""
      }
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update Profile API
app.put("/api/users/update-profile/:id", async (req, res) => {
  try {
    const { name, college, course, year, bio, skills, github, linkedin, resume } = req.body;

    let parsedSkills = [];
    if (Array.isArray(skills)) {
      parsedSkills = skills;
    } else if (typeof skills === "string") {
      parsedSkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name: name.trim() }),
        ...(college && { college: college.trim() }),
        ...(course && { course: course.trim() }),
        ...(year && { year: Number(year) }),
        bio: bio || "",
        skills: parsedSkills,
        github: github || "",
        linkedin: linkedin || "",
        resume: resume || ""
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully ✅",
      user: {
        id: updatedUser._id,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        college: updatedUser.college,
        course: updatedUser.course,
        year: updatedUser.year,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        github: updatedUser.github,
        linkedin: updatedUser.linkedin,
        resume: updatedUser.resume
      }
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
});

// Dashboard Stats API
app.get("/api/users/dashboard-stats/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const [applicationsCount, savedCount] = await Promise.all([
      Application.countDocuments({ userId }).catch(() => 0),
      SavedOpportunity.countDocuments({ userId }).catch(() => 0)
    ]);

    res.status(200).json({ applicationsCount, savedCount });
  } catch (error) {
    console.error("Stats fetch error:", error);
    res.status(500).json({ message: "Server error fetching stats" });
  }
});

// Share Opportunity API
app.post("/api/opportunities", async (req, res) => {
  try {
    const {
      title, company, domain, mode, duration, stipend,
      eligibility, eligibleCourses, link, deadline, description,
      studentName, college, course, year, userId
    } = req.body;

    if (!title || !company || !domain || !mode || !link || !userId) {
      return res.status(400).json({
        message: "Title, company, domain, mode and link are required"
      });
    }

    const opportunity = new Opportunity({
      title, company, domain, mode, duration, stipend,
      eligibility, eligibleCourses, link, deadline, description,
      studentName, college, course, year, userId
    });

    await opportunity.save();

    res.status(201).json({
      message: "Opportunity shared successfully",
      opportunity
    });
  } catch (error) {
    console.error("OPPORTUNITY ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Opportunities API (Smart Course Matching)
app.get("/api/opportunities", async (req, res) => {
  try {
    const { course } = req.query;
    const opportunities = await Opportunity.find().sort({ createdAt: -1 });

    if (!course) {
      return res.status(200).json(opportunities);
    }

    const userFamily = getCourseFamily(course);
    const filtered = opportunities.filter((item) => {
      const list = item.eligibleCourses || [];
      if (list.length === 0) return true;
      return list.some((c) => getCourseFamily(c) === userFamily);
    });

    res.status(200).json(filtered);
  } catch (error) {
    console.error("GET OPPORTUNITIES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Edit Opportunity API
app.put("/api/opportunities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, ...updates } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User ID is required" });
    }

    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (opportunity.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only edit your own opportunity" });
    }

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      message: "Opportunity updated successfully",
      opportunity: updatedOpportunity
    });
  } catch (error) {
    console.error("EDIT OPPORTUNITY ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Opportunity API
app.delete("/api/opportunities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User ID is required" });
    }

    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (opportunity.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own opportunity" });
    }

    await Opportunity.findByIdAndDelete(id);
    res.status(200).json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    console.error("DELETE OPPORTUNITY ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Guidance Questions API (Sabhi questions dikhayega bina year block kiye)
app.get("/api/guidance", async (req, res) => {
  try {
    const { college, course, userId } = req.query;

    if (!college || !course) {
      return res.status(400).json({ message: "College and course are required" });
    }

    const normalizedCollege = normalizeCollege(college);

    // 1. Own questions
    const ownQuestions = userId
      ? await Guidance.find({ userId }).sort({ createdAt: -1 })
      : [];

    // 2. Questions from same college
    // Other questions: Same college + question ka year chhota ya barabar hona chahiye (<= currentYear)
const otherQuestions = await Guidance.find({
  userId: { $ne: userId },
  $expr: {
    $and: [
      {
        $regexMatch: {
          input: { $ifNull: ["$college", ""] },
          regex: normalizedCollege,
          options: "i"
        }
      },
      {
        $lte: [
          {
            $convert: {
              input: "$year",
              to: "int",
              onError: -1,
              onNull: -1
            }
          },
          currentYear // Sirf junior aur peer ke sawal aayenge
        ]
      }
    ]
  }
}).sort({ createdAt: -1 });
    // 3. Course family matching
    const matchingQuestions = otherQuestions.filter((item) =>
      coursesMatch(course, item.course)
    );

    const all = [...ownQuestions, ...matchingQuestions];
    const uniqueQuestions = Array.from(
      new Map(all.map((q) => [q._id.toString(), q])).values()
    );

    res.status(200).json(uniqueQuestions);
  } catch (error) {
    console.error("GET GUIDANCE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Post Guidance Question
app.post("/api/guidance", async (req, res) => {
  try {
    const { question, category, studentName, college, course, year, userId } = req.body;
    if (!question || !category || !studentName || !college || !course || !year || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newQuestion = new Guidance({
      question,
      category,
      studentName,
      college,
      course,
      year: Number(year),
      userId
    });

    await newQuestion.save();
    res.status(201).json({ message: "Question posted successfully", question: newQuestion });
  } catch (error) {
    console.error("POST GUIDANCE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Post Answer to Guidance
app.post("/api/guidance/:guidanceId/answers", async (req, res) => {
  try {
    const { guidanceId } = req.params;
    const { answer, studentName, college, course, year, userId } = req.body;

    if (!answer || !studentName || !college || !course || !year || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const guidance = await Guidance.findById(guidanceId);
    if (!guidance) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (
      normalizeCollege(guidance.college) !== normalizeCollege(college) ||
      !coursesMatch(guidance.course, course) ||
      Number(year) <= Number(guidance.year)
    ) {
      return res.status(403).json({
        message: "Only eligible seniors can answer this question"
      });
    }

    const newAnswer = new Answer({
      guidanceId,
      answer,
      studentName,
      college,
      course,
      year,
      userId
    });

    await newAnswer.save();
    await Guidance.findByIdAndUpdate(guidanceId, { status: "Answered" });

    res.status(201).json({
      message: "Answer posted successfully",
      answer: newAnswer
    });
  } catch (error) {
    console.error("POST ANSWER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/guidance/:guidanceId/answers", async (req, res) => {
  try {
    const { guidanceId } = req.params;
    const answers = await Answer.find({ guidanceId }).sort({ createdAt: 1 });
    res.status(200).json(answers);
  } catch (error) {
    console.error("GET ANSWERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });