import { useEffect, useState } from "react";

import {
  Briefcase,
  Target,
  Code2,
  CheckCircle2,
  Lock,
  ArrowRight,
  X,
  Sparkles,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

import {
  getCareerGoal,
  createCareerGoal,
  getSkillsByCareer,
  saveSkillAssessment,
  getStudentSkills,
  getSkillGaps,
} from "../services/api";

function Career() {
  const [careerGoal, setCareerGoal] = useState(null);
  const [skills, setSkills] = useState([]);
  const [studentSkills, setStudentSkills] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [nextSkill, setNextSkill] = useState(null);

  const [loading, setLoading] = useState(true);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [assessmentSaving, setAssessmentSaving] =
    useState(false);
  const [gapLoading, setGapLoading] = useState(false);

  const [showGoalForm, setShowGoalForm] =
    useState(false);
  const [selectedCareer, setSelectedCareer] =
    useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showRoadmap, setShowRoadmap] =
    useState(false);

  const careers = [
    {
      name: "Data Scientist",
      description:
        "Analyze data, build predictive models, and use machine learning to solve real-world problems.",
    },
    {
      name: "Data Analyst",
      description:
        "Analyze data, create dashboards, and generate insights that support business decisions.",
    },
    {
      name: "Machine Learning Engineer",
      description:
        "Build, deploy, and maintain machine learning models and intelligent systems.",
    },
    {
      name: "Software Developer",
      description:
        "Design, build, test, and maintain software applications and systems.",
    },
    {
      name: "AI Engineer",
      description:
        "Build intelligent applications using machine learning, generative AI, and AI technologies.",
    },
  ];

  // =========================================
  // LOAD CAREER GOAL + STUDENT ASSESSMENTS
  // =========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          setLoading(false);
          return;
        }

        try {
          const result = await getCareerGoal(
            user.uid
          );

          setCareerGoal(result.data);

          const assessmentResult =
            await getStudentSkills(user.uid);

          setStudentSkills(
            assessmentResult.data || []
          );

          if (result.data) {
            setSelectedCareer(
              result.data.career
            );
          }
        } catch (error) {
          console.error(
            "Failed to load career information:",
            error
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================================
  // LOAD CAREER SKILLS
  // =========================================

  useEffect(() => {
    const loadSkills = async () => {
      if (!careerGoal?.career) {
        setSkills([]);
        setSkillGaps([]);
        setNextSkill(null);
        return;
      }

      try {
        setSkillsLoading(true);

        const result =
          await getSkillsByCareer(
            careerGoal.career
          );

        setSkills(result.data || []);
      } catch (error) {
        console.error(
          "Failed to load career skills:",
          error
        );

        setSkills([]);
      } finally {
        setSkillsLoading(false);
      }
    };

    loadSkills();
  }, [careerGoal]);

  // =========================================
  // LOAD SKILL GAP ENGINE
  // =========================================

  const loadSkillGaps = async () => {
    const user = auth.currentUser;

    if (!user || !careerGoal?.career) {
      setSkillGaps([]);
      setNextSkill(null);
      return;
    }

    try {
      setGapLoading(true);

      const result =
        await getSkillGaps(user.uid);

      setSkillGaps(
        result.data?.skillGaps || []
      );

      setNextSkill(
        result.data?.nextSkill || null
      );
    } catch (error) {
      console.error(
        "Failed to load skill gaps:",
        error
      );

      setSkillGaps([]);
      setNextSkill(null);
    } finally {
      setGapLoading(false);
    }
  };

  useEffect(() => {
    if (careerGoal?.career) {
      loadSkillGaps();
    }
  }, [careerGoal]);

  // =========================================
  // SAVE CAREER GOAL
  // =========================================

  const handleSaveCareerGoal = async () => {
    if (!selectedCareer) {
      setError(
        "Please select a career goal."
      );
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      setError("Please log in again.");
      return;
    }

    const selectedCareerData =
      careers.find(
        (career) =>
          career.name === selectedCareer
      );

    if (!selectedCareerData) {
      setError(
        "Invalid career selection."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const result =
        await createCareerGoal({
          firebaseUid: user.uid,
          career: selectedCareerData.name,
          description:
            selectedCareerData.description,
        });

      setCareerGoal(result.data);
      setShowGoalForm(false);

      setSkillGaps([]);
      setNextSkill(null);
    } catch (error) {
      console.error(
        "Failed to save career goal:",
        error
      );

      setError(
        error.message ||
          "Failed to save career goal."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // GET STUDENT SCORE
  // =========================================

  const getStudentScore = (skillId) => {
    const studentSkill =
      studentSkills.find(
        (item) =>
          item.skillId?._id === skillId ||
          item.skillId === skillId
      );

    return studentSkill?.score ?? 0;
  };

  // =========================================
  // SKILL STATS
  // =========================================

  const skillsTracked = skills.length;

  const skillsDeveloped =
    skills.filter(
      (skill) =>
        getStudentScore(skill._id) >= 70
    ).length;

  const skillsRemaining =
    skillsTracked - skillsDeveloped;

  const careerProgress =
    skillsTracked > 0
      ? Math.round(
          skills.reduce(
            (total, skill) =>
              total +
              getStudentScore(skill._id),
            0
          ) / skillsTracked
        )
      : 0;

  // =========================================
  // ROADMAP HELPERS
  // =========================================

  const isPrerequisiteComplete = (
    prerequisiteName
  ) => {
    const prerequisiteSkill =
      skills.find(
        (skill) =>
          skill.name?.toLowerCase() ===
          prerequisiteName?.toLowerCase()
      );

    if (!prerequisiteSkill) {
      return false;
    }

    return (
      getStudentScore(
        prerequisiteSkill._id
      ) >= 70
    );
  };

  const getRoadmapStatus = (skill) => {
    const score =
      getStudentScore(skill._id);

    const prerequisites =
      skill.prerequisites || [];

    const prerequisitesReady =
      prerequisites.every(
        isPrerequisiteComplete
      );

    if (score >= 70) {
      return "completed";
    }

    if (
      !prerequisitesReady &&
      prerequisites.length > 0
    ) {
      return "locked";
    }

    if (
      nextSkill?.skillName ===
      skill.name
    ) {
      return "current";
    }

    return "upcoming";
  };

  // =========================================
  // UPDATE LOCAL SCORE
  // =========================================

  const updateLocalSkillScore = (
    skillId,
    score
  ) => {
    setStudentSkills((current) => {
      const existing = current.find(
        (item) =>
          item.skillId?._id === skillId ||
          item.skillId === skillId
      );

      if (existing) {
        return current.map((item) =>
          item.skillId?._id === skillId ||
          item.skillId === skillId
            ? {
                ...item,
                score,
              }
            : item
        );
      }

      return [
        ...current,
        {
          skillId,
          score,
        },
      ];
    });
  };

  // =========================================
  // SAVE SKILL ASSESSMENT
  // =========================================

  const handleSaveSkillAssessment = async (
    skill
  ) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in again.");
      return;
    }

    const score =
      getStudentScore(skill._id);

    try {
      setAssessmentSaving(true);

      await saveSkillAssessment({
        firebaseUid: user.uid,
        skillId: skill._id,
        score,
      });

      await loadSkillGaps();

      alert(
        `${skill.name} assessment saved successfully!`
      );
    } catch (error) {
      console.error(
        "Failed to save skill assessment:",
        error
      );

      alert(
        error.message ||
          "Failed to save skill assessment."
      );
    } finally {
      setAssessmentSaving(false);
    }
  };

  // =========================================
  // LOADING SCREEN
  // =========================================

  if (loading) {
    return (
      <div className="space-y-8">

        <div>
          <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-10 w-64 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-slate-200" />
        </div>

        <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-3xl bg-slate-100"
              />
            )
          )}
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-violet-500" />

            <p className="text-xs font-bold tracking-[0.18em] text-violet-600">
              CAREER INTELLIGENCE
            </p>

          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Career Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Turn your career goal into a measurable
            skill path and know what to focus on next.
          </p>

        </div>

        {careerGoal && (
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

            <Sparkles
              size={17}
              className="text-violet-500"
            />

            <span className="text-sm font-semibold text-slate-700">
              {careerProgress}% career progress
            </span>

          </div>
        )}

      </div>

      {/* =========================================
          CAREER GOAL HERO
      ========================================= */}

      <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl sm:p-9">

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-3xl">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <Briefcase size={20} />
                </div>

                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-slate-400">
                    CURRENT CAREER GOAL
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Your long-term direction
                  </p>
                </div>

              </div>

              {careerGoal ? (
                <>
                  <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                    {careerGoal.career}
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                    {careerGoal.description}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-6 text-3xl font-bold sm:text-4xl">
                    Choose your direction
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                    Set a career goal and Student OS
                    will build a personalized SkillGraph
                    around it.
                  </p>
                </>
              )}

            </div>

            <button
              type="button"
              onClick={() => {
                setShowGoalForm(true);
                setError("");
              }}
              className="relative flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              <Target size={17} />

              {careerGoal
                ? "Change Career Goal"
                : "Set Career Goal"}
            </button>

          </div>

          {careerGoal && (
            <div className="mt-8 border-t border-white/10 pt-6">

              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>Career readiness</span>
                <span className="text-white">
                  {careerProgress}%
                </span>
              </div>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">

                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{
                    width: `${careerProgress}%`,
                  }}
                />

              </div>

            </div>
          )}

        </div>

      </section>

      {/* =========================================
          CAREER GOAL FORM
      ========================================= */}

      {showGoalForm && (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50/70 p-6 sm:p-7">

            <div>

              <div className="flex items-center gap-2">

                <Sparkles
                  size={17}
                  className="text-violet-500"
                />

                <p className="text-xs font-bold tracking-[0.15em] text-violet-600">
                  CAREER SETUP
                </p>

              </div>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Choose your career goal
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Student OS will use this goal to build
                your personalized SkillGraph.
              </p>

            </div>

            <button
              type="button"
              onClick={() => {
                setShowGoalForm(false);
                setError("");
              }}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
            >
              <X size={20} />
            </button>

          </div>

          <div className="grid gap-4 p-6 sm:p-7 md:grid-cols-2">

            {careers.map((career) => {

              const selected =
                selectedCareer ===
                career.name;

              return (
                <button
                  type="button"
                  key={career.name}
                  onClick={() =>
                    setSelectedCareer(
                      career.name
                    )
                  }
                  className={`group rounded-2xl border p-5 text-left transition ${
                    selected
                      ? "border-slate-950 bg-slate-950 text-white shadow-lg"
                      : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  }`}
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h3 className="font-bold">
                        {career.name}
                      </h3>

                      <p
                        className={`mt-2 text-sm leading-6 ${
                          selected
                            ? "text-slate-300"
                            : "text-slate-500"
                        }`}
                      >
                        {career.description}
                      </p>

                    </div>

                    {selected ? (
                      <CheckCircle2
                        size={21}
                        className="shrink-0"
                      />
                    ) : (
                      <ChevronRight
                        size={20}
                        className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-500"
                      />
                    )}

                  </div>

                </button>
              );
            })}

          </div>

          {error && (
            <div className="mx-6 mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:mx-7">
              <AlertCircle size={17} />
              {error}
            </div>
          )}

          <div className="flex justify-end border-t border-slate-100 p-6 sm:p-7">

            <button
              type="button"
              onClick={handleSaveCareerGoal}
              disabled={saving}
              className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Career Goal"}
            </button>

          </div>

        </section>
      )}

      {/* =========================================
          CAREER STATS
      ========================================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Career Progress
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {careerProgress}%
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <TrendingUp size={20} />
            </div>

          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-violet-500"
              style={{
                width: `${careerProgress}%`,
              }}
            />
          </div>

        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Skills Tracked
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {skillsTracked}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Code2 size={20} />
            </div>

          </div>

          <p className="mt-3 text-sm text-slate-500">
            Skills in your career graph
          </p>

        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Developed
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {skillsDeveloped}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>

          </div>

          <p className="mt-3 text-sm text-slate-500">
            Skills at 70% or above
          </p>

        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Remaining
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {skillsRemaining}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Lock size={20} />
            </div>

          </div>

          <p className="mt-3 text-sm text-slate-500">
            Skills still being developed
          </p>

        </div>

      </div>

      {/* =========================================
          SKILLGRAPH
      ========================================= */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs font-bold tracking-[0.15em] text-violet-600">
              CAREER SKILLGRAPH
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Your skill foundation
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              See how your current abilities compare with
              the skills required for your career.
            </p>

          </div>

          {skillsTracked > 0 && (
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
              {skillsDeveloped}/{skillsTracked} developed
            </span>
          )}

        </div>

        {skillsLoading ? (
          <div className="mt-7 space-y-6">

            {[1, 2, 3, 4, 5].map(
              (item) => (
                <div key={item}>

                  <div className="mb-3 flex justify-between">
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-10 animate-pulse rounded bg-slate-200" />
                  </div>

                  <div className="h-3 animate-pulse rounded-full bg-slate-100" />

                </div>
              )
            )}

          </div>
        ) : skills.length > 0 ? (
          <div className="mt-7 space-y-6">

            {skills.map((skill) => {

              const score =
                getStudentScore(
                  skill._id
                );

              const developed =
                score >= 70;

              return (
                <div
                  key={
                    skill._id ||
                    skill.name
                  }
                >

                  <div className="mb-2.5 flex items-center justify-between gap-4">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="text-sm font-bold text-slate-800">
                          {skill.name}
                        </span>

                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                          {skill.category}
                        </span>

                        {developed && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <CheckCircle2 size={11} />
                            Developed
                          </span>
                        )}

                      </div>

                    </div>

                    <span className="shrink-0 text-sm font-bold text-slate-900">
                      {score}%
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        developed
                          ? "bg-emerald-500"
                          : "bg-slate-900"
                      }`}
                      style={{
                        width: `${score}%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

            <Code2
              size={30}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 font-bold text-slate-700">
              No SkillGraph yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Select a career goal to build your
              personalized skill path.
            </p>

          </div>
        )}

      </section>
{/* =========================================
    VISUAL SKILL DEPENDENCY GRAPH
========================================= */}
<section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="mb-6">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
        <TrendingUp className="h-5 w-5 text-indigo-600" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Skill Dependency Graph
        </h2>
        <p className="text-sm text-slate-500">
          See how your skills connect and what you need to build next.
        </p>
      </div>
    </div>
  </div>

  {skills.length === 0 ? (
    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
      <p className="text-sm text-slate-500">
        No skills available for this career yet.
      </p>
    </div>
  ) : (
    <div className="space-y-6">

      {/* CAREER GOAL */}
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 text-center">
          <div className="mb-2 flex justify-center">
            <Briefcase className="h-6 w-6 text-indigo-600" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
            Career Goal
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {careerGoal?.career}
          </h3>
        </div>

        <div className="mx-auto h-8 w-px bg-slate-300" />
      </div>

      {/* FOUNDATION SKILLS */}
      <div>
        <div className="mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Foundation Skills
          </h3>
          <p className="text-xs text-slate-400">
            Skills that do not require another skill first.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills
            .filter((skill) => !skill.prerequisites?.length)
            .map((skill) => {
              const score = getStudentScore(skill._id);
              const isCurrent = nextSkill?.skillName === skill.name;

              return (
                <div
                  key={skill._id}
                  className={`rounded-2xl border p-5 transition ${
                    isCurrent
                      ? "border-indigo-300 bg-indigo-50 shadow-md"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-900">
                        {skill.name}
                      </h4>

                      <p className="mt-1 text-xs text-slate-500">
                        {skill.category}
                      </p>
                    </div>

                    {isCurrent && (
                      <span className="rounded-full bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white">
                        NEXT
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-bold text-slate-700">
                        {score}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* CONNECTOR */}
      {skills.some((skill) => skill.prerequisites?.length) && (
        <div className="mx-auto h-8 w-px bg-slate-300" />
      )}

      {/* DEPENDENT SKILLS */}
      {skills.some((skill) => skill.prerequisites?.length) && (
        <div>
          <div className="mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Dependent Skills
            </h3>
            <p className="text-xs text-slate-400">
              These skills unlock after their prerequisites are developed.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {skills
              .filter((skill) => skill.prerequisites?.length)
              .map((skill) => {
                const score = getStudentScore(skill._id);
                const ready = skill.prerequisites.every(
                  isPrerequisiteComplete
                );
                const isCurrent = nextSkill?.skillName === skill.name;

                return (
                  <div
                    key={skill._id}
                    className={`rounded-2xl border p-5 ${
                      isCurrent
                        ? "border-indigo-300 bg-indigo-50 shadow-md"
                        : ready
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900">
                          {skill.name}
                        </h4>

                        <p className="mt-1 text-xs text-slate-500">
                          {skill.category}
                        </p>
                      </div>

                      {isCurrent ? (
                        <span className="rounded-full bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white">
                          NEXT
                        </span>
                      ) : ready ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Lock className="h-5 w-5 text-slate-400" />
                      )}
                    </div>

                    {/* PREREQUISITES */}
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-semibold text-slate-500">
                        Requires
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {skill.prerequisites.map((prerequisite) => {
                          const completed =
                            isPrerequisiteComplete(prerequisite);

                          return (
                            <span
                              key={prerequisite}
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                completed
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {completed ? "✓ " : "→ "}
                              {prerequisite}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* SCORE */}
                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-bold text-slate-700">
                          {score}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  )}
</section>
      {/* =========================================
          SKILL ASSESSMENT
      ========================================= */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

        <div className="flex flex-col gap-2">

          <p className="text-xs font-bold tracking-[0.15em] text-violet-600">
            SKILL ASSESSMENT
          </p>

          <h2 className="text-2xl font-bold text-slate-900">
            Rate your current abilities
          </h2>

          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Your assessment helps Student OS identify
            skill gaps and decide which career skill
            deserves your attention next.
          </p>

        </div>

        {skills.length > 0 ? (
          <div className="mt-7 grid gap-4 lg:grid-cols-2">

            {skills.map((skill) => {

              const score =
                getStudentScore(
                  skill._id
                );

              return (
                <div
                  key={
                    skill._id ||
                    skill.name
                  }
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition hover:border-slate-300"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h3 className="font-bold text-slate-900">
                        {skill.name}
                      </h3>

                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {skill.category}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white px-3 py-2 text-center shadow-sm ring-1 ring-slate-200">
                      <p className="text-lg font-bold text-slate-900">
                        {score}%
                      </p>
                    </div>

                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={score}
                    onChange={(event) => {
                      updateLocalSkillScore(
                        skill._id,
                        Number(
                          event.target.value
                        )
                      );
                    }}
                    className="mt-6 w-full cursor-pointer accent-slate-900"
                  />

                  <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400">
                    <span>Beginner</span>
                    <span>Intermediate</span>
                    <span>Strong</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleSaveSkillAssessment(
                        skill
                      )
                    }
                    disabled={
                      assessmentSaving
                    }
                    className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {assessmentSaving
                      ? "Saving..."
                      : "Save Assessment"}
                  </button>

                </div>
              );
            })}

          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

            <Target
              size={30}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 font-bold text-slate-700">
              Choose a career goal first
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Your career skills will appear here
              for assessment.
            </p>

          </div>
        )}

      </section>

      {/* =========================================
          SKILL GAP ANALYSIS
      ========================================= */}

      <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-7">

        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <Target size={21} />
            </div>

            <div>

              <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
                SKILL GAP ANALYSIS
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Where should you focus?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Student OS compares your current skill
                level with your career requirements and
                identifies the area with the highest
                priority.
              </p>

            </div>

          </div>

          {gapLoading ? (
            <div className="mt-7 rounded-2xl bg-white/10 p-6">

              <div className="h-7 w-64 animate-pulse rounded bg-white/10" />

              <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-white/10" />

            </div>
          ) : nextSkill ? (
            <div className="mt-7 rounded-3xl bg-white p-6 text-slate-900">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                      NEXT FOCUS
                    </span>

                    <span className="text-xs font-medium text-slate-400">
                      Priority {nextSkill.gapScore}
                    </span>

                  </div>

                  <h3 className="mt-3 text-3xl font-bold tracking-tight">
                    {nextSkill.skillName}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {nextSkill.category}
                  </p>

                </div>

                <div className="rounded-2xl bg-slate-950 px-5 py-4 text-center text-white">

                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Skill Gap
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {nextSkill.gap}%
                  </p>

                </div>

              </div>

              <div className="mt-6">

                <div className="flex items-center justify-between text-sm">

                  <span className="font-medium text-slate-500">
                    Current level
                  </span>

                  <span className="font-bold text-slate-900">
                    {nextSkill.currentScore}%
                  </span>

                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-slate-950 transition-all duration-700"
                    style={{
                      width: `${nextSkill.currentScore}%`,
                    }}
                  />

                </div>

              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                <div className="rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold text-slate-400">
                    CAREER IMPORTANCE
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {nextSkill.importance}/10
                  </p>

                </div>

                <div className="rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold text-slate-400">
                    GAP PRIORITY
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {nextSkill.gapScore}
                  </p>

                </div>

              </div>

              {nextSkill.prerequisites?.length >
                0 && (
                <div className="mt-5 rounded-2xl border border-slate-200 p-4">

                  <p className="text-xs font-bold tracking-wider text-slate-400">
                    PREREQUISITES
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {nextSkill.prerequisites.map(
                      (prerequisite) => (
                        <span
                          key={
                            prerequisite
                          }
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                        >
                          {prerequisite}
                        </span>
                      )
                    )}

                  </div>

                </div>
              )}

            </div>
          ) : (
            <div className="mt-7 rounded-2xl bg-white/10 p-6">

              <p className="font-bold">
                Set a career goal to begin your
                skill gap analysis.
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Student OS will calculate your highest
                priority skill gap automatically.
              </p>

            </div>
          )}

        </div>

      </section>

      {/* =========================================
          NEXT SKILL
      ========================================= */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            <Sparkles size={21} />
          </div>

          <div className="flex-1">

            <p className="text-xs font-bold tracking-[0.15em] text-violet-600">
              RECOMMENDED NEXT SKILL
            </p>

            {nextSkill ? (
              <>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {nextSkill.skillName}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your current score is{" "}
                  <strong className="text-slate-800">
                    {nextSkill.currentScore}%
                  </strong>{" "}
                  with a{" "}
                  <strong className="text-slate-800">
                    {nextSkill.gap}% skill gap
                  </strong>
                  .
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setShowRoadmap(true)
                  }
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition hover:gap-3"
                >
                  View learning path
                  <ArrowRight size={17} />
                </button>
              </>
            ) : (
              <>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Choose a career goal
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Set your career goal to receive a
                  personalized next-skill recommendation.
                </p>
              </>
            )}

          </div>

        </div>

      </section>

      {/* =========================================
          INTERACTIVE CAREER ROADMAP
      ========================================= */}

      {showRoadmap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* Modal header */}

            <div className="flex items-start justify-between border-b border-slate-200 p-6 sm:p-7">

              <div>

                <div className="flex items-center gap-2">

                  <Sparkles
                    size={16}
                    className="text-violet-500"
                  />

                  <p className="text-xs font-bold tracking-[0.15em] text-violet-600">
                    CAREER ROADMAP
                  </p>

                </div>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {careerGoal?.career ||
                    "Your Career Path"}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Follow the prerequisite path, build
                  each skill, and move toward your career
                  goal step by step.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowRoadmap(false)
                }
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={22} />
              </button>

            </div>

            {/* Modal content */}

            <div className="overflow-y-auto p-6 sm:p-7">

              {skills.length > 0 ? (
                <div className="space-y-4">

                  {skills.map(
                    (skill, index) => {

                      const score =
                        getStudentScore(
                          skill._id
                        );

                      const status =
                        getRoadmapStatus(
                          skill
                        );

                      const prerequisites =
                        skill.prerequisites ||
                        [];

                      const statusConfig = {
                        completed: {
                          label: "Completed",
                          badge:
                            "border-emerald-200 bg-emerald-50 text-emerald-700",
                          card:
                            "border-emerald-200 bg-emerald-50/30",
                          number:
                            "bg-emerald-600",
                        },

                        current: {
                          label: "Focus next",
                          badge:
                            "border-slate-900 bg-slate-900 text-white",
                          card:
                            "border-slate-900 bg-slate-50 ring-2 ring-slate-900/10",
                          number:
                            "bg-slate-950",
                        },

                        upcoming: {
                          label: "Ready to build",
                          badge:
                            "border-blue-200 bg-blue-50 text-blue-700",
                          card:
                            "border-slate-200 bg-white",
                          number:
                            "bg-blue-600",
                        },

                        locked: {
                          label:
                            "Prerequisites needed",
                          badge:
                            "border-amber-200 bg-amber-50 text-amber-700",
                          card:
                            "border-slate-200 bg-slate-50",
                          number:
                            "bg-amber-500",
                        },
                      }[status];

                      return (
                        <div
                          key={
                            skill._id ||
                            skill.name
                          }
                        >

                          <div
                            className={`rounded-2xl border p-5 transition ${statusConfig.card}`}
                          >

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                              <div className="flex items-start gap-4">

                                <div
                                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${statusConfig.number}`}
                                >
                                  {index + 1}
                                </div>

                                <div>

                                  <div className="flex flex-wrap items-center gap-2">

                                    <h3 className="text-lg font-bold text-slate-900">
                                      {skill.name}
                                    </h3>

                                    <span
                                      className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusConfig.badge}`}
                                    >
                                      {statusConfig.label}
                                    </span>

                                  </div>

                                  <p className="mt-1 text-sm text-slate-500">
                                    {skill.category} ·
                                    Career importance{" "}
                                    {skill.importance}/10
                                  </p>

                                  {skill.description && (
                                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                                      {
                                        skill.description
                                      }
                                    </p>
                                  )}

                                </div>

                              </div>

                              <div className="min-w-[110px] rounded-xl bg-white px-4 py-3 text-center shadow-sm ring-1 ring-slate-200">

                                <p className="text-xs font-medium text-slate-500">
                                  Current score
                                </p>

                                <p className="mt-1 text-xl font-bold text-slate-900">
                                  {score}%
                                </p>

                              </div>

                            </div>

                            <div className="mt-5">

                              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">

                                <div
                                  className={`h-full rounded-full transition-all duration-700 ${
                                    status ===
                                    "completed"
                                      ? "bg-emerald-500"
                                      : status ===
                                        "current"
                                      ? "bg-slate-950"
                                      : "bg-slate-400"
                                  }`}
                                  style={{
                                    width: `${score}%`,
                                  }}
                                />

                              </div>

                            </div>

                            {prerequisites.length >
                              0 && (
                              <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-slate-200">

                                <p className="text-xs font-bold tracking-wider text-slate-400">
                                  PREREQUISITES
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2">

                                  {prerequisites.map(
                                    (
                                      prerequisite
                                    ) => {
                                      const complete =
                                        isPrerequisiteComplete(
                                          prerequisite
                                        );

                                      return (
                                        <span
                                          key={
                                            prerequisite
                                          }
                                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                                            complete
                                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                              : "border-slate-200 bg-slate-50 text-slate-600"
                                          }`}
                                        >
                                          {complete
                                            ? "✓ "
                                            : "○ "}
                                          {
                                            prerequisite
                                          }
                                        </span>
                                      );
                                    }
                                  )}

                                </div>

                              </div>
                            )}

                          </div>

                          {index <
                            skills.length -
                              1 && (
                            <div className="flex justify-center py-2 text-slate-300">
                              <ChevronRight
                                size={20}
                                className="rotate-90"
                              />
                            </div>
                          )}

                        </div>
                      );
                    }
                  )}

                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-8 text-center">

                  <Code2
                    size={30}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 font-bold text-slate-700">
                    No career skills available yet.
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose a career goal to build your
                    roadmap.
                  </p>

                </div>
              )}

              <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white">

                <div className="flex items-start gap-3">

                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />

                  <div>

                    <p className="text-sm font-bold">
                      How Student OS reads your roadmap
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Skills at 70% or above are treated
                      as developed. Skills with incomplete
                      prerequisites remain locked, while
                      your highest-priority skill gap is
                      marked as the next focus.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Career;