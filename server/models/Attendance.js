const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
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

    attendedClasses: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    totalClasses: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    minimumRequired: {
      type: Number,
      default: 75,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Attendance",
  attendanceSchema
);