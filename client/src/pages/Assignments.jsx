import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";

import {
  createAssignment,
  getAssignments,
  updateAssignmentStatus,
  deleteAssignment,
  getUser,
} from "../services/api";

import {
  Plus,
  Trash2,
  CheckCircle2,
  Clock3,
  BookOpen,
  X,
  AlertTriangle,
  CalendarDays,
  Timer,
  CircleDot,
  BarChart3,
  ArrowUpRight,
  ClipboardList,
  Sparkles,
} from "lucide-react";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    subjectId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    estimatedHours: 1,
  });

  const firebaseUid = auth.currentUser?.uid;

  // =========================================
  // LOAD DATA
  // =========================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      if (!firebaseUid) {
        setError("User is not logged in.");
        return;
      }

      const [assignmentResult, userResult] =
        await Promise.all([
          getAssignments(firebaseUid),
          getUser(firebaseUid),
        ]);

      setAssignments(
        assignmentResult.data || []
      );

      setSubjects(
        userResult.data?.subjects || []
      );
    } catch (err) {
      console.error(
        "Assignment loading error:",
        err
      );

      setError(
        err.message ||
          "Failed to load assignments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================================
  // FORM
  // =========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!firebaseUid) return;

    try {
      setSaving(true);
      setError("");

      await createAssignment({
        firebaseUid,
        subjectId: form.subjectId,
        title: form.title,
        description: form.description,
        dueDate: form.dueDate,
        priority: form.priority,
        estimatedHours: Number(
          form.estimatedHours
        ),
      });

      setForm({
        subjectId: "",
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        estimatedHours: 1,
      });

      setShowForm(false);

      await loadData();
    } catch (err) {
      console.error(
        "Create assignment error:",
        err
      );

      setError(
        err.message ||
          "Failed to create assignment"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // STATUS
  // =========================================

  const handleStatusChange = async (
    assignment,
    status
  ) => {
    try {
      setError("");

      await updateAssignmentStatus(
        assignment._id,
        firebaseUid,
        status
      );

      await loadData();
    } catch (err) {
      console.error(
        "Status update error:",
        err
      );

      setError(
        err.message ||
          "Failed to update assignment"
      );
    }
  };

  // =========================================
  // DELETE
  // =========================================

  const handleDelete = async (
    assignmentId
  ) => {
    const shouldDelete = window.confirm(
      "Delete this assignment? This action cannot be undone."
    );

    if (!shouldDelete) return;

    try {
      setError("");

      await deleteAssignment(
        assignmentId,
        firebaseUid
      );

      await loadData();
    } catch (err) {
      console.error(
        "Delete assignment error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete assignment"
      );
    }
  };

  // =========================================
  // HELPERS
  // =========================================

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(
      (item) => item._id === subjectId
    );

    return (
      subject?.name || "Unknown Subject"
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getPriorityStyle = (priority) => {
    if (priority === "High") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    if (priority === "Low") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    return "border-amber-200 bg-amber-50 text-amber-700";
  };

  const getPriorityIcon = (priority) => {
    if (priority === "High") {
      return <AlertTriangle size={13} />;
    }

    if (priority === "Low") {
      return <CircleDot size={13} />;
    }

    return <Clock3 size={13} />;
  };

  const getStatusStyle = (status) => {
    if (status === "Completed") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (status === "In Progress") {
      return "border-indigo-200 bg-indigo-50 text-indigo-700";
    }

    return "border-slate-200 bg-slate-50 text-slate-600";
  };

  const getDueDateInfo = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const difference = Math.ceil(
      (due.getTime() -
        today.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (difference < 0) {
      return {
        label: "Overdue",
        style:
          "border-red-200 bg-red-50 text-red-700",
        icon: (
          <AlertTriangle size={15} />
        ),
      };
    }

    if (difference === 0) {
      return {
        label: "Due today",
        style:
          "border-amber-200 bg-amber-50 text-amber-700",
        icon: (
          <AlertTriangle size={15} />
        ),
      };
    }

    if (difference === 1) {
      return {
        label: "Due tomorrow",
        style:
          "border-amber-200 bg-amber-50 text-amber-700",
        icon: (
          <Clock3 size={15} />
        ),
      };
    }

    if (difference <= 3) {
      return {
        label: `${difference} days left`,
        style:
          "border-amber-100 bg-amber-50 text-amber-700",
        icon: (
          <Clock3 size={15} />
        ),
      };
    }

    return {
      label: `${difference} days left`,
      style:
        "border-slate-200 bg-slate-50 text-slate-600",
      icon: (
        <CalendarDays size={15} />
      ),
    };
  };

  // =========================================
  // SUMMARY
  // =========================================

  const totalAssignments =
    assignments.length;

  const completedAssignments =
    assignments.filter(
      (assignment) =>
        assignment.status === "Completed"
    ).length;

  const pendingAssignments =
    assignments.filter(
      (assignment) =>
        assignment.status !== "Completed"
    ).length;

  const highPriorityAssignments =
    assignments.filter(
      (assignment) =>
        assignment.priority === "High" &&
        assignment.status !== "Completed"
    ).length;

  const totalEstimatedHours =
    assignments
      .filter(
        (assignment) =>
          assignment.status !== "Completed"
      )
      .reduce(
        (total, assignment) =>
          total +
          Number(
            assignment.estimatedHours || 0
          ),
        0
      );

  const completionPercentage =
    totalAssignments > 0
      ? Math.round(
          (completedAssignments /
            totalAssignments) *
            100
        )
      : 0;

  const pendingPercentage =
    totalAssignments > 0
      ? Math.round(
          (pendingAssignments /
            totalAssignments) *
            100
        )
      : 0;

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="space-y-8 pb-8">

        <div>
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-10 w-64 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-slate-200" />
        </div>

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

        <div className="rounded-3xl bg-slate-100 p-6">
          <div className="space-y-4">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
            <div className="h-20 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-20 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        </div>

      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div className="space-y-8 pb-8">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-indigo-500" />

            <p className="text-xs font-bold tracking-[0.18em] text-indigo-600">
              ACADEMIC INTELLIGENCE
            </p>

          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Assignments
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Understand your academic workload,
            deadlines, priorities, and completion
            progress in one place.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm(!showForm)
          }
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          {showForm ? (
            <>
              <X size={18} />
              Close Form
            </>
          ) : (
            <>
              <Plus size={18} />
              Add Assignment
            </>
          )}
        </button>

      </div>

      {/* =========================================
          ERROR
      ========================================= */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

          <AlertTriangle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <p>{error}</p>

        </div>
      )}

      {/* =========================================
          SUMMARY
      ========================================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}

        <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {totalAssignments}
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <ClipboardList size={20} />
            </div>

          </div>

          <p className="mt-3 text-sm text-slate-500">
            Assignments tracked
          </p>

        </div>

        {/* Pending */}

        <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pending
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {pendingAssignments}
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
              <Clock3 size={20} />
            </div>

          </div>

          <p className="mt-3 text-sm text-slate-500">
            Still requiring attention
          </p>

        </div>

        {/* Completed */}

        <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Completed
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {completedAssignments}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>

          </div>

          <p className="mt-3 text-sm text-slate-500">
            Finished assignments
          </p>

        </div>

        {/* Workload */}

        <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Workload
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {totalEstimatedHours}
                <span className="ml-1 text-base font-semibold text-slate-400">
                  hrs
                </span>
              </p>
            </div>

            <div className="rounded-2xl bg-violet-50 p-3 text-violet-600">
              <Timer size={20} />
            </div>

          </div>

          <p className="mt-3 text-sm text-slate-500">
            Estimated pending workload
          </p>

        </div>

      </div>

      {/* =========================================
          WORKLOAD OVERVIEW
      ========================================= */}

      {totalAssignments > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-slate-100 p-3">
                  <BarChart3
                    size={21}
                    className="text-slate-700"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Workload overview
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-500">
                    A quick view of your assignment progress.
                  </p>
                </div>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">

                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Completion
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {completionPercentage}%
                </p>

              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">

                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Pending
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {pendingPercentage}%
                </p>

              </div>

            </div>

          </div>

          <div className="mt-6">

            <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">

              <span>
                Completed assignments
              </span>

              <span>
                {completedAssignments} /{" "}
                {totalAssignments}
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-slate-900 transition-all duration-700"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />

            </div>

          </div>

        </section>
      )}

      {/* =========================================
          HIGH PRIORITY
      ========================================= */}

      {highPriorityAssignments > 0 && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-5">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertTriangle size={20} />
            </div>

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="font-bold text-red-800">
                  {highPriorityAssignments} high-priority{" "}
                  {highPriorityAssignments === 1
                    ? "assignment"
                    : "assignments"}
                </h2>

                <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700">
                  Attention needed
                </span>

              </div>

              <p className="mt-1 text-sm leading-6 text-red-700/80">
                Student OS will consider these
                assignments when calculating your
                academic risk and next best action.
              </p>

            </div>

          </div>

        </div>
      )}

      {/* =========================================
          ADD ASSIGNMENT FORM
      ========================================= */}

      {showForm && (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5 sm:px-7">

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Plus size={19} />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Academic workload
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    New Assignment
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add the details Student OS needs
                    to understand this task.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
                aria-label="Close assignment form"
              >
                <X size={19} />
              </button>

            </div>

          </div>

          <form
            onSubmit={handleCreate}
            className="grid gap-5 p-6 sm:p-7 md:grid-cols-2"
          >

            {/* Subject */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Subject
              </label>

              <select
                name="subjectId"
                value={form.subjectId}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              >
                <option value="">
                  Select subject
                </option>

                {subjects.map(
                  (subject) => (
                    <option
                      key={subject._id}
                      value={subject._id}
                    >
                      {subject.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Title */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Assignment Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. ML Assignment 1"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* Description */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What needs to be completed?"
                rows="3"
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

            </div>

            {/* Due date */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Due Date
              </label>

              <div className="relative">

                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />

              </div>
            </div>

            {/* Priority */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Priority
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
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

            {/* Estimated hours */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Estimated Hours
              </label>

              <div className="relative">

                <Timer
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  name="estimatedHours"
                  value={form.estimatedHours}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />

              </div>
            </div>

            {/* Submit */}

            <div className="flex items-end">

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Save Assignment
                  </>
                )}
              </button>

            </div>

          </form>

        </section>
      )}

      {/* =========================================
          EMPTY STATE
      ========================================= */}

      {assignments.length === 0 ? (

        <div className="overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center sm:p-14">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-500">
            <BookOpen size={30} />
          </div>

          <div className="mx-auto mt-5 flex items-center justify-center gap-2">

            <Sparkles
              size={16}
              className="text-indigo-500"
            />

            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Ready to get started?
            </span>

          </div>

          <h2 className="mt-2 text-xl font-bold text-slate-900">
            No assignments yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Add your first assignment and Student
            OS will start understanding your academic
            workload and deadlines.
          </p>

          <button
            type="button"
            onClick={() =>
              setShowForm(true)
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Plus size={17} />
            Add Your First Assignment
          </button>

        </div>

      ) : (

        /* =========================================
            ASSIGNMENT LIST
        ========================================= */

        <section>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your workload
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                All Assignments
              </h2>

            </div>

            <div className="flex items-center gap-2">

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                {assignments.length}{" "}
                {assignments.length === 1
                  ? "item"
                  : "items"}
              </span>

              {completedAssignments > 0 && (
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  {completedAssignments} completed
                </span>
              )}

            </div>

          </div>

          <div className="grid gap-4">

            {assignments.map(
              (assignment) => {
                const dueInfo =
                  getDueDateInfo(
                    assignment.dueDate
                  );

                const isCompleted =
                  assignment.status ===
                  "Completed";

                const isHighPriority =
                  assignment.priority ===
                    "High" &&
                  !isCompleted;

                return (
                  <article
                    key={assignment._id}
                    className={`group overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                      isCompleted
                        ? "border-emerald-100"
                        : isHighPriority
                        ? "border-red-100"
                        : "border-slate-200"
                    }`}
                  >

                    {/* Priority accent */}

                    <div
                      className={`h-1 ${
                        isCompleted
                          ? "bg-emerald-400"
                          : isHighPriority
                          ? "bg-red-400"
                          : "bg-slate-200"
                      }`}
                    />

                    <div className="p-5 sm:p-6">

                      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                        {/* Main */}

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                              <BookOpen size={12} />

                              {getSubjectName(
                                assignment.subjectId
                              )}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${getPriorityStyle(
                                assignment.priority
                              )}`}
                            >
                              {getPriorityIcon(
                                assignment.priority
                              )}

                              {assignment.priority}
                            </span>

                            <span
                              className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                                assignment.status
                              )}`}
                            >
                              {assignment.status}
                            </span>

                          </div>

                          <h3
                            className={`mt-4 text-xl font-bold tracking-tight ${
                              isCompleted
                                ? "text-slate-500 line-through decoration-emerald-400"
                                : "text-slate-900"
                            }`}
                          >
                            {assignment.title}
                          </h3>

                          {assignment.description && (
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                              {assignment.description}
                            </p>
                          )}

                          {/* Metadata */}

                          <div className="mt-5 flex flex-wrap gap-2">

                            <span
                              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${dueInfo.style}`}
                            >
                              {dueInfo.icon}

                              <span>
                                {dueInfo.label}
                              </span>

                              <span className="opacity-40">
                                ·
                              </span>

                              <span>
                                {formatDate(
                                  assignment.dueDate
                                )}
                              </span>
                            </span>

                            <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                              <Timer size={14} />

                              {assignment.estimatedHours}{" "}
                              hour
                              {assignment.estimatedHours !==
                              1
                                ? "s"
                                : ""}{" "}
                              estimated
                            </span>

                          </div>

                        </div>

                        {/* Actions */}

                        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">

                          {!isCompleted && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusChange(
                                    assignment,
                                    "In Progress"
                                  )
                                }
                                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                                  assignment.status ===
                                  "In Progress"
                                    ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                {assignment.status ===
                                "In Progress"
                                  ? "In Progress"
                                  : "Start"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusChange(
                                    assignment,
                                    "Completed"
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                              >
                                <CheckCircle2
                                  size={16}
                                />

                                Complete
                              </button>
                            </>
                          )}

                          {isCompleted && (
                            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700">
                              <CheckCircle2
                                size={16}
                              />

                              Completed
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                assignment._id
                              )
                            }
                            className="rounded-xl border border-slate-200 p-2.5 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            title="Delete assignment"
                            aria-label="Delete assignment"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>

        </section>
      )}

    </div>
  );
}

export default Assignments;