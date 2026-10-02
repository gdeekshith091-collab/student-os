const mongoose = require("mongoose");

const studentSkillSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      index: true,
    },

    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    assessed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

studentSkillSchema.index(
  { firebaseUid: 1, skillId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "StudentSkill",
  studentSkillSchema
);