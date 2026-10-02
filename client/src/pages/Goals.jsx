import {
  Target,
  GraduationCap,
  Code2,
  Briefcase,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "lucide-react";

function Goals() {
  const goals = [
    {
      title: "Improve Java Skills",
      category: "Career",
      progress: 68,
      deadline: "September 30",
      icon: Code2,
    },
    {
      title: "Complete Semester Project",
      category: "Academic",
      progress: 40,
      deadline: "October 15",
      icon: GraduationCap,
    },
    {
      title: "Prepare for Data Science",
      category: "Career",
      progress: 25,
      deadline: "December 31",
      icon: Briefcase,
    },
  ];

  // =========================================
  // SUMMARY
  // =========================================

  const activeGoals = goals.length;

  const averageProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce(
            (sum, goal) => sum + goal.progress,
            0
          ) / goals.length
        )
      : 0;

  const careerGoals = goals.filter(
    (goal) => goal.category === "Career"
  ).length;

  const academicGoals = goals.filter(
    (goal) => goal.category === "Academic"
  ).length;

  const completedGoals = goals.filter(
    (goal) => goal.progress >= 100
  ).length;

  const getProgressStatus = (progress) => {
    if (progress >= 80) {
      return {
        label: "On Track",
        text: "text-emerald-600",
        bg: "bg-emerald-50",
        bar: "bg-emerald-500",
      };
    }

    if (progress >= 50) {
      return {
        label: "Making Progress",
        text: "text-indigo-600",
        bg: "bg-indigo-50",
        bar: "bg-indigo-500",
      };
    }

    return {
      label: "Needs Focus",
      text: "text-amber-600",
      bg: "bg-amber-50",
      bar: "bg-amber-500",
    };
  };

  return (
    <div className="space-y-8">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

        <div>

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-indigo-500" />

            <p className="text-xs font-bold tracking-[0.18em] text-indigo-600">
              PERSONAL DIRECTION
            </p>

          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Goals
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Track what you're working toward and
            understand how each goal connects to
            your academic and career journey.
          </p>

        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500"
        >
          <Plus size={18} />
          Add Goal
        </button>

      </div>

      {/* =====================================
          SUMMARY CARDS
      ====================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* ACTIVE */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="rounded-2xl bg-indigo-50 p-3">
              <Target
                size={21}
                className="text-indigo-600"
              />
            </div>

            <span className="text-xs font-semibold text-slate-400">
              Active
            </span>

          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Active Goals
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {activeGoals}
          </p>

        </div>

        {/* PROGRESS */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="rounded-2xl bg-emerald-50 p-3">
              <TrendingUp
                size={21}
                className="text-emerald-600"
              />
            </div>

            <span className="text-xs font-semibold text-emerald-600">
              Overall
            </span>

          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Average Progress
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {averageProgress}%
          </p>

        </div>

        {/* CAREER */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="rounded-2xl bg-violet-50 p-3">
              <Briefcase
                size={21}
                className="text-violet-600"
              />
            </div>

            <span className="text-xs font-semibold text-violet-600">
              Career
            </span>

          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Career Goals
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {careerGoals}
          </p>

        </div>

        {/* ACADEMIC */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="rounded-2xl bg-amber-50 p-3">
              <GraduationCap
                size={21}
                className="text-amber-600"
              />
            </div>

            <span className="text-xs font-semibold text-amber-600">
              Academic
            </span>

          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Academic Goals
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {academicGoals}
          </p>

        </div>

      </div>

      {/* =====================================
          GOAL OVERVIEW
      ====================================== */}

      {goals.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
                GOAL OVERVIEW
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900">
                Your current direction
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                You're currently {averageProgress}% through
                your active goals.
              </p>

            </div>

            <div className="text-left sm:text-right">

              <p className="text-3xl font-bold text-slate-900">
                {averageProgress}%
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Average completion
              </p>

            </div>

          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{
                width: `${averageProgress}%`,
              }}
            />

          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-400">
            <span>Started</span>
            <span>100% complete</span>
          </div>

        </section>
      )}

      {/* =====================================
          GOALS
      ====================================== */}

      <section>

        <div className="mb-5 flex items-end justify-between">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Your Goals
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keep your academic and career priorities
              moving forward.
            </p>

          </div>

          {completedGoals > 0 && (
            <span className="hidden items-center gap-1.5 text-xs font-semibold text-emerald-600 sm:flex">
              <CheckCircle2 size={15} />
              {completedGoals} completed
            </span>
          )}

        </div>

        <div className="grid gap-5 lg:grid-cols-2">

          {goals.map((goal) => {

            const Icon = goal.icon;

            const status =
              getProgressStatus(
                goal.progress
              );

            return (
              <div
                key={goal.title}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >

                {/* TOP */}

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div
                      className={`rounded-2xl p-3 ${status.bg}`}
                    >
                      <Icon
                        size={22}
                        className={status.text}
                      />
                    </div>

                    <div>

                      <h3 className="font-bold text-slate-900">
                        {goal.title}
                      </h3>

                      <div className="mt-1 flex items-center gap-2">

                        <span className="text-sm text-slate-500">
                          {goal.category}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-slate-300" />

                        <span
                          className={`text-xs font-bold ${status.text}`}
                        >
                          {status.label}
                        </span>

                      </div>

                    </div>

                  </div>

                  <span className="text-xl font-bold text-slate-900">
                    {goal.progress}%
                  </span>

                </div>

                {/* PROGRESS */}

                <div className="mt-7">

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className={`h-full rounded-full transition-all ${status.bar}`}
                      style={{
                        width: `${goal.progress}%`,
                      }}
                    />

                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">

                    <span className="font-medium text-slate-500">
                      {goal.progress}% completed
                    </span>

                    <span className="flex items-center gap-1.5 font-semibold text-slate-600">
                      <Clock3 size={13} />
                      Due {goal.deadline}
                    </span>

                  </div>

                </div>

                {/* FOOTER */}

                <div className="mt-5 border-t border-slate-100 pt-4">

                  <div className="flex items-center justify-between">

                    <span className="text-xs text-slate-400">
                      Keep building momentum
                    </span>

                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs font-bold text-indigo-600 opacity-0 transition group-hover:opacity-100"
                    >
                      View Goal
                      <ArrowUpRight size={14} />
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* =====================================
          GOAL INTELLIGENCE
      ====================================== */}

      <section className="overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:p-7">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-2xl">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-white/10 p-3">
                <Target size={22} />
              </div>

              <div>

                <p className="text-xs font-bold tracking-[0.15em] text-slate-400">
                  STUDENT OS
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Goal Intelligence
                </h2>

              </div>

            </div>

            <p className="mt-4 leading-7 text-slate-300">
              Your goals should not exist separately from
              your semester and career roadmap. Student OS
              can connect them to your workload, skills,
              deadlines, and priorities to help identify
              what deserves attention next.
            </p>

          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-72">

            <div className="rounded-2xl bg-white/10 p-4">

              <p className="text-2xl font-bold">
                {careerGoals}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Career goals
              </p>

            </div>

            <div className="rounded-2xl bg-white/10 p-4">

              <p className="text-2xl font-bold">
                {academicGoals}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Academic goals
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Goals;