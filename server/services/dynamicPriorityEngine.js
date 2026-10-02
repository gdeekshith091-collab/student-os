// =========================================
// STUDENT OS — DYNAMIC PRIORITY ENGINE
// =========================================


// =========================================
// ACADEMIC ASSIGNMENT SCORE
// =========================================

const calculateAcademicCandidateScore = (
  assignment
) => {
  const now = new Date();

  const dueDate = new Date(
    assignment.dueDate
  );

  const diffMs = dueDate - now;

  const diffDays =
    diffMs / (1000 * 60 * 60 * 24);

  let urgencyScore = 0;

  if (diffDays < 0) {
    urgencyScore = 100;
  } else if (diffDays <= 1) {
    urgencyScore = 95;
  } else if (diffDays <= 3) {
    urgencyScore = 85;
  } else if (diffDays <= 7) {
    urgencyScore = 65;
  } else {
    urgencyScore = 30;
  }

  let importanceScore = 0;

  if (assignment.priority === "High") {
    importanceScore = 100;
  } else if (
    assignment.priority === "Medium"
  ) {
    importanceScore = 65;
  } else {
    importanceScore = 35;
  }

  let effortScore = 0;

  if (assignment.estimatedHours >= 4) {
    effortScore = 100;
  } else if (
    assignment.estimatedHours >= 2
  ) {
    effortScore = 70;
  } else {
    effortScore = 40;
  }

  const score = Math.round(
    urgencyScore * 0.55 +
      importanceScore * 0.30 +
      effortScore * 0.15
  );

  return Math.min(score, 100);
};


// =========================================
// EXAM SCORE
// =========================================

const calculateExamCandidateScore = (
  exam
) => {
  const now = new Date();

  const examDate = new Date(
    exam.examDate
  );

  const diffMs = examDate - now;

  const diffDays =
    diffMs / (1000 * 60 * 60 * 24);

  let urgencyScore = 0;

  if (diffDays < 0) {
    urgencyScore = 20;
  } else if (diffDays <= 1) {
    urgencyScore = 100;
  } else if (diffDays <= 3) {
    urgencyScore = 95;
  } else if (diffDays <= 7) {
    urgencyScore = 80;
  } else if (diffDays <= 14) {
    urgencyScore = 60;
  } else {
    urgencyScore = 35;
  }

  let importanceScore = 0;

  if (exam.importance === "High") {
    importanceScore = 100;
  } else if (
    exam.importance === "Medium"
  ) {
    importanceScore = 65;
  } else {
    importanceScore = 35;
  }

  const score = Math.round(
    urgencyScore * 0.70 +
      importanceScore * 0.30
  );

  return Math.min(score, 100);
};


// =========================================
// CAREER SKILL SCORE
// =========================================

const calculateCareerCandidateScore = (
  skill
) => {
  const gap = skill.gap || 0;

  const importance =
    skill.importance || 1;

  const gapScore = gap;

  const importanceScore =
    (importance / 10) * 100;

  const score = Math.round(
    gapScore * 0.70 +
      importanceScore * 0.30
  );

  return Math.min(score, 100);
};


// =========================================
// ATTENDANCE PRIORITY ADAPTATION
// =========================================

const applyAttendanceAdaptation = (
  candidate,
  attendanceRisk
) => {
  if (
    !attendanceRisk ||
    !attendanceRisk.subjectRisks ||
    attendanceRisk.subjectRisks.length === 0
  ) {
    return candidate;
  }

  /*
    Attendance should influence academic work
    only when the candidate belongs to a subject
    that has an attendance risk.
  */

  const candidateSubject =
    candidate.data &&
    (
      candidate.data.subject ||
      candidate.data.subjectName
    );

  if (!candidateSubject) {
    return candidate;
  }

  const subjectRisk =
    attendanceRisk.subjectRisks.find(
      (subject) =>
        subject.subject.toLowerCase() ===
        candidateSubject.toLowerCase()
    );

  if (!subjectRisk) {
    return candidate;
  }

  // =========================================
  // HIGH ATTENDANCE RISK
  // =========================================

  if (
    subjectRisk.riskLevel === "High"
  ) {
    candidate.score = Math.min(
      candidate.score + 15,
      100
    );

    candidate.attendanceNote =
      `Attendance for ${subjectRisk.subject} is ${subjectRisk.percentage}%, below the required ${subjectRisk.minimumRequired}%.`;

    candidate.reason =
      `${candidate.reason} Attendance risk also increased its priority.`;

    return candidate;
  }

  // =========================================
  // MEDIUM ATTENDANCE RISK
  // =========================================

  if (
    subjectRisk.riskLevel === "Medium"
  ) {
    candidate.score = Math.min(
      candidate.score + 7,
      100
    );

    candidate.attendanceNote =
      `Attendance for ${subjectRisk.subject} is ${subjectRisk.percentage}%, close to the required ${subjectRisk.minimumRequired}%.`;

    candidate.reason =
      `${candidate.reason} Attendance is close to the required level, so this subject receives a small priority boost.`;

    return candidate;
  }

  // =========================================
  // LOW ATTENDANCE RISK
  // =========================================

  candidate.attendanceNote =
    `Attendance for ${subjectRisk.subject} is currently safe at ${subjectRisk.percentage}%.`;

  return candidate;
};


