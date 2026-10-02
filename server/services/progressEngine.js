// =========================================
// STUDENT OS — PROGRESS INTELLIGENCE ENGINE
// =========================================


// =========================================
// ACADEMIC PROGRESS
// =========================================

const calculateAcademicProgress = (
  assignments = []
) => {
  const totalAssignments =
    assignments.length;

  if (totalAssignments === 0) {
    return {
      totalAssignments: 0,
      completedAssignments: 0,
      pendingAssignments: 0,
      completionPercentage: 0,
    };
  }

  const completedAssignments =
    assignments.filter(
      (assignment) =>
        assignment.status === "Completed"
    ).length;

  const pendingAssignments =
    totalAssignments -
    completedAssignments;

  const completionPercentage =
    Math.round(
      (completedAssignments /
        totalAssignments) *
        100
    );

  return {
    totalAssignments,
    completedAssignments,
    pendingAssignments,
    completionPercentage,
  };
};


// =========================================
// CAREER PROGRESS
// =========================================

const calculateCareerProgress = (
  skillGaps = []
) => {

  if (skillGaps.length === 0) {
    return {
      totalSkills: 0,
      assessedSkills: 0,
      averageSkillScore: 0,
      averageSkillGap: 0,
      completionPercentage: 0,
      biggestGap: null,
    };
  }

  const totalSkills =
    skillGaps.length;

  const assessedSkills =
    skillGaps.filter(
      (skill) =>
        skill.currentScore > 0
    ).length;

  const totalScore =
    skillGaps.reduce(
      (sum, skill) =>
        sum + (skill.currentScore || 0),
      0
    );

  const totalGap =
    skillGaps.reduce(
      (sum, skill) =>
        sum + (skill.gap || 0),
      0
    );

  const averageSkillScore =
    Math.round(
      totalScore / totalSkills
    );

  const averageSkillGap =
    Math.round(
      totalGap / totalSkills
    );

  const completionPercentage =
    averageSkillScore;

  const sortedGaps =
    [...skillGaps].sort(
      (a, b) =>
        (b.gap || 0) -
        (a.gap || 0)
    );

  const biggestGap =
    sortedGaps[0] || null;

  return {
    totalSkills,
    assessedSkills,
    averageSkillScore,
    averageSkillGap,
    completionPercentage,
    biggestGap,
  };
};


// =========================================
// OVERALL PROGRESS
// =========================================

const calculateOverallProgress = (
  academicProgress,
  careerProgress
) => {

  const academicPercentage =
    academicProgress
      ?.completionPercentage || 0;

  const careerPercentage =
    careerProgress
      ?.completionPercentage || 0;


  /*
    Student OS treats academic and
    career development as two equally
    important dimensions.

    50% academics
    50% career
  */

  const overallPercentage =
    Math.round(
      academicPercentage * 0.5 +
      careerPercentage * 0.5
    );

  return overallPercentage;
};


// =========================================
// PROGRESS INSIGHT
// =========================================

const generateProgressInsight = ({
  academicProgress,
  careerProgress,
  career,
}) => {

  if (
    academicProgress.totalAssignments === 0 &&
    careerProgress.totalSkills === 0
  ) {
    return {
      title: "Let's build your progress",
      message:
        "Add academic tasks and assess your career skills to start generating personalized progress insights.",
    };
  }


  // Career skill gap insight

  if (
    careerProgress.biggestGap
  ) {

    return {
      title:
        "Your biggest career opportunity",

      message:
        `${careerProgress.biggestGap.skillName} currently has a ${careerProgress.biggestGap.gap}% skill gap for your ${career || "career"} goal. Student OS can prioritize this skill in your next sessions.`,
    };
  }


  // Academic insight

  if (
    academicProgress.pendingAssignments >
    0
  ) {

    return {
      title:
        "Keep your academic workload moving",

      message:
        `You have ${academicProgress.pendingAssignments} pending academic task${academicProgress.pendingAssignments === 1 ? "" : "s"}. Completing them will improve your academic progress.`,
    };
  }


  return {
    title:
      "You're making progress",

    message:
      "Student OS is tracking both your academic workload and career development to personalize your next priorities.",
  };
};


// =========================================
// MAIN PROGRESS CALCULATION
// =========================================

const calculateProgress = ({
  assignments = [],
  skillGaps = [],
  career = null,
}) => {

  const academicProgress =
    calculateAcademicProgress(
      assignments
    );

  const careerProgress =
    calculateCareerProgress(
      skillGaps
    );

  const overallProgress =
    calculateOverallProgress(
      academicProgress,
      careerProgress
    );

  const insight =
    generateProgressInsight({
      academicProgress,
      careerProgress,
      career,
    });


  return {
    academic: academicProgress,

    career: careerProgress,

    overall: {
      percentage:
        overallProgress,
    },

    insight,
  };
};


// =========================================
// EXPORTS
// =========================================

module.exports = {
  calculateAcademicProgress,
  calculateCareerProgress,
  calculateOverallProgress,
  generateProgressInsight,
  calculateProgress,
};