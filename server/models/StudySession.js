const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["academic", "exam", "career"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    durationMinutes: {
      type: Number,
      default: 45,
      min: 1,
    },

    status: {
      type: String,
      enum: [
        "Planned",
        "In Progress",
        "Completed",
      ],
      default: "Planned",
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "StudySession",
  studySessionSchema
);