const calculateSkillGap = (skill, studentScore = 0) => {
  const score = Math.max(0, Math.min(100, studentScore));

  const gap = 100 - score;

  const importance = skill.importance || 1;

  const gapScore = Math.round(
    gap * 0.6 + importance * 4
  );

  return {
    skillId: skill._id,
    skillName: skill.name,
    category: skill.category,
    importance,
    currentScore: score,
    gap,
    gapScore,
    prerequisites: skill.prerequisites || [],
  };
};

const calculateSkillGaps = (skills, studentSkills) => {
  const studentSkillMap = new Map();

  studentSkills.forEach((studentSkill) => {
    studentSkillMap.set(
      studentSkill.skillId.toString(),
      studentSkill.score
    );
  });

  const skillGaps = skills.map((skill) => {
    const studentScore =
      studentSkillMap.get(skill._id.toString()) || 0;

    return calculateSkillGap(
      skill,
      studentScore
    );
  });

  return skillGaps.sort(
    (a, b) => b.gapScore - a.gapScore
  );
};

const getNextSkill = (skillGaps) => {
  if (!skillGaps || skillGaps.length === 0) {
    return null;
  }

  return skillGaps[0];
};

module.exports = {
  calculateSkillGap,
  calculateSkillGaps,
  getNextSkill,
};