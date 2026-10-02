import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

import {
  TrendingUp,
  BookOpen,
  Code2,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Target,
  ArrowUpRight,
  ClipboardCheck,
  Brain,
} from "lucide-react";

import { getProgress } from "../services/api";

function Progress() {
  const [user, setUser] = useState(null);

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // AUTH
  // =========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================================
  // LOAD PROGRESS
  // =========================================

  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.uid) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result = await getProgress(user.uid);

        setProgress(result.data);
      } catch (err) {
        console.error(
          "Progress loading error:",
          err
        );

        setError(
          err.message ||
            "Failed to load progress"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  // =========================================
  // LOADING STATE
  // =========================================

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-10 w-64 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-slate-200" />
        </div>

        <div className="rounded-3xl bg-slate-900 p-7">
          <div className="animate-pulse">
            <div className="h-4 w-32 rounded bg-slate-700" />

            <div className="mt-5 h-14 w-32 rounded bg-slate-700" />

            <div className="mt-4 h-4 w-80 max-w-full rounded bg-slate-700" />

            <div className="mt-7 h-3 rounded-full bg-slate-700" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="h-6 w-6 animate-pulse rounded bg-slate-200" />

              <div className="mt-5 h-4 w-32 animate-pulse rounded bg-slate-200" />

              <div className="mt-2 h-9 w-20 animate-pulse rounded bg-slate-200" />

              <div className="mt-3 h-3 w-36 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR STATE
  // =========================================

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Student Performance
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Progress Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Track how your academic and career journey
            is progressing.
          </p>
        </div>

        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-red-100 p-3">
              <AlertCircle
                size={22}
                className="text-red-600"
              />
            </div>

            <div>
              <h2 className="font-bold text-red-800">
                Unable to load progress
              </h2>

              <p className="mt-1 text-sm leading-6 text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // SAFE DATA
  // =========================================

  const academic = progress?.academic || {};
  const career = progress?.career || {};
  const overall =
    progress?.overall?.percentage || 0;
  const insight = progress?.insight || {};
  const careerGoal = progress?.careerGoal;

  const academicProgress =
    academic.completionPercentage || 0;

  const careerProgress =
    career.completionPercentage || 0;

  const taskCompletion =
    academic.completionPercentage || 0;

  const totalAssignments =
    academic.totalAssignments || 0;

  const completedAssignments =
    academic.completedAssignments || 0;

  const pendingAssignments =
    academic.pendingAssignments || 0;

  const totalSkills =
    career.totalSkills || 0;

  const assessedSkills =
    career.assessedSkills || 0;

  const pendingPercentage =
    totalAssignments > 0
      ? Math.round(
          (pendingAssignments /
            totalAssignments) *
            100
        )
      : 0;

  // =========================================
  // DERIVED UI HELPERS
  // =========================================

  const getProgressLabel = (value) => {
    if (value >= 80) return "Strong progress";
    if (value >= 60) return "Good progress";
    if (value >= 40) return "Building momentum";
    if (value > 0) return "Getting started";
    return "Not started";
  };

  const overallLabel =
    getProgressLabel(overall);

  // =========================================
  // PROGRESS BAR
  // =========================================

  const ProgressBar = ({
    value,
    dark = false,
    height = "h-3",
  }) => (
    <div
      className={`${height} overflow-hidden rounded-full ${
        dark
          ? "bg-white/10"
          : "bg-slate-100"
      }`}
    >
      <div
        className={`h-full rounded-full transition-all duration-700 ${
          dark
            ? "bg-white"
            : "bg-slate-900"
        }`}
        style={{
          width: `${Math.min(
            Math.max(value, 0),
            100
          )}%`,
        }}
      />
    </div>
  );

  return (
    <div className="space-y-8 pb-8">

      {/* =========================================
          HEADER
      ========================================= */}

      <div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-slate-900" />

          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Student Performance
          </p>
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Progress Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          See how your academic workload and career
          development are progressing together.
        </p>
      </div>

      {/* =========================================
          OVERALL PROGRESS HERO
      ========================================= */}

      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-7 text-white shadow-xl sm:p-8">

        {/* Decorative elements */}

        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/[0.04]" />

        <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-white/[0.03]" />

        <div className="relative">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-white/10 p-3">
                <TrendingUp size={22} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Overall Progress
                </p>

                <p className="mt-0.5 text-sm font-medium text-slate-300">
                  Academic + career
                </p>
              </div>

            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
              {overallLabel}
            </div>

          </div>

          <div className="mt-7 flex flex-wrap items-end gap-3">

            <span className="text-6xl font-bold tracking-tight sm:text-7xl">
              {overall}%
            </span>

            <span className="mb-2 text-sm text-slate-400">
              overall completion
            </span>

          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Student OS combines your academic task
            completion and career skill development
            to understand your overall progress.
          </p>

          <div className="mt-7">
            <div className="mb-2 flex justify-between text-xs font-medium text-slate-400">
              <span>Current progress</span>
              <span>{overall}%</span>
            </div>

            <ProgressBar
              value={overall}
              dark
              height="h-3.5"
            />
          </div>

        </div>
      </section>

      {/* =========================================
          INTELLIGENCE INSIGHT
      ========================================= */}

      {insight?.title && (
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

          <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-slate-50" />

          <div className="relative flex items-start gap-4">

            <div className="shrink-0 rounded-2xl bg-slate-900 p-3 text-white shadow-sm">
              <Brain size={22} />
            </div>

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Student OS Insight
                </p>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  Intelligence
                </span>

              </div>

              <h2 className="mt-2 text-xl font-bold text-slate-900">
                {insight.title}
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                {insight.message}
              </p>

            </div>

          </div>
        </section>
      )}

      {/* =========================================
          METRICS
      ========================================= */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Academic */}

        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div className="rounded-xl bg-slate-100 p-3">
              <BookOpen
                size={21}
                className="text-slate-700"
              />
            </div>

            <ArrowUpRight
              size={17}
              className="text-slate-300 transition group-hover:text-slate-500"
            />

          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Academic Progress
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {academicProgress}%
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            {completedAssignments} of{" "}
            {totalAssignments} assignments
            completed
          </p>

        </div>

        {/* Career */}

        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div className="rounded-xl bg-slate-100 p-3">
              <Code2
                size={21}
                className="text-slate-700"
              />
            </div>

            <ArrowUpRight
              size={17}
              className="text-slate-300 transition group-hover:text-slate-500"
            />

          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Career Progress
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {careerProgress}%
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Average career skill score
          </p>

        </div>

        {/* Skills */}

        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div className="rounded-xl bg-slate-100 p-3">
              <Clock3
                size={21}
                className="text-slate-700"
              />
            </div>

            <ArrowUpRight
              size={17}
              className="text-slate-300 transition group-hover:text-slate-500"
            />

          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Skills Assessed
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {assessedSkills}
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            of {totalSkills} career skills
          </p>

        </div>

        {/* Tasks */}

        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div className="rounded-xl bg-slate-100 p-3">
              <CheckCircle2
                size={21}
                className="text-slate-700"
              />
            </div>

            <ArrowUpRight
              size={17}
              className="text-slate-300 transition group-hover:text-slate-500"
            />

          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Task Completion
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {taskCompletion}%
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            {pendingAssignments} pending
          </p>

        </div>

      </div>

      {/* =========================================
          ACADEMIC + CAREER SPLIT
      ========================================= */}

      <div className="grid gap-6 xl:grid-cols-2">

        {/* =========================================
            ACADEMIC PROGRESS
        ========================================= */}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

          <div className="flex items-start justify-between gap-4">

            <div>

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-slate-100 p-3">
                  <BookOpen
                    size={21}
                    className="text-slate-700"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Academic Progress
                  </h2>

                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    Semester workload
                  </p>
                </div>

              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Your academic task completion across
                the semester.
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 px-3 py-2 text-right">

              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Completion
              </p>

              <p className="mt-0.5 text-lg font-bold text-slate-900">
                {academicProgress}%
              </p>

            </div>

          </div>

          <div className="mt-7 space-y-6">

            {/* Assignments */}

            <div>

              <div className="mb-2 flex items-center justify-between text-sm">

                <span className="font-semibold text-slate-700">
                  Assignments
                </span>

                <span className="font-bold text-slate-900">
                  {academicProgress}%
                </span>

              </div>

              <ProgressBar
                value={academicProgress}
              />

            </div>

            {/* Completed */}

            <div>

              <div className="mb-2 flex items-center justify-between text-sm">

                <span className="font-semibold text-slate-700">
                  Completed tasks
                </span>

                <span className="font-bold text-slate-900">
                  {completedAssignments}
                </span>

              </div>

              <ProgressBar
                value={academicProgress}
              />

            </div>

            {/* Pending */}

            <div>

              <div className="mb-2 flex items-center justify-between text-sm">

                <span className="font-semibold text-slate-700">
                  Pending work
                </span>

                <span className="font-bold text-slate-900">
                  {pendingAssignments}
                </span>

              </div>

              <ProgressBar
                value={pendingPercentage}
              />

            </div>

          </div>

          <div className="mt-7 grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-slate-50 p-4">

              <p className="text-xs font-medium text-slate-500">
                Total tasks
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {totalAssignments}
              </p>

            </div>

            <div className="rounded-2xl bg-slate-50 p-4">

              <p className="text-xs font-medium text-slate-500">
                Pending
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {pendingAssignments}
              </p>

            </div>

          </div>

        </section>

        {/* =========================================
            CAREER PROGRESS
        ========================================= */}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

          <div className="flex items-start justify-between gap-4">

            <div>

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-slate-100 p-3">
                  <Code2
                    size={21}
                    className="text-slate-700"
                  />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Career Progress
                  </h2>

                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    Skill development
                  </p>

                </div>

              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                {careerGoal?.career
                  ? `Progress toward your ${careerGoal.career} career goal.`
                  : "Set a career goal and assess your skills to start tracking career progress."}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 px-3 py-2 text-right">

              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Average
              </p>

              <p className="mt-0.5 text-lg font-bold text-slate-900">
                {careerProgress}%
              </p>

            </div>

          </div>

          <div className="mt-7">

            <div className="mb-2 flex items-center justify-between text-sm">

              <span className="font-semibold text-slate-700">
                Average skill score
              </span>

              <span className="font-bold text-slate-900">
                {careerProgress}%
              </span>

            </div>

            <ProgressBar
              value={careerProgress}
            />

          </div>

          <div className="mt-7 grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-slate-50 p-4">

              <p className="text-xs font-medium text-slate-500">
                Skills assessed
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {assessedSkills}
              </p>

            </div>

            <div className="rounded-2xl bg-slate-50 p-4">

              <p className="text-xs font-medium text-slate-500">
                Skills tracked
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {totalSkills}
              </p>

            </div>

          </div>

          {/* Biggest Gap */}

          {career.biggestGap && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-200">
                  <Target
                    size={18}
                    className="text-slate-700"
                  />
                </div>

                <div className="flex-1">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Biggest skill gap
                  </p>

                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2">

                    <span className="font-bold text-slate-900">
                      {career.biggestGap.skillName}
                    </span>

                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                      {career.biggestGap.gap}% gap
                    </span>

                  </div>

                </div>

              </div>

            </div>
          )}

        </section>

      </div>

      {/* =========================================
          PROGRESS SUMMARY
      ========================================= */}

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-7">

        <div className="flex items-start gap-4">

          <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
            <Brain
              size={22}
              className="text-slate-700"
            />
          </div>

          <div>

            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Student OS Intelligence
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              What Student OS is tracking
            </h2>

          </div>

        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          {/* Academic */}

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-slate-100 p-2.5">
                <ClipboardCheck
                  size={18}
                  className="text-slate-700"
                />
              </div>

              <p className="font-bold text-slate-900">
                Academic workload
              </p>

            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {totalAssignments} total tasks,{" "}
              {pendingAssignments} still pending.
            </p>

          </div>

          {/* Career */}

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-slate-100 p-2.5">
                <Code2
                  size={18}
                  className="text-slate-700"
                />
              </div>

              <p className="font-bold text-slate-900">
                Career development
              </p>

            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {totalSkills} career skills tracked
              {careerGoal?.career
                ? ` for ${careerGoal.career}.`
                : " for your current goal."}
            </p>

          </div>

          {/* Overall */}

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-slate-100 p-2.5">
                <TrendingUp
                  size={18}
                  className="text-slate-700"
                />
              </div>

              <p className="font-bold text-slate-900">
                Overall direction
              </p>

            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Your progress combines academic
              completion and career skill development.
            </p>

          </div>

        </div>

      </section>

      {/* =========================================
          FOOTER NOTE
      ========================================= */}

      <div className="flex items-center justify-center gap-2 px-4 text-center">

        <CheckCircle2
          size={16}
          className="shrink-0 text-slate-400"
        />

        <p className="text-xs leading-5 text-slate-400">
          Student OS uses your current academic and
          career data to keep this progress view updated.
        </p>

      </div>

    </div>
  );
}

export default Progress;