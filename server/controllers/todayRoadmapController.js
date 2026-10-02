// =========================================
// STUDENT OS — TODAY'S ROADMAP CONTROLLER
// =========================================

const Assignment = require("../models/Assignment");
const Exam = require("../models/Exam");
const Skill = require("../models/Skill");
const StudentSkill = require("../models/StudentSkill");
const CareerGoal = require("../models/CareerGoal");
const StudySession = require("../models/StudySession");

const {
  calculateSkillGaps,
} = require("../services/skillGapEngine");

const {
  calculateDynamicPriority,
} = require("../services/dynamicPriorityEngine");

const {
  createSessionPlan,
} = require("../services/sessionPlanner");

const {
  analyzeBehavior,
} = require("../services/behaviorEngine");

const {
  createTodayRoadmap,
} = require("../services/todayRoadmapEngine");


// =========================================
// GET TODAY'S ROADMAP
// =========================================

const getTodayRoadmap = async (req, res) => {

  try {

    const { firebaseUid } = req.params;


    // =========================================
    // VALIDATE USER
    // =========================================

    if (!firebaseUid) {

      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });

    }


    // =========================================
    // FETCH ASSIGNMENTS
    // =========================================

    const assignments =
      await Assignment.find({
        firebaseUid,
      }).sort({
        dueDate: 1,
      });

      const exams =
  await Exam.find({
    firebaseUid,
  }).sort({
    examDate: 1,
  });


    // =========================================
    // FETCH CAREER GOAL
    // =========================================

    const careerGoal =
      await CareerGoal.findOne({
        firebaseUid,
        isActive: true,
      });


    // =========================================
    // FETCH SKILL GAPS
    // =========================================

    let skillGaps = [];


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
    // FETCH STUDY SESSIONS
    // =========================================

    const studySessions =
      await StudySession.find({
        firebaseUid,
      }).sort({
        createdAt: -1,
      });


    // =========================================
    // ANALYZE BEHAVIOR
    // =========================================

    const behavior =
      analyzeBehavior(
        studySessions
      );


    // =========================================
    // CALCULATE DYNAMIC PRIORITY
    // =========================================

    const priorityResult =
      calculateDynamicPriority({
        assignments,
        exams,
        skillGaps,
        behavior,
      });


    // =========================================
    // CREATE SESSION PLAN
    // =========================================

    const sessionPlan =
      createSessionPlan(
        priorityResult.recommendation,
        behavior
      );


    // =========================================
    // CREATE TODAY'S ROADMAP
    // =========================================

    const roadmap =
      createTodayRoadmap({
        recommendation:
          priorityResult.recommendation,

        rankedCandidates:
          priorityResult.rankedCandidates,

        sessionPlan,

        behavior,
      });


    // =========================================
    // RESPONSE
    // =========================================

    return res.status(200).json({

      success: true,

      data: {

        roadmap,

        career:
          careerGoal?.career || null,

        behavior,

        recommendation:
          priorityResult.recommendation,

        sessionPlan,

      },

    });

  } catch (error) {

    console.error(
      "Today's roadmap controller error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to generate today's roadmap",

      error:
        error.message,

    });

  }

};


// =========================================
// EXPORT
// =========================================

module.exports = {
  getTodayRoadmap,
};