const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    company: {
      type: String,
      required: true,
      trim: true
    },

    domain: {
      type: String,
      required: true
    },

    mode: {
      type: String,
      required: true
    },

    duration: {
      type: String,
      default: ""
    },

    stipend: {
      type: String,
      default: ""
    },

    eligibility: {
      type: String,
      default: ""
    },
    
    eligibileCourses: {
      type: [String],
      default: []
    },

    link: {
      type: String,
      required: true
    },

    deadline: {
      type: String,
      default: ""
    },

    description: {
      type: String,
      default: ""
    },

    studentName: {
      type: String,
      default: "Student"
    },

    college: {
      type: String,
      default: ""
    },

    course: {
      type: String,
      default: ""
    },

    year: {
      type: String,
      default: ""
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);