const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, 
    ref: "User", required: true },

    role: { type: String, 
    required: true },
    
    company: { type: String, 
    required: true },
    
    status: {
      type: String,
      enum: ["Applied", "Reviewing", "Interview", "Accepted", "Rejected"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);