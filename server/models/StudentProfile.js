const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    college: {
      type: String,
      default: "",
      trim: true,
    },

    course: {
      type: String,
      default: "",
      trim: true,
    },

    semester: {
      type: String,
      default: "",
      trim: true,
    },

    careerGoal: {
      type: String,
      default: "",
      trim: true,
    },

    profilePhotoUrl: {
      type: String,
      default: "",
      trim: true,
    },

    preferences: {
      font: {
        type: String,
        default: "Inter",
      },

      fontSize: {
        type: String,
        enum: ["Small", "Medium", "Large"],
        default: "Medium",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);