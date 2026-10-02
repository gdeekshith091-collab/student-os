const Assignment = require("../models/Assignment");
const Exam = require("../models/Exam");
const Skill = require("../models/Skill");
const StudentSkill = require("../models/StudentSkill");
const CareerGoal = require("../models/CareerGoal");
const StudySession = require("../models/StudySession");
const Attendance = require("../models/Attendance");

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
  calculateOverallAttendanceRisk,
} = require("../services/attendanceRiskEngine");

const {
  calculateAcademicRisk,
} = require("../services/academicRiskEngine");

const {
  calculateAcademicHealth,
} = require("../services/academicHealthEngine");


// =========================================
// GET DYNAMIC PRIORITY
// =========================================

const getDynamicPriority = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }


    // =========================================
    // ASSIGNMENTS
    // =========================================

    const assignments =
      await Assignment.find({
        firebaseUid,
      }).sort({
        dueDate: 1,
      });


    // =========================================
    // ACADEMIC RISK
    // =========================================

    const academicRisk =
      calculateAcademicRisk(
        assignments
      );


    // =========================================
    // EXAMS
    // =========================================

    const exams =
      await Exam.find({
        firebaseUid,
      }).sort({
        examDate: 1,
      });


    // =========================================
    // CAREER GOAL
    // =========================================

    const careerGoal =
      await CareerGoal.findOne({
        firebaseUid,
        isActive: true,
      });


    // =========================================
    // SKILL GAPS
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
    // STUDY SESSIONS
    // =========================================

    const studySessions =
      await StudySession.find({
        firebaseUid,
      }).sort({
        createdAt: -1,
      });


    // =========================================
    // BEHAVIOR
    // =========================================

    const behavior =
      analyzeBehavior(
        studySessions
      );


    // =========================================
    // ATTENDANCE
    // =========================================

    const attendanceRecords =
      await Attendance.find({
        firebaseUid,
      }).sort({
        subject: 1,
      });

    const attendanceRisk =
      calculateOverallAttendanceRisk(
        attendanceRecords
      );


    // =========================================
    // ACADEMIC HEALTH
    // =========================================

    const academicHealth =
      calculateAcademicHealth({
        academicRisk,
        attendanceRisk,
        assignments,
        exams,
      });


    // =========================================
    // DYNAMIC PRIORITY
    // =========================================

    const result =
      calculateDynamicPriority({
        assignments,
        exams,
        skillGaps,
        behavior,
        attendanceRisk,
      });


    // =========================================
    // SESSION PLAN
    // =========================================

    const sessionPlan =
      createSessionPlan(
        result.recommendation,
        behavior
      );


    // =========================================
    // RESPONSE
    // =========================================

    return res.status(200).json({
      success: true,

      data: {
        recommendation:
          result.recommendation,

        rankedCandidates:
          result.rankedCandidates,

        sessionPlan,

        career:
          careerGoal?.career || null,

        behavior,

        behaviorUsed:
          result.behaviorUsed,

        academicRisk,

        attendanceRisk,

        attendanceUsed:
          result.attendanceUsed,

        academicHealth,

        examsCount:
          exams.length,

        assignmentsCount:
          assignments.length,
      },
    });

  } catch (error) {
    console.error(
      "Dynamic priority controller error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to calculate dynamic priority",
      error:
        error.message,
    });
  }
};


module.exports = {
  getDynamicPriority,
};