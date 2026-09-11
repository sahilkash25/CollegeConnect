const mongoose = require("mongoose");

const guidanceSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        studentName: {
            type: String,
            required: true,
            
        },
        college: {
            type: String,
            required: true,
            
        },
        course: {
            type: String,
            required: true,
            
        },
        year: {
            type: String,
            required: true,
            
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            
        },
        status: {
            type: String,
            enum: ["Unanswered", "Answered"],
            default: "Unanswered"
        }

    },
    {timestamps: true}
);

module.exports = mongoose.model("Guidance", guidanceSchema);
