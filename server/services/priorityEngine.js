const calculatePriorityScore = (assignment) => {
  let score = 0;

  const now = new Date();
  const dueDate = new Date(assignment.dueDate);

  const difference =
    dueDate.getTime() - now.getTime();

  const daysRemaining =
    difference / (1000 * 60 * 60 * 24);

  // Due date urgency
  if (daysRemaining < 0) {
    score += 50;
  } else if (daysRemaining <= 1) {
    score += 45;
  } else if (daysRemaining <= 3) {
    score += 35;
  } else if (daysRemaining <= 7) {
    score += 20;
  } else {
    score += 5;
  }

  // Assignment priority
  if (assignment.priority === "High") {
    score += 30;
  } else if (assignment.priority === "Medium") {
    score += 20;
  } else {
    score += 10;
  }

  // Estimated effort
  if (assignment.estimatedHours >= 4) {
    score += 15;
  } else if (assignment.estimatedHours >= 2) {
    score += 10;
  } else {
    score += 5;
  }

  return Math.min(score, 100);
};


const getNextBestAction = (assignments) => {
  if (!assignments || assignments.length === 0) {
    return {
      available: false,
      message: "No pending tasks. You're all caught up!",
    };
  }

  const pendingAssignments = assignments.filter(
    (assignment) =>
      assignment.status !== "Completed"
  );

  if (pendingAssignments.length === 0) {
    return {
      available: false,
      message: "All your assignments are completed!",
    };
  }

  const scoredAssignments = pendingAssignments.map(
    (assignment) => ({
      assignment,
      score: calculatePriorityScore(assignment),
    })
  );

  scoredAssignments.sort(
    (a, b) => b.score - a.score
  );

  const best = scoredAssignments[0].assignment;
  const score = scoredAssignments[0].score;

  const now = new Date();
  const dueDate = new Date(best.dueDate);

  const difference =
    dueDate.getTime() - now.getTime();

  const daysRemaining =
    difference / (1000 * 60 * 60 * 24);

  let urgency;

  if (daysRemaining < 0) {
    urgency = "Overdue";
  } else if (daysRemaining <= 1) {
    urgency = "Due very soon";
  } else if (daysRemaining <= 3) {
    urgency = "Due within 3 days";
  } else if (daysRemaining <= 7) {
    urgency = "Due within a week";
  } else {
    urgency = "Upcoming";
  }

  return {
    available: true,

    action: {
      id: best._id,
      title: best.title,
      description: best.description,
      priority: best.priority,
      status: best.status,
      dueDate: best.dueDate,
      estimatedHours: best.estimatedHours,
      score,
      urgency,
    },

    reason: `${best.title} is currently your highest-priority task based on urgency, priority, and estimated effort.`,
  };
};


module.exports = {
  calculatePriorityScore,
  getNextBestAction,
};