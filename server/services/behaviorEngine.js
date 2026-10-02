// =========================================
// STUDENT OS — BEHAVIOR ENGINE
// =========================================


// =========================================
// AVERAGE SESSION DURATION
// =========================================

const calculateAverageSessionDuration = (
  completedSessions
) => {
  if (
    !completedSessions ||
    completedSessions.length === 0
  ) {
    return 0;
  }

  const totalMinutes =
    completedSessions.reduce(
      (total, session) =>
        total + (session.durationMinutes || 0),
      0
    );

  return Math.round(
    totalMinutes / completedSessions.length
  );
};


// =========================================
// SESSION COMPLETION RATE
// =========================================

const calculateCompletionRate = (
  allSessions
) => {
  if (
    !allSessions ||
    allSessions.length === 0
  ) {
    return 0;
  }

  const completedSessions =
    allSessions.filter(
      (session) =>
        session.status === "Completed"
    );

  return Math.round(
    (completedSessions.length /
      allSessions.length) *
      100
  );
};


// =========================================
// ACADEMIC VS CAREER SESSIONS
// =========================================

const calculateSessionTypeBreakdown = (
  completedSessions
) => {
  const academicSessions =
    completedSessions.filter(
      (session) =>
        session.type === "academic"
    ).length;

  const careerSessions =
    completedSessions.filter(
      (session) =>
        session.type === "career"
    ).length;

  return {
    academicSessions,
    careerSessions,
  };
};


// =========================================
// BEHAVIOR INSIGHT
// =========================================

const generateBehaviorInsight = ({
  completionRate,
  averageSessionDuration,
}) => {

  if (
    !averageSessionDuration
  ) {
    return {
      insight:
        "Student OS needs more completed study sessions to learn your study pattern.",

      recommendedSessionDuration: 45,

      adaptationLevel: "Default",
    };
  }


  // =========================================
  // LOW COMPLETION
  // =========================================

  if (
    completionRate < 50
  ) {
    const shorterDuration =
      Math.min(
        averageSessionDuration,
        30
      );

    return {
      insight:
        `Your completion rate is ${completionRate}%. Student OS will use shorter focused sessions to make your workload more manageable.`,

      recommendedSessionDuration:
        shorterDuration,

      adaptationLevel:
        "Shorter Sessions",
    };
  }


  // =========================================
  // MODERATE COMPLETION
  // =========================================

  if (
    completionRate < 75
  ) {
    return {
      insight:
        `You complete ${completionRate}% of your planned sessions. Student OS will continue using your usual ${averageSessionDuration}-minute session pattern.`,

      recommendedSessionDuration:
        averageSessionDuration,

      adaptationLevel:
        "Balanced Sessions",
    };
  }


  // =========================================
  // HIGH COMPLETION
  // =========================================

  return {
    insight:
      `You complete ${completionRate}% of your planned sessions. Your ${averageSessionDuration}-minute study pattern is working consistently.`,

    recommendedSessionDuration:
      averageSessionDuration,

    adaptationLevel:
      "Consistent Sessions",
  };
};


// =========================================
// MAIN BEHAVIOR ANALYSIS
// =========================================

const analyzeBehavior = (
  allSessions
) => {

  if (
    !allSessions ||
    allSessions.length === 0
  ) {
    return {
      totalSessions: 0,

      completedSessions: 0,

      averageSessionDuration: 0,

      completionRate: 0,

      academicSessions: 0,

      careerSessions: 0,

      behaviorInsight:
        "Student OS needs more completed study sessions to learn your study pattern.",

      recommendedSessionDuration: 45,

      adaptationLevel:
        "Default",
    };
  }


  // =========================================
  // COMPLETED SESSIONS
  // =========================================

  const completedSessions =
    allSessions.filter(
      (session) =>
        session.status === "Completed"
    );


  // =========================================
  // CALCULATE BEHAVIOR
  // =========================================

  const averageSessionDuration =
    calculateAverageSessionDuration(
      completedSessions
    );


  const completionRate =
    calculateCompletionRate(
      allSessions
    );


  const sessionTypeBreakdown =
    calculateSessionTypeBreakdown(
      completedSessions
    );


  // =========================================
  // GENERATE FEEDBACK
  // =========================================

  const behaviorFeedback =
    generateBehaviorInsight({
      completionRate,
      averageSessionDuration,
    });


  // =========================================
  // RETURN
  // =========================================

  return {
    totalSessions:
      allSessions.length,

    completedSessions:
      completedSessions.length,

    averageSessionDuration,

    completionRate,

    academicSessions:
      sessionTypeBreakdown.academicSessions,

    careerSessions:
      sessionTypeBreakdown.careerSessions,

    behaviorInsight:
      behaviorFeedback.insight,

    recommendedSessionDuration:
      behaviorFeedback.recommendedSessionDuration,

    adaptationLevel:
      behaviorFeedback.adaptationLevel,
  };
};


// =========================================
// EXPORTS
// =========================================

module.exports = {
  calculateAverageSessionDuration,

  calculateCompletionRate,

  calculateSessionTypeBreakdown,

  generateBehaviorInsight,

  analyzeBehavior,
};