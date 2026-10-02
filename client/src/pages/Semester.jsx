import { useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardList,
  CalendarDays,
  AlertTriangle,
  Plus,
  Trash2,
  GraduationCap,
  Clock3,
  Save,
  Layers3,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { auth } from "../firebase/firebase";
import { updateSemester, getUser } from "../services/api";

function Semester() {
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [credits, setCredits] = useState("");
  const [studyHours, setStudyHours] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSemesterData = async () => {
      try {
        setLoading(true);
        setError("");

        const user = auth.currentUser;

        if (!user) {
          setError("You are not logged in.");
          return;
        }

        const result = await getUser(user.uid);

        if (result.success && result.data) {
          const userData = result.data;

          if (userData.semester) {
            setSemester(String(userData.semester));
          }

          if (Array.isArray(userData.subjects)) {
            setSubjects(
              userData.subjects.map((subject) => ({
                id: subject._id || Date.now() + Math.random(),
                name: subject.name,
                code: subject.code || "",
                credits: subject.credits || 0,
                studyHours: subject.studyHours || 0,
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to load semester data:", err);
        setError(
          err.message || "Failed to load semester data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSemesterData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSavedMessage("");

      const user = auth.currentUser;

      if (!user) {
        setError("You are not logged in.");
        return;
      }

      const data = {
        firebaseUid: user.uid,
        semester: Number(semester),
        subjects: subjects.map((subject) => ({
          name: subject.name,
          code: subject.code,
          credits: Number(subject.credits) || 0,
          studyHours: Number(subject.studyHours) || 0,
        })),
      };

      const result = await updateSemester(data);

      if (result.success) {
        setSavedMessage(
          "Your semester profile has been saved successfully."
        );
      }
    } catch (err) {
      console.error("Failed to save semester:", err);
      setError(
        err.message || "Failed to save semester information."
      );
    } finally {
      setSaving(false);
    }
  };

  const addSubject = (e) => {
    e.preventDefault();

    if (!subjectName.trim()) return;

    const newSubject = {
      id: Date.now(),
      name: subjectName.trim(),
      code: subjectCode.trim(),
      credits: credits || 0,
      studyHours: studyHours || 0,
    };

    setSubjects((current) => [...current, newSubject]);

    setSubjectName("");
    setSubjectCode("");
    setCredits("");
    setStudyHours("");
  };

  const deleteSubject = (id) => {
    setSubjects((current) =>
      current.filter((subject) => subject.id !== id)
    );
  };

  const totalStudyHours = subjects.reduce(
    (total, subject) =>
      total + Number(subject.studyHours || 0),
    0
  );

  const totalCredits = subjects.reduce(
    (total, subject) =>
      total + Number(subject.credits || 0),
    0
  );

  const academicRisk =
    subjects.length === 0
      ? "Not Set"
      : subjects.length >= 7
      ? "Moderate"
      : "Low";

  const semesterLabel = semester
    ? `${semester}${
        semester === "1"
          ? "st"
          : semester === "2"
          ? "nd"
          : semester === "3"
          ? "rd"
          : "th"
      } Semester`
    : "Semester not set";

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-3 w-40 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-10 w-72 animate-pulse rounded-xl bg-slate-200" />
          <div className="mt-3 h-5 w-full max-w-2xl animate-pulse rounded bg-slate-100" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-3xl bg-slate-100"
            />
          ))}
        </div>

        <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />

            <p className="text-xs font-bold tracking-[0.18em] text-indigo-600">
              ACADEMIC INTELLIGENCE
            </p>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Semester Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Build your academic profile so Student OS can
            understand your workload and help you decide
            what to focus on next.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
          <div className="rounded-xl bg-white p-2 shadow-sm">
            <GraduationCap
              size={20}
              className="text-indigo-600"
            />
          </div>

          <div>
            <p className="text-xs font-medium text-indigo-500">
              Current semester
            </p>

            <p className="text-sm font-bold text-slate-900">
              {semesterLabel}
            </p>
          </div>
        </div>

      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          <AlertTriangle
            size={18}
            className="mt-0.5 flex-shrink-0"
          />

          <div>
            <p className="font-semibold">
              Something went wrong
            </p>

            <p className="mt-1">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Subjects */}
        <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="rounded-2xl bg-indigo-50 p-3">
              <BookOpen
                size={21}
                className="text-indigo-600"
              />
            </div>

            <span className="text-xs font-semibold text-slate-400">
              Academic
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Subjects
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {subjects.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Current semester
          </p>
        </div>

        {/* Credits */}
        <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="rounded-2xl bg-violet-50 p-3">
              <Layers3
                size={21}
                className="text-violet-600"
              />
            </div>

            <span className="text-xs font-semibold text-slate-400">
              Curriculum
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Total Credits
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {totalCredits}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Across all subjects
          </p>
        </div>

        {/* Study Hours */}
        <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="rounded-2xl bg-blue-50 p-3">
              <Clock3
                size={21}
                className="text-blue-600"
              />
            </div>

            <span className="text-xs font-semibold text-slate-400">
              Workload
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Weekly Study Hours
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {totalStudyHours}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Planned academic time
          </p>
        </div>

        {/* Risk */}
        <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div
              className={`rounded-2xl p-3 ${
                academicRisk === "Moderate"
                  ? "bg-amber-50"
                  : academicRisk === "Low"
                  ? "bg-emerald-50"
                  : "bg-slate-100"
              }`}
            >
              <AlertTriangle
                size={21}
                className={
                  academicRisk === "Moderate"
                    ? "text-amber-500"
                    : academicRisk === "Low"
                    ? "text-emerald-500"
                    : "text-slate-400"
                }
              />
            </div>

            <span className="text-xs font-semibold text-slate-400">
              Intelligence
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Academic Risk
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {academicRisk}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Based on current setup
          </p>
        </div>

      </div>

      {/* =====================================================
          SEMESTER SETUP
      ====================================================== */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 via-white to-violet-50/50 px-6 py-6 sm:px-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-indigo-100">
                <GraduationCap
                  size={24}
                  className="text-indigo-600"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Semester Setup
                </h2>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Tell Student OS which semester you are
                  currently in.
                </p>
              </div>
            </div>

            {semester && (
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 size={14} />
                Semester configured
              </div>
            )}

          </div>

        </div>

        <div className="p-6 sm:p-7">

          <div className="grid gap-5 md:grid-cols-[1fr_auto]">

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Current Semester
              </label>

              <select
                value={semester}
                onChange={(e) => {
                  setSemester(e.target.value);
                  setSavedMessage("");
                }}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              >
                <option value="">
                  Select your semester
                </option>

                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="3">3rd Semester</option>
                <option value="4">4th Semester</option>
                <option value="5">5th Semester</option>
                <option value="6">6th Semester</option>
                <option value="7">7th Semester</option>
                <option value="8">8th Semester</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSave}
                disabled={!semester || saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
              >
                <Save size={18} />

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>

          {savedMessage && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm font-medium text-emerald-700">
              <CheckCircle2 size={18} />

              <span>{savedMessage}</span>
            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          SUBJECTS
      ====================================================== */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <BookOpen
                size={19}
                className="text-indigo-600"
              />

              <h2 className="text-xl font-bold text-slate-900">
                Your Subjects
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Add the subjects you are currently studying.
            </p>
          </div>

          {subjects.length > 0 && (
            <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {subjects.length}{" "}
              {subjects.length === 1
                ? "subject"
                : "subjects"}
            </div>
          )}

        </div>

        {/* Add Subject */}
        <form
          onSubmit={addSubject}
          className="mt-6 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-violet-50/50 p-5 sm:p-6"
        >

          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-white p-2 shadow-sm">
              <Plus
                size={18}
                className="text-indigo-600"
              />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Add a Subject
              </h3>

              <p className="text-xs text-slate-500">
                Add the details Student OS needs to understand
                your workload.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Subject Name
              </label>

              <input
                type="text"
                value={subjectName}
                onChange={(e) =>
                  setSubjectName(e.target.value)
                }
                placeholder="e.g. Machine Learning"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Subject Code
              </label>

              <input
                type="text"
                value={subjectCode}
                onChange={(e) =>
                  setSubjectCode(e.target.value)
                }
                placeholder="e.g. DS401"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Credits
              </label>

              <input
                type="number"
                min="0"
                value={credits}
                onChange={(e) =>
                  setCredits(e.target.value)
                }
                placeholder="e.g. 4"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Weekly Study Hours
              </label>

              <input
                type="number"
                min="0"
                value={studyHours}
                onChange={(e) =>
                  setStudyHours(e.target.value)
                }
                placeholder="e.g. 5"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={!subjectName.trim()}
            className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={18} />
            Add Subject
          </button>

        </form>

        {/* Subject List */}
        {subjects.length > 0 ? (
          <div className="mt-6 space-y-3">

            {subjects.map((subject, index) => (
              <div
                key={subject.id}
                className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:bg-indigo-50/20 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-sm font-bold text-indigo-600">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-slate-900">
                      {subject.name}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                      <span>
                        {subject.code || "No code"}
                      </span>

                      <span className="text-slate-300">
                        •
                      </span>

                      <span>
                        {subject.credits || 0} credits
                      </span>
                    </div>
                  </div>

                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">

                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
                    <Clock3 size={16} />

                    <span>
                      {subject.studyHours || 0} hrs/week
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      deleteSubject(subject.id)
                    }
                    className="rounded-xl p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    title="Delete subject"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <BookOpen
                size={28}
                className="text-slate-400"
              />
            </div>

            <p className="mt-4 font-bold text-slate-700">
              No subjects added yet
            </p>

            <p className="mx-auto mt-1 max-w-md text-sm leading-5 text-slate-500">
              Add your current subjects above to start building
              your academic model.
            </p>

          </div>
        )}

      </section>

      {/* =====================================================
          WORKLOAD SNAPSHOT
      ====================================================== */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-violet-50 p-3">
            <Sparkles
              size={21}
              className="text-violet-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Workload Snapshot
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              This information feeds the Student OS
              Intelligence Engine.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          {/* Study hours */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Weekly Study Hours
              </p>

              <Clock3
                size={18}
                className="text-blue-500"
              />
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {totalStudyHours}
              <span className="ml-1 text-sm font-semibold text-slate-500">
                hrs
              </span>
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Planned academic time
            </p>
          </div>

          {/* Assignments */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Assignments
              </p>

              <ClipboardList
                size={18}
                className="text-violet-500"
              />
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              0
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Task intelligence available separately
            </p>
          </div>

          {/* Exams */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Exams
              </p>

              <CalendarDays
                size={18}
                className="text-indigo-500"
              />
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              0
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Exam intelligence available separately
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Semester;