// =========================================
// BEHAVIOR ADAPTATION
// =========================================

const applyBehaviorAdaptation = (
  candidate,
  behavior
) => {
  if (
    !behavior ||
    !behavior.averageSessionDuration
  ) {
    return candidate;
  }

  const averageSessionDuration =
    behavior.averageSessionDuration;

  // Assignments

  if (
    candidate.type === "academic" &&
    candidate.data &&
    candidate.data.estimatedHours
  ) {
    const estimatedHours =
      candidate.data.estimatedHours || 1;

    const estimatedMinutes =
      estimatedHours * 60;

    const difference = Math.abs(
      estimatedMinutes -
        averageSessionDuration
    );

    if (difference <= 30) {
      candidate.score = Math.min(
        candidate.score + 5,
        100
      );

      candidate.behaviorNote =
        `This task fits your usual ${averageSessionDuration}-minute study pattern.`;
    }
  }

  // Exams

  if (
    candidate.type === "exam"
  ) {
    candidate.behaviorNote =
      `Student OS recommends a focused ${averageSessionDuration}-minute session for exam preparation based on your usual study pattern.`;
  }

  return candidate;
};


// =========================================
// MAIN DYNAMIC PRIORITY ENGINE
// =========================================

const calculateDynamicPriority = ({
  assignments = [],
  exams = [],
  skillGaps = [],
  behavior = null,
  attendanceRisk = null,
}) => {

  // =========================================
  // PENDING ASSIGNMENTS
  // =========================================

  const pendingAssignments =
    assignments.filter(
      (assignment) =>
        assignment.status !==
        "Completed"
    );


  // =========================================
  // ACADEMIC ASSIGNMENT CANDIDATES
  // =========================================

  const academicCandidates =
    pendingAssignments.map(
      (assignment) => {

        const score =
          calculateAcademicCandidateScore(
            assignment
          );

        let candidate = {
          type: "academic",

          title: assignment.title,

          score,

          reason:
            "This academic task is prioritized using its deadline, academic importance, and estimated effort.",

          data: assignment,
        };

        candidate =
          applyAttendanceAdaptation(
            candidate,
            attendanceRisk
          );

        return applyBehaviorAdaptation(
          candidate,
          behavior
        );
      }
    );


  // =========================================
  // EXAM CANDIDATES
  // =========================================

  const upcomingExams =
    exams.filter(
      (exam) =>
        exam.status !== "Completed"
    );

  const examCandidates =
    upcomingExams.map(
      (exam) => {

        const score =
          calculateExamCandidateScore(
            exam
          );

        let candidate = {
  type: "exam",

  title:
    `${exam.subject} Exam`,

  score,

  reason:
    "This exam is prioritized using how soon it is scheduled and its importance.",

  data: exam,
};

candidate =
  applyAttendanceAdaptation(
    candidate,
    attendanceRisk
  );

return applyBehaviorAdaptation(
  candidate,
  behavior
);
      }
    );


  // =========================================
  // CAREER CANDIDATES
  // =========================================

  const careerCandidates =
    skillGaps.map(
      (skill) => {

        const score =
          calculateCareerCandidateScore(
            skill
          );

        return {
          type: "career",

          title:
            skill.skillName,

          score,

          reason:
            "This skill is prioritized using your current skill gap and its importance for your selected career.",

          data: skill,
        };
      }
    );


  // =========================================
  // COMBINE EVERYTHING
  // =========================================

  const allCandidates = [
    ...academicCandidates,
    ...examCandidates,
    ...careerCandidates,
  ];


  // =========================================
  // NO CANDIDATES
  // =========================================

  if (
    allCandidates.length === 0
  ) {
    return {
      recommendation: null,

      rankedCandidates: [],

      behaviorUsed: Boolean(
        behavior &&
          behavior.averageSessionDuration
      ),

      attendanceUsed: Boolean(
        attendanceRisk &&
          attendanceRisk.subjectRisks
      ),
    };
  }


  // =========================================
  // RANK
  // =========================================

  const rankedCandidates =
    allCandidates.sort(
      (a, b) =>
        b.score - a.score
    );


  // =========================================
  // TOP RECOMMENDATION
  // =========================================

  const recommendation =
    rankedCandidates[0];


  // =========================================
  // RETURN
  // =========================================

  return {
    recommendation,

    rankedCandidates,

    behaviorUsed: Boolean(
      behavior &&
        behavior.averageSessionDuration
    ),

    attendanceUsed: Boolean(
      attendanceRisk &&
        attendanceRisk.subjectRisks
    ),
  };
};


// =========================================
// EXPORT
// =========================================

module.exports = {
  calculateAcademicCandidateScore,

  calculateExamCandidateScore,

  calculateCareerCandidateScore,

  calculateDynamicPriority,

  applyBehaviorAdaptation,

  applyAttendanceAdaptation,
};