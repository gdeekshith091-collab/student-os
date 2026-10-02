// =========================================
// STUDENT OS — SESSION PLANNER
// =========================================


const createSessionPlan = (
  recommendation,
  behavior
) => {

  if (!recommendation) {
    return null;
  }


  // =========================================
  // DEFAULT SESSION
  // =========================================

  let durationMinutes = 45;

  let planReason =
    "A focused 45-minute session is recommended.";


  // =========================================
  // USE LEARNED BEHAVIOR
  // =========================================

  if (
    behavior &&
    behavior.recommendedSessionDuration > 0
  ) {
    durationMinutes =
      behavior.recommendedSessionDuration;

    planReason =
      `Student OS recommends a ${durationMinutes}-minute session based on your study behavior.`;
  }

  // Fallback for older behavior data
  else if (
    behavior &&
    behavior.averageSessionDuration > 0
  ) {
    durationMinutes =
      behavior.averageSessionDuration;

    planReason =
      `Student OS recommends a ${durationMinutes}-minute session based on your usual completed session length.`;
  }


  // =========================================
  // ADD BEHAVIOR FEEDBACK
  // =========================================

  if (
    behavior &&
    behavior.adaptationLevel ===
      "Shorter Sessions"
  ) {
    planReason =
      `${planReason} Your completion pattern suggests that shorter focused sessions may be easier to complete.`;
  }


  if (
    behavior &&
    behavior.adaptationLevel ===
      "Balanced Sessions"
  ) {
    planReason =
      `${planReason} Student OS is keeping the session manageable while adapting to your completion pattern.`;
  }


  if (
    behavior &&
    behavior.adaptationLevel ===
      "Consistent Sessions"
  ) {
    planReason =
      `${planReason} Your study pattern is consistent, so Student OS is maintaining your usual session length.`;
  }


  // =========================================
  // ACADEMIC SESSION
  // =========================================

  if (
    recommendation.type === "academic"
  ) {

    const estimatedHours =
      recommendation.data
        ?.estimatedHours || 1;

    const estimatedMinutes =
      estimatedHours * 60;


    // =========================================
    // LARGE ASSIGNMENT
    // =========================================

    if (
      estimatedMinutes >
      durationMinutes
    ) {

      planReason =
        `This task needs about ${estimatedHours} hour(s). Student OS recommends starting with a ${durationMinutes}-minute focused session based on your study behavior.`;
    }


    return {
      type: "academic",

      title:
        recommendation.title,

      durationMinutes,

      planReason,

      priorityScore:
        recommendation.score,

      action:
        "Start focused study session",
    };
  }


  // =========================================
  // CAREER SESSION
  // =========================================

  if (
    recommendation.type === "career"
  ) {

    return {
      type: "career",

      title:
        recommendation.title,

      durationMinutes,

      planReason:
        `${planReason} This session targets a skill gap related to your career goal.`,

      priorityScore:
        recommendation.score,

      action:
        "Start focused career session",
    };
  }


  // =========================================
  // EXAM SESSION
  // =========================================

  if (
    recommendation.type === "exam"
  ) {

    return {
      type: "exam",

      title:
        recommendation.title,

      durationMinutes,

      planReason:
        `${planReason} This session is focused on preparing for your upcoming exam.`,

      priorityScore:
        recommendation.score,

      action:
        "Start focused exam session",
    };
  }


  // =========================================
  // FALLBACK
  // =========================================

  return {
    type:
      recommendation.type,

    title:
      recommendation.title,

    durationMinutes,

    planReason,

    priorityScore:
      recommendation.score,

    action:
      "Start focused session",
  };
};


// =========================================
// EXPORT
// =========================================

module.exports = {
  createSessionPlan,
};