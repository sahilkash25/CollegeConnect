const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
    {
        guidanceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Guidance",
            required: true
        },

        answer: {
            type: String,
            required: true,
            trim: true
        },

        studentName: {
            type: String,
            required: true
        },

        college: {
            type: String,
            required: true
        },

        course: {
            type: String,
            required: true
        },

        year: {
            type: Number,
            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Answer", answerSchema);