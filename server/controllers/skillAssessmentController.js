const StudentSkill = require("../models/StudentSkill");
const Skill = require("../models/Skill");

const saveSkillAssessment = async (req, res, next) => {
  try {
    const {
      firebaseUid,
      skillId,
      score,
    } = req.body;

    if (
      !firebaseUid ||
      !skillId ||
      score === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Firebase UID, skill ID, and score are required",
      });
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: "Score must be between 0 and 100",
      });
    }

    const skill = await Skill.findById(skillId);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    const studentSkill =
      await StudentSkill.findOneAndUpdate(
        {
          firebaseUid,
          skillId,
        },
        {
          firebaseUid,
          skillId,
          score,
          assessed: true,
        },
        {
          new: true,
          upsert: true,
        }
      );

    res.status(200).json({
      success: true,
      data: studentSkill,
      message: "Skill assessment saved successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getStudentSkills = async (req, res, next) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    const studentSkills =
      await StudentSkill.find({
        firebaseUid,
      }).populate("skillId");

    res.status(200).json({
      success: true,
      data: studentSkills,
      message:
        "Student skill assessments fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveSkillAssessment,
  getStudentSkills,
};