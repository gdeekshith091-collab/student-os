import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

import {
  CalendarDays,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

import {
  createExam,
  getExams,
  updateExamStatus,
  deleteExam,
} from "../services/api";

const Exams = () => {
  const [user, setUser] = useState(null);
  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    examDate: "",
    examType: "Semester",
    importance: "High",
  });

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
  // FETCH EXAMS
  // =========================================

  useEffect(() => {
    if (!user) return;

    const loadExams = async () => {
      try {
        setLoading(true);

        const result = await getExams(user.uid);

        setExams(result?.data || []);
      } catch (error) {
        console.error(
          "Failed to load exams:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [user]);

  // =========================================
  // FORM CHANGE
  // =========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================
  // CREATE EXAM
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    if (!form.subject || !form.examDate) {
      alert(
        "Please enter the subject and exam date."
      );
      return;
    }

    try {
      setSaving(true);

      const result = await createExam({
        firebaseUid: user.uid,
        subject: form.subject,
        examDate: form.examDate,
        examType: form.examType,
        importance: form.importance,
      });

      setExams((previous) => [
        ...previous,
        result.data,
      ]);

      setForm({
        subject: "",
        examDate: "",
        examType: "Semester",
        importance: "High",
      });
    } catch (error) {
      console.error(
        "Failed to create exam:",
        error
      );

      alert(
        error.message ||
          "Failed to create exam"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // COMPLETE EXAM
  // =========================================

  const handleComplete = async (id) => {
    try {
      const result = await updateExamStatus(
        id,
        "Completed"
      );

      setExams((previous) =>
        previous.map((exam) =>
          exam._id === id
            ? result.data
            : exam
        )
      );
    } catch (error) {
      console.error(
        "Failed to update exam:",
        error
      );
    }
  };

  // =========================================
  // DELETE EXAM
  // =========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this exam?"
    );

    if (!confirmed) return;

    try {
      await deleteExam(id);

      setExams((previous) =>
        previous.filter(
          (exam) => exam._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete exam:",
        error
      );
    }
  };

  // =========================================
  // DATE HELPERS
  // =========================================

  const getDaysRemaining = (date) => {
    const today = new Date();
    const exam = new Date(date);

    today.setHours(0, 0, 0, 0);
    exam.setHours(0, 0, 0, 0);

    const difference =
      exam.getTime() - today.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================
  // SUMMARY
  // =========================================

  const upcomingExams = exams.filter(
    (exam) => exam.status !== "Completed"
  );

  const completedExams = exams.filter(
    (exam) => exam.status === "Completed"
  );

  const urgentExams = upcomingExams.filter(
    (exam) =>
      getDaysRemaining(exam.examDate) <= 3
  );

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="space-y-8">

        <div>
          <div className="h-3 w-32 animate-pulse rounded-full bg-slate-200" />

          <div className="mt-4 h-10 w-52 animate-pulse rounded-xl bg-slate-200" />

          <div className="mt-3 h-5 w-full max-w-xl animate-pulse rounded bg-slate-100" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-3xl bg-slate-100"
            />
          ))}
        </div>

        <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />

      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div className="space-y-8">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />

            <p className="text-xs font-bold tracking-[0.18em] text-indigo-600">
              ACADEMIC INTELLIGENCE
            </p>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Exams
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Keep track of upcoming exams, deadlines,
            and academic priorities in one place.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            document
              .getElementById("add-exam-form")
              ?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              })
          }
          className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-500"
        >
          <Plus size={18} />

          Add Exam
        </button>

      </div>

      {/* =====================================
          SUMMARY
      ====================================== */}

      <div className="grid gap-4 sm:grid-cols-3">

        {/* TOTAL */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="rounded-2xl bg-indigo-50 p-3">
              <CalendarDays
                size={21}
                className="text-indigo-600"
              />
            </div>

            <span className="text-xs font-semibold text-slate-400">
              Total
            </span>

          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Total Exams
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {exams.length}
          </p>

        </div>

        {/* UPCOMING */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="rounded-2xl bg-amber-50 p-3">
              <Clock
                size={21}
                className="text-amber-500"
              />
            </div>

            <span className="text-xs font-semibold text-slate-400">
              Upcoming
            </span>

          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Upcoming Exams
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {upcomingExams.length}
          </p>

        </div>

        {/* URGENT */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div
              className={`rounded-2xl p-3 ${
                urgentExams.length > 0
                  ? "bg-red-50"
                  : "bg-emerald-50"
              }`}
            >
              <AlertCircle
                size={21}
                className={
                  urgentExams.length > 0
                    ? "text-red-500"
                    : "text-emerald-500"
                }
              />
            </div>

            <span className="text-xs font-semibold text-slate-400">
              Attention
            </span>

          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Within 3 Days
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {urgentExams.length}
          </p>

        </div>

      </div>

      {/* =====================================
          ADD EXAM MANUALLY
      ====================================== */}

      <section
        id="add-exam-form"
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
      >

        <div className="mb-6 flex items-start gap-4">

          <div className="rounded-2xl bg-indigo-50 p-3">
            <Plus
              size={22}
              className="text-indigo-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Add Exam
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your exam details manually.
            </p>
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >

          {/* SUBJECT */}

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Subject
            </label>

            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. DBMS"
              required
              className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          {/* DATE */}

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Exam Date
            </label>

            <input
              type="date"
              name="examDate"
              value={form.examDate}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          {/* TYPE */}

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Exam Type
            </label>

            <select
              name="examType"
              value={form.examType}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            >
              <option value="Internal">
                Internal
              </option>

              <option value="Midterm">
                Midterm
              </option>

              <option value="Semester">
                Semester
              </option>

              <option value="Practical">
                Practical
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* IMPORTANCE */}

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Importance
            </label>

            <select
              name="importance"
              value={form.importance}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            >
              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>
            </select>
          </div>

          {/* BUTTON */}

          <div className="md:col-span-2 lg:col-span-4">

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={18} />

              {saving
                ? "Adding..."
                : "Add Exam"}
            </button>

          </div>

        </form>

      </section>

      {/* =====================================
          EXAM LIST
      ====================================== */}

      <section>

        <div className="mb-5 flex items-end justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Your Exams
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your academic exam schedule and deadlines.
            </p>
          </div>

          {completedExams.length > 0 && (
            <div className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:block">
              {completedExams.length} completed
            </div>
          )}

        </div>

        {exams.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
              <CalendarDays
                size={30}
                className="text-indigo-500"
              />
            </div>

            <p className="mt-5 font-bold text-slate-800">
              No exams added yet
            </p>

            <p className="mx-auto mt-1 max-w-md text-sm leading-5 text-slate-500">
              Add your first exam manually to
              get started.
            </p>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById(
                    "add-exam-form"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  })
              }
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-500"
            >
              <Plus size={17} />

              Add Exam
            </button>

          </div>

        ) : (

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {exams.map((exam) => {

              const daysRemaining =
                getDaysRemaining(
                  exam.examDate
                );

              const completed =
                exam.status === "Completed";

              const urgent =
                !completed &&
                daysRemaining <= 3;

              return (
                <div
                  key={exam._id}
                  className={`rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    completed
                      ? "border-emerald-200"
                      : urgent
                      ? "border-red-200"
                      : "border-slate-200"
                  }`}
                >

                  {/* HEADER */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <h3 className="truncate text-lg font-bold text-slate-900">
                        {exam.subject}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {exam.examType}
                      </p>

                    </div>

                    {completed ? (

                      <div className="rounded-xl bg-emerald-50 p-2">
                        <CheckCircle2
                          size={20}
                          className="text-emerald-500"
                        />
                      </div>

                    ) : urgent ? (

                      <div className="rounded-xl bg-red-50 p-2">
                        <AlertCircle
                          size={20}
                          className="text-red-500"
                        />
                      </div>

                    ) : (

                      <div className="rounded-xl bg-indigo-50 p-2">
                        <Clock
                          size={20}
                          className="text-indigo-500"
                        />
                      </div>

                    )}

                  </div>

                  {/* DETAILS */}

                  <div className="mt-5 space-y-3">

                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm">

                      <span className="text-slate-500">
                        Exam date
                      </span>

                      <span className="font-semibold text-slate-800">
                        {formatDate(
                          exam.examDate
                        )}
                      </span>

                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm">

                      <span className="text-slate-500">
                        Importance
                      </span>

                      <span
                        className={`font-semibold ${
                          exam.importance ===
                          "High"
                            ? "text-red-600"
                            : exam.importance ===
                              "Medium"
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {exam.importance}
                      </span>

                    </div>

                    {!completed && (
                      <div
                        className={`rounded-2xl px-4 py-3 text-center ${
                          daysRemaining < 0
                            ? "bg-red-50"
                            : daysRemaining <= 3
                            ? "bg-amber-50"
                            : "bg-indigo-50"
                        }`}
                      >

                        <p
                          className={`text-sm font-semibold ${
                            daysRemaining < 0
                              ? "text-red-600"
                              : daysRemaining <= 3
                              ? "text-amber-700"
                              : "text-indigo-600"
                          }`}
                        >
                          {daysRemaining < 0
                            ? "Exam date passed"
                            : daysRemaining === 0
                            ? "Exam is today"
                            : `${daysRemaining} day${
                                daysRemaining === 1
                                  ? ""
                                  : "s"
                              } remaining`}
                        </p>

                      </div>
                    )}

                  </div>

                  {/* ACTIONS */}

                  <div className="mt-5 flex gap-2">

                    {!completed && (
                      <button
                        type="button"
                        onClick={() =>
                          handleComplete(
                            exam._id
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                      >
                        <CheckCircle2 size={16} />

                        Mark Completed
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          exam._id
                        )
                      }
                      className="rounded-xl bg-red-50 px-3 py-2.5 text-red-600 transition hover:bg-red-100"
                      title="Delete exam"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </section>

    </div>
  );
};

export default Exams;