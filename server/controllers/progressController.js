// =========================================
// STUDENT OS — PROGRESS CONTROLLER
// =========================================

const Assignment = require("../models/Assignment");
const Skill = require("../models/Skill");
const StudentSkill = require("../models/StudentSkill");
const CareerGoal = require("../models/CareerGoal");

const {
  calculateSkillGaps,
} = require("../services/skillGapEngine");

const {
  calculateProgress,
} = require("../services/progressEngine");


// =========================================
// GET PROGRESS
// =========================================

const getProgress = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }


    // =========================================
    // FETCH ACADEMIC DATA
    // =========================================

    const assignments =
      await Assignment.find({
        firebaseUid,
      }).sort({
        dueDate: 1,
      });


    // =========================================
    // FETCH ACTIVE CAREER GOAL
    // =========================================

    const careerGoal =
      await CareerGoal.findOne({
        firebaseUid,
        isActive: true,
      });


    let skillGaps = [];


    // =========================================
    // FETCH CAREER SKILL DATA
    // =========================================

    if (careerGoal) {

      const skills =
        await Skill.find({
          career: careerGoal.career,
        });

      const studentSkills =
        await StudentSkill.find({
          firebaseUid,
        });

      skillGaps =
        calculateSkillGaps(
          skills,
          studentSkills
        );
    }


    // =========================================
    // CALCULATE PROGRESS
    // =========================================

    const progress =
      calculateProgress({
        assignments,
        skillGaps,
        career:
          careerGoal?.career || null,
      });


    // =========================================
    // RESPONSE
    // =========================================

    return res.status(200).json({
      success: true,

      data: {
        academic:
          progress.academic,

        career:
          progress.career,

        overall:
          progress.overall,

        insight:
          progress.insight,

        careerGoal:
          careerGoal
            ? {
                career:
                  careerGoal.career,
                description:
                  careerGoal.description,
              }
            : null,
      },
    });

  } catch (error) {

    console.error(
      "Progress controller error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to calculate student progress",
      error:
        error.message,
    });
  }
};


module.exports = {
  getProgress,
};