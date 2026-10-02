// =========================================
// STUDENT OS — ACADEMIC RISK ENGINE
// =========================================

const calculateAcademicRisk = (assignments) => {
  if (!assignments || assignments.length === 0) {
    return {
      score: 0,
      level: "Low",
      reason: "No pending assignments.",
    };
  }

  const pendingAssignments = assignments.filter(
    (assignment) =>
      assignment.status !== "Completed"
  );

  if (pendingAssignments.length === 0) {
    return {
      score: 0,
      level: "Low",
      reason: "All assignments are completed.",
    };
  }

  let score = 0;
  const reasons = [];

  const now = new Date();

  pendingAssignments.forEach(
    (assignment) => {
      const dueDate =
        new Date(assignment.dueDate);

      const difference =
        dueDate.getTime() -
        now.getTime();

      const daysRemaining =
        difference /
        (1000 * 60 * 60 * 24);

      // Due date risk
      if (daysRemaining < 0) {
        score += 35;
        reasons.push(
          `${assignment.title} is overdue`
        );
      } else if (daysRemaining <= 1) {
        score += 30;
        reasons.push(
          `${assignment.title} is due very soon`
        );
      } else if (daysRemaining <= 3) {
        score += 20;
        reasons.push(
          `${assignment.title} is due within 3 days`
        );
      } else if (daysRemaining <= 7) {
        score += 10;
      }

      // Priority risk
      if (
        assignment.priority === "High"
      ) {
        score += 20;
        reasons.push(
          `${assignment.title} has high priority`
        );
      } else if (
        assignment.priority === "Medium"
      ) {
        score += 10;
      }

      // Estimated workload
      if (
        assignment.estimatedHours >= 4
      ) {
        score += 15;
        reasons.push(
          `${assignment.title} requires significant effort`
        );
      } else if (
        assignment.estimatedHours >= 2
      ) {
        score += 8;
      }
    }
  );

  // Pending assignment count
  if (
    pendingAssignments.length >= 5
  ) {
    score += 20;
    reasons.push(
      "You have many pending assignments"
    );
  } else if (
    pendingAssignments.length >= 3
  ) {
    score += 10;
    reasons.push(
      "You have multiple pending assignments"
    );
  }

  // Keep score between 0 and 100
  score = Math.min(score, 100);

  let level = "Low";

  if (score >= 70) {
    level = "High";
  } else if (score >= 40) {
    level = "Medium";
  }

  return {
    score,
    level,
    reason:
      reasons.length > 0
        ? reasons.slice(0, 3).join(". ") +
          "."
        : "Your academic workload is currently manageable.",
  };
};

module.exports = {
  calculateAcademicRisk,
};