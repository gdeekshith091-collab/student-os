const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      index: true,
    },

    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    startTime: {
      type: String,
      required: true,
      trim: true,
    },

    endTime: {
      type: String,
      required: true,
      trim: true,
    },

    room: {
      type: String,
      default: "",
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Lecture",
        "Lab",
        "Tutorial",
        "Other",
      ],
      default: "Lecture",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Timetable",
  timetableSchema
);