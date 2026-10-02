const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      index: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    examDate: {
      type: Date,
      required: true,
    },

    examType: {
      type: String,
      enum: [
        "Internal",
        "Midterm",
        "Semester",
        "Practical",
        "Other",
      ],
      default: "Semester",
    },

    importance: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "High",
    },

    status: {
      type: String,
      enum: ["Upcoming", "Completed"],
      default: "Upcoming",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exam", examSchema);