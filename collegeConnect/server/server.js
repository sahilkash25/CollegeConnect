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
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "College Connect Backend is running 🚀"
  });
});

// Signup API
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, college, course, year } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password || !college || !course || !year) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      college,
      course,
      year
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully ✅",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        year: user.year
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});



// Login API
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.status(200).json({
      message: "Login successful ✅",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        year: user.year
      }
    });

  } catch (error) {
  console.error("SIGNUP ERROR:", error);

  res.status(500).json({
    message: error.message
  });
}
});


// Share Opportunity API
app.post("/api/opportunities", async (req, res) => {
  try {
    const {
      title,
      company,
      domain,
      mode,
      duration,
      stipend,
      eligibility,
      eligibleCourses,
      link,
      deadline,
      description,
      studentName,
      college,
      course,
      year,
	userId
    } = req.body;

    if (!title || !company || !domain || !mode || !link || !userId) {
      return res.status(400).json({
        message: "Title, company, domain, mode and link are required"
      });
    }

    const opportunity = new Opportunity({
      title,
      company,
      domain,
      mode,
      duration,
      stipend,
      eligibility,
      eligibleCourses,
      link,
      deadline,
      description,
      studentName,
      college,
      course,
      year,
	userId
    });

    await opportunity.save();

    res.status(201).json({
      message: "Opportunity shared successfully",
      opportunity
    });

  } catch (error) {
    console.error("OPPORTUNITY ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

app.post("/api/guidance", async (req, res) => {
  try{
    const{
      question,
      category,
      studentName,
      college,
      course,
      year,
      userId
    } = req.body;
    
    if(!question || !category || !studentName || !college || !course || !year || !userId ){
      return res.status(400).json({
        message: "All fields are required"
      });
    }
    const guidance = new Guidance({
      question,
      category,
      studentName,
      college,
      course,
      year,
      userId

    });
    
    await guidance.save();

    res.status(201).json({
      message: "Question posted successfully",
      guidance
    });

  }catch (error) {
    console.error("POST GUIDANCE ERROR:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
});
app.get("/api/guidance", async (req, res) => {
    try {
        const { college, course, year, userId } = req.query;

        if (!college || !course || !year || !userId) {
            return res.status(400).json({
                message: "College, course, year and userId are required"
            });
        }

        const currentYear = Number(year);

        // Check current user's own questions
        const ownQuestions = await Guidance.find({
            userId: userId
        }).sort({ createdAt: -1 });

        // Questions asked by juniors
        const juniorQuestions = await Guidance.find({
            college: { $regex: `^${college}$`, $options: "i" },
            course: { $regex: `^${course}$`, $options: "i" },
            year: { $lt: currentYear },
            userId: { $ne: userId }
        }).sort({ createdAt: -1 });

        // If student is in an early year, there may be no juniors
        const questions = [
            ...ownQuestions,
            ...juniorQuestions
        ];

        res.status(200).json(questions);

    } catch (error) {
        console.error("GET GUIDANCE ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

app.post("/api/guidance/:guidanceId/answers", async (req, res) => {
    try {
        const { guidanceId } = req.params;

        const {
            answer,
            studentName,
            college,
            course,
            year,
            userId
        } = req.body;

        if (
            !answer ||
            !studentName ||
            !college ||
            !course ||
            !year ||
            !userId
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const guidance = await Guidance.findById(guidanceId);

        if (!guidance) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        // Only higher-year students can answer
        if (
            guidance.college?.toLowerCase() !== college?.toLowerCase() ||
            guidance.course?.toLowerCase() !== course?.toLowerCase() ||
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
        await Guidance.findByIdAndUpdate(
          guidanceId,
          { status: "Answered" }
        );

        res.status(201).json({
            message: "Answer posted successfully",
            answer: newAnswer
        });

    } catch (error) {
        console.error("POST ANSWER ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


app.get("/api/guidance/:guidanceId/answers", async (req, res) => {
    try {
        const { guidanceId } = req.params;

        const answers = await Answer.find({
            guidanceId
        }).sort({ createdAt: 1 });

        res.status(200).json(answers);

    } catch (error) {
        console.error("GET ANSWERS ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// Get All Opportunities API
app.get("/api/opportunities", async (req, res) => {
  try {

     const { course } = req.query;
     let filter = {};

     if (course) {
      filter = {
        eligibleCourse: {
          $in: [course]
        }
      };
     }
    const opportunities = await Opportunity
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json(opportunities);

  } catch (error) {
    console.error("GET OPPORTUNITIES ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});




// Delete Opportunity API
app.delete("/api/opportunities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "User ID is required"
      });
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found"
      });
    }

    // Only the student who created the opportunity can delete it
    if (opportunity.userId.toString() !== userId) {
      return res.status(403).json({
        message: "You can only delete your own opportunity"
      });
    }

    await Opportunity.findByIdAndDelete(id);

    res.status(200).json({
      message: "Opportunity deleted successfully"
    });

  } catch (error) {
    console.error("DELETE OPPORTUNITY ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});



// Edit Opportunity API
app.put("/api/opportunities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, ...updates } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "User ID is required"
      });
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found"
      });
    }

    // Only the student who created the opportunity can edit it
    if (opportunity.userId.toString() !== userId) {
      return res.status(403).json({
        message: "You can only edit your own opportunity"
      });
    }

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Opportunity updated successfully",
      opportunity: updatedOpportunity
    });

  } catch (error) {
    console.error("EDIT OPPORTUNITY ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});





const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
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