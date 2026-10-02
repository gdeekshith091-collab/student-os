// =========================================
// STUDENT OS — ACADEMIC HEALTH ENGINE
// =========================================

const calculateAcademicHealth = ({
  academicRisk = {},
  attendanceRisk = {},
  assignments = [],
  exams = [],
}) => {

  // Academic Risk
  const academicRiskLevel =
    academicRisk.level || "Low";

  const academicRiskScore =
    academicRisk.score || 0;


  // Attendance Risk
  const attendanceRiskLevel =
    attendanceRisk.overallRisk || "Low";

  const attendanceRiskScore =
    attendanceRisk.overallScore || 0;


  // Pending Assignments
  const pendingAssignments =
    assignments.filter(
      (assignment) =>
        assignment.status !== "Completed"
    );


  // Upcoming Exams
  const upcomingExams =
    exams.filter(
      (exam) =>
        exam.status !== "Completed"
    );


  // Combined Health Score
  const healthScore = Math.round(
    academicRiskScore * 0.6 +
      attendanceRiskScore * 0.4
  );


  // Health Level
  let healthLevel = "Good";

  if (healthScore >= 70) {
    healthLevel = "High Risk";
  } else if (healthScore >= 40) {
    healthLevel = "Needs Attention";
  }


  // Reasons
  const reasons = [];


  if (academicRiskLevel !== "Low") {
    reasons.push(
      `Academic workload risk is ${academicRiskLevel.toLowerCase()}.`
    );
  }


  if (attendanceRiskLevel !== "Low") {
    reasons.push(
      `Attendance risk is ${attendanceRiskLevel.toLowerCase()}.`
    );
  }


  if (pendingAssignments.length > 0) {
    reasons.push(
      `${pendingAssignments.length} assignment${
        pendingAssignments.length > 1
          ? "s are"
          : " is"
      } still pending.`
    );
  }


  if (upcomingExams.length > 0) {
    reasons.push(
      `${upcomingExams.length} upcoming exam${
        upcomingExams.length > 1
          ? "s"
          : ""
      } require attention.`
    );
  }


  if (reasons.length === 0) {
    reasons.push(
      "Your academic workload and attendance are currently under control."
    );
  }


  return {
    healthLevel,
    healthScore,

    academicRisk: {
      level: academicRiskLevel,
      score: academicRiskScore,
    },

    attendanceRisk: {
      level: attendanceRiskLevel,
      score: attendanceRiskScore,
    },

    pendingAssignments:
      pendingAssignments.length,

    upcomingExams:
      upcomingExams.length,

    reasons,
  };
};


module.exports = {
  calculateAcademicHealth,
};