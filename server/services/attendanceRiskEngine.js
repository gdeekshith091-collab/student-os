// =========================================
// STUDENT OS — ATTENDANCE RISK ENGINE
// =========================================

const calculateAttendancePercentage = (
  attendance
) => {
  if (!attendance.totalClasses) {
    return 0;
  }

  return Math.round(
    (attendance.attendedClasses /
      attendance.totalClasses) *
      100
  );
};

// =========================================
// CALCULATE RISK FOR ONE SUBJECT
// =========================================

const calculateAttendanceRisk = (
  attendance
) => {
  const percentage =
    calculateAttendancePercentage(
      attendance
    );

  const minimumRequired =
    attendance.minimumRequired || 75;

  let riskLevel = "Low";
  let riskScore = 0;
  let reason =
    "Attendance is currently within a safe range.";

  if (percentage < minimumRequired) {
    riskLevel = "High";
    riskScore = Math.min(
      100,
      70 +
        (minimumRequired - percentage) * 5
    );

    reason =
      `Attendance is ${percentage}%, below the required ${minimumRequired}%.`;
  } else if (
    percentage <
    minimumRequired + 5
  ) {
    riskLevel = "Medium";
    riskScore = 40;

    reason =
      `Attendance is ${percentage}%, only slightly above the required ${minimumRequired}%.`;
  } else {
    riskLevel = "Low";
    riskScore = Math.max(
      0,
      20 -
        (percentage -
          (minimumRequired + 5))
    );
  }

  return {
    subject: attendance.subject,
    percentage,
    attendedClasses:
      attendance.attendedClasses,
    totalClasses:
      attendance.totalClasses,
    minimumRequired,
    riskLevel,
    riskScore,
    reason,
  };
};

// =========================================
// CALCULATE OVERALL ATTENDANCE RISK
// =========================================

const calculateOverallAttendanceRisk = (
  attendanceRecords
) => {
  if (
    !attendanceRecords ||
    attendanceRecords.length === 0
  ) {
    return {
      overallRisk: "Low",
      overallScore: 0,
      subjectsAtRisk: 0,
      subjectRisks: [],
    };
  }

  const subjectRisks =
    attendanceRecords.map(
      calculateAttendanceRisk
    );

  const overallScore = Math.round(
    subjectRisks.reduce(
      (total, subject) =>
        total + subject.riskScore,
      0
    ) / subjectRisks.length
  );

  let overallRisk = "Low";

  if (overallScore >= 70) {
    overallRisk = "High";
  } else if (overallScore >= 40) {
    overallRisk = "Medium";
  }

  const subjectsAtRisk =
    subjectRisks.filter(
      (subject) =>
        subject.riskLevel !== "Low"
    ).length;

  return {
    overallRisk,
    overallScore,
    subjectsAtRisk,
    subjectRisks,
  };
};

module.exports = {
  calculateAttendancePercentage,
  calculateAttendanceRisk,
  calculateOverallAttendanceRisk,
};