// =========================================
// STUDENT OS — TODAY'S ROADMAP ENGINE
// =========================================


// =========================================
// CREATE TODAY'S ROADMAP
// =========================================

const createTodayRoadmap = ({
  recommendation = null,
  rankedCandidates = [],
  sessionPlan = null,
  behavior = null,
}) => {

  // =========================================
  // NO RECOMMENDATION
  // =========================================

  if (!recommendation) {
    return {
      date: new Date().toISOString().split("T")[0],

      focus: null,

      sessions: [],

      message:
        "No priority has been identified yet. Add academic tasks or assess your career skills to generate today's roadmap.",
    };
  }


  // =========================================
  // PRIMARY SESSION
  // =========================================

  const primarySession = {
    order: 1,

    type: recommendation.type,

    title: recommendation.title,

    durationMinutes:
      sessionPlan?.durationMinutes || 45,

    priorityScore:
      recommendation.score,

    reason:
      recommendation.reason,

    action:
      sessionPlan?.action ||
      "Start focused session",

    status: "Recommended",
  };


  // =========================================
  // FOLLOW-UP SESSIONS
  // =========================================

  const followUpCandidates =
    rankedCandidates
      .filter(
        (candidate) =>
          candidate !== recommendation
      )
      .slice(0, 2);


  const followUpSessions =
    followUpCandidates.map(
      (candidate, index) => {

        return {
          order: index + 2,

          type:
            candidate.type,

          title:
            candidate.title,

          durationMinutes: 30,

          priorityScore:
            candidate.score,

          reason:
            candidate.reason,

          action:
            "Continue focused work",

          status:
            "Follow-up",
        };
      }
    );


  // =========================================
  // COMBINE ROADMAP
  // =========================================

  const sessions = [
    primarySession,
    ...followUpSessions,
  ];


  // =========================================
  // BEHAVIOR MESSAGE
  // =========================================

  let behaviorMessage =
    "Today's roadmap is based on your current priorities.";

  if (
    behavior &&
    behavior.averageSessionDuration
  ) {

    behaviorMessage =
      `Today's roadmap is adapted to your usual ${behavior.averageSessionDuration}-minute study pattern.`;
  }


  // =========================================
  // RETURN ROADMAP
  // =========================================

  return {

    date:
      new Date()
        .toISOString()
        .split("T")[0],

    focus: {

      title:
        recommendation.title,

      type:
        recommendation.type,

      priorityScore:
        recommendation.score,

      reason:
        recommendation.reason,

    },

    sessions,

    totalSessions:
      sessions.length,

    behaviorMessage,

    message:
      `Student OS recommends starting with ${recommendation.title}.`,

  };
};


// =========================================
// EXPORT
// =========================================

module.exports = {
  createTodayRoadmap,
};