

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();


const User = require("./models/User");
const Opportunity = require("./models/Opportunity");
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
      link,
      deadline,
      description,
      studentName,
      course,
      year
    } = req.body;

    if (!title || !company || !domain || !mode || !link) {
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
      link,
      deadline,
      description,
      studentName,
      course,
      year
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


// Get All Opportunities API
app.get("/api/opportunities", async (req, res) => {
  try {
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

    const deletedOpportunity = await Opportunity.findByIdAndDelete(id);

    if (!deletedOpportunity) {
      return res.status(404).json({
        message: "Opportunity not found"
      });
    }

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