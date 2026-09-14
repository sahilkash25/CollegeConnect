const mongoose = require("mongoose");

const savedOpportunitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, 
    ref: "User", required: true },
    
    title: { type: String, 
    required: true },
    
    company: { type: String, 
    required: true },
    
    link: { type: String, 
    default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedOpportunity", savedOpportunitySchema);