const CareerGoal = require("../models/CareerGoal");
const Skill = require("../models/Skill");
const StudentSkill = require("../models/StudentSkill");

const {
  calculateSkillGaps,
  getNextSkill,
} = require("../services/skillGapEngine");

const getSkillGaps = async (req, res, next) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    // Get student's active career goal
    const careerGoal = await CareerGoal.findOne({
      firebaseUid,
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    if (!careerGoal) {
      return res.status(404).json({
        success: false,
        message: "No active career goal found",
      });
    }

    // Get required skills for the career
    const skills = await Skill.find({
      career: {
        $regex: `^${careerGoal.career}$`,
        $options: "i",
      },
    }).sort({
      importance: -1,
    });

    if (skills.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No skills found for this career",
      });
    }

    // Get student's assessed skills
    const studentSkills = await StudentSkill.find({
      firebaseUid,
    });

    // Calculate skill gaps
    const skillGaps = calculateSkillGaps(
      skills,
      studentSkills
    );

    // Find the highest-priority skill gap
    const nextSkill = getNextSkill(skillGaps);

    res.status(200).json({
      success: true,
      data: {
        career: careerGoal.career,
        skillGaps,
        nextSkill,
      },
      message: "Skill gaps calculated successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkillGaps,
};