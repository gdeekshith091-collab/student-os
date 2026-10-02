import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  CalendarCheck,
  Plus,
  Trash2,
  X,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  BookOpen,
  Target,
} from "lucide-react";

import { auth } from "../firebase/firebase";

import {
  createAttendance,
  getAttendance,
  deleteAttendance,
} from "../services/api";

const Attendance = () => {
  const [firebaseUid, setFirebaseUid] = useState(null);
  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    attendedClasses: "",
    totalClasses: "",
    minimumRequired: 75,
  });

  // =========================================
  // AUTH
  // =========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          setFirebaseUid(user.uid);
        } else {
          setFirebaseUid(null);
          setRecords([]);
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================================
  // FETCH ATTENDANCE
  // =========================================

  useEffect(() => {
    if (!firebaseUid) return;

    const loadAttendance = async () => {
      try {
        setLoading(true);

        const result = await getAttendance(
          firebaseUid
        );

        setRecords(result?.data || []);
      } catch (error) {
        console.error(
          "Failed to load attendance:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, [firebaseUid]);

  // =========================================
  // FORM CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // CREATE ATTENDANCE
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firebaseUid) return;

    if (
      !form.subject ||
      !form.attendedClasses ||
      !form.totalClasses
    ) {
      alert(
        "Please fill in all required fields."
      );
      return;
    }

    const attended = Number(
      form.attendedClasses
    );

    const total = Number(form.totalClasses);

    if (attended > total) {
      alert(
        "Attended classes cannot be greater than total classes."
      );
      return;
    }

    try {
      setSaving(true);

      const result = await createAttendance({
        firebaseUid,
        subject: form.subject,
        attendedClasses: attended,
        totalClasses: total,
        minimumRequired: Number(
          form.minimumRequired
        ),
      });

      setRecords((prev) => [
        ...prev,
        result.data,
      ]);

      setForm({
        subject: "",
        attendedClasses: "",
        totalClasses: "",
        minimumRequired: 75,
      });

      setShowForm(false);
    } catch (error) {
      console.error(
        "Failed to create attendance:",
        error
      );

      alert(
        error.message ||
          "Failed to create attendance"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // DELETE
  // =========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this attendance record?"
    );

    if (!confirmed) return;

    try {
      await deleteAttendance(id);

      setRecords((prev) =>
        prev.filter(
          (record) => record._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete attendance:",
        error
      );

      alert(
        error.message ||
          "Failed to delete attendance"
      );
    }
  };

  // =========================================
  // ATTENDANCE PERCENTAGE
  // =========================================

  const getPercentage = (record) => {
    if (!record.totalClasses) {
      return 0;
    }

    return Math.round(
      (record.attendedClasses /
        record.totalClasses) *
        100
    );
  };

  // =========================================
  // STATUS
  // =========================================

  const getStatus = (record) => {
    const percentage =
      getPercentage(record);

    const minimum =
      record.minimumRequired || 75;

    if (percentage < minimum) {
      return {
        label: "At Risk",
        icon: AlertTriangle,
        text: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        bar: "bg-red-500",
      };
    }

    if (percentage < minimum + 5) {
      return {
        label: "Watch",
        icon: AlertTriangle,
        text: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        bar: "bg-amber-500",
      };
    }

    return {
      label: "Safe",
      icon: ShieldCheck,
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      bar: "bg-emerald-500",
    };
  };

  // =========================================
  // OVERALL STATS
  // =========================================

  const stats = useMemo(() => {
    if (!records.length) {
      return {
        overall: 0,
        totalAttended: 0,
        totalClasses: 0,
        totalMissed: 0,
        atRisk: 0,
        watch: 0,
        safe: 0,
      };
    }

    const totalAttended =
      records.reduce(
        (sum, record) =>
          sum +
          Number(record.attendedClasses || 0),
        0
      );

    const totalClasses =
      records.reduce(
        (sum, record) =>
          sum +
          Number(record.totalClasses || 0),
        0
      );

    const totalMissed =
      totalClasses - totalAttended;

    const statusCounts = records.reduce(
      (result, record) => {
        const status =
          getStatus(record).label;

        if (status === "At Risk") {
          result.atRisk += 1;
        } else if (status === "Watch") {
          result.watch += 1;
        } else {
          result.safe += 1;
        }

        return result;
      },
      {
        atRisk: 0,
        watch: 0,
        safe: 0,
      }
    );

    return {
      overall:
        totalClasses > 0
          ? Math.round(
              (totalAttended /
                totalClasses) *
                100
            )
          : 0,
      totalAttended,
      totalClasses,
      totalMissed,
      ...statusCounts,
    };
  }, [records]);

  // =========================================
  // OVERALL STATUS
  // =========================================

  const overallStatus =
    stats.overall < 75
      ? {
          label: "Needs Attention",
          text: "text-red-600",
          bg: "bg-red-50",
        }
      : stats.overall < 80
      ? {
          label: "Watch",
          text: "text-amber-600",
          bg: "bg-amber-50",
        }
      : {
          label: "Healthy",
          text: "text-emerald-600",
          bg: "bg-emerald-50",
        };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="space-y-8">

        <div>
          <div className="h-3 w-32 animate-pulse rounded-full bg-slate-200" />

          <div className="mt-4 h-10 w-56 animate-pulse rounded-xl bg-slate-200" />

          <div className="mt-3 h-5 w-full max-w-xl animate-pulse rounded bg-slate-100" />
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

            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <p className="text-xs font-bold tracking-[0.18em] text-emerald-600">
              ACADEMIC INTELLIGENCE
            </p>

          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Attendance
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Monitor your attendance, spot academic
            risk early, and stay above your required
            threshold.
          </p>

        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500"
        >
          <Plus size={18} />

          Add Attendance
        </button>

      </div>

      {/* =====================================
          OVERALL ATTENDANCE
      ====================================== */}

      {records.length > 0 && (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="p-6 sm:p-7">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                  <TrendingUp
                    size={26}
                    className="text-indigo-600"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Overall Attendance
                  </p>

                  <div className="mt-1 flex items-center gap-3">

                    <span className="text-4xl font-bold tracking-tight text-slate-900">
                      {stats.overall}%
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${overallStatus.bg} ${overallStatus.text}`}
                    >
                      {overallStatus.label}
                    </span>

                  </div>
                </div>

              </div>

              <div className="grid grid-cols-3 gap-6 text-center sm:flex sm:gap-8">

                <div>
                  <p className="text-xl font-bold text-slate-900">
                    {stats.totalAttended}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Attended
                  </p>
                </div>

                <div>
                  <p className="text-xl font-bold text-slate-900">
                    {stats.totalMissed}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Missed
                  </p>
                </div>

                <div>
                  <p className="text-xl font-bold text-slate-900">
                    {stats.totalClasses}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Total
                  </p>
                </div>

              </div>

            </div>

            <div className="mt-7">

              <div className="mb-2 flex items-center justify-between text-xs font-semibold">

                <span className="text-slate-500">
                  Overall progress
                </span>

                <span className="text-slate-700">
                  {stats.overall}%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                <div
                  className={`h-full rounded-full transition-all ${
                    stats.overall < 75
                      ? "bg-red-500"
                      : stats.overall < 80
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      stats.overall,
                      100
                    )}%`,
                  }}
                />

              </div>

              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>0%</span>
                <span>75% required</span>
                <span>100%</span>
              </div>

            </div>

          </div>

        </section>
      )}

      {/* =====================================
          QUICK STATS
      ====================================== */}

      {records.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* SUBJECTS */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="rounded-2xl bg-indigo-50 p-3">
                <BookOpen
                  size={21}
                  className="text-indigo-600"
                />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                Tracked
              </span>

            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              Subjects
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {records.length}
            </p>

          </div>

          {/* SAFE */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="rounded-2xl bg-emerald-50 p-3">
                <ShieldCheck
                  size={21}
                  className="text-emerald-600"
                />
              </div>

              <span className="text-xs font-semibold text-emerald-600">
                Safe
              </span>

            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              Safe Subjects
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {stats.safe}
            </p>

          </div>

          {/* WATCH */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="rounded-2xl bg-amber-50 p-3">
                <Target
                  size={21}
                  className="text-amber-600"
                />
              </div>

              <span className="text-xs font-semibold text-amber-600">
                Watch
              </span>

            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              Watch Subjects
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {stats.watch}
            </p>

          </div>

          {/* AT RISK */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="rounded-2xl bg-red-50 p-3">
                <AlertTriangle
                  size={21}
                  className="text-red-600"
                />
              </div>

              <span className="text-xs font-semibold text-red-600">
                Attention
              </span>

            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              At-Risk Subjects
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {stats.atRisk}
            </p>

          </div>

        </div>
      )}

      {/* =====================================
          EMPTY STATE
      ====================================== */}

      {records.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
            <CalendarCheck
              size={30}
              className="text-emerald-500"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No attendance records yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Add your subject attendance to let
            Student OS monitor your academic risk
            and keep you above your required
            attendance.
          </p>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-500"
          >
            <Plus size={17} />

            Add Your First Record
          </button>

        </div>
      )}

      {/* =====================================
          SUBJECT ATTENDANCE
      ====================================== */}

      {records.length > 0 && (
        <section>

          <div className="mb-5">

            <h2 className="text-xl font-bold text-slate-900">
              Subject Attendance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              See where your attendance stands and
              which subjects need attention.
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {records.map((record) => {

              const percentage =
                getPercentage(record);

              const status =
                getStatus(record);

              const StatusIcon =
                status.icon;

              const minimum =
                record.minimumRequired || 75;

              const missed =
                Math.max(
                  0,
                  Number(
                    record.totalClasses || 0
                  ) -
                    Number(
                      record.attendedClasses || 0
                    )
                );

              const difference =
                percentage - minimum;

              return (
                <div
                  key={record._id}
                  className={`rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${status.border}`}
                >

                  {/* CARD HEADER */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <BookOpen
                          size={19}
                          className="text-slate-600"
                        />
                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate text-lg font-bold text-slate-900">
                          {record.subject}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {record.attendedClasses}{" "}
                          attended · {missed} missed
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          record._id
                        )
                      }
                      className="flex-shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      title="Delete attendance"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                  {/* PERCENTAGE */}

                  <div className="mt-7 flex items-end justify-between">

                    <div>

                      <p className="text-4xl font-bold tracking-tight text-slate-900">
                        {percentage}%
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Current attendance
                      </p>

                    </div>

                    <div
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${status.bg} ${status.text}`}
                    >
                      <StatusIcon size={14} />

                      {status.label}
                    </div>

                  </div>

                  {/* PROGRESS */}

                  <div className="mt-5">

                    <div className="mb-2 flex items-center justify-between text-xs">

                      <span className="font-medium text-slate-500">
                        Attendance
                      </span>

                      <span className="font-semibold text-slate-700">
                        {minimum}% required
                      </span>

                    </div>

                    <div className="relative h-3 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className={`h-full rounded-full transition-all ${status.bar}`}
                        style={{
                          width: `${Math.min(
                            percentage,
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="mt-5 grid grid-cols-3 gap-2">

                    <div className="rounded-2xl bg-slate-50 p-3 text-center">

                      <p className="text-lg font-bold text-slate-900">
                        {record.attendedClasses}
                      </p>

                      <p className="mt-1 text-[11px] font-medium text-slate-500">
                        Attended
                      </p>

                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3 text-center">

                      <p className="text-lg font-bold text-slate-900">
                        {missed}
                      </p>

                      <p className="mt-1 text-[11px] font-medium text-slate-500">
                        Missed
                      </p>

                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3 text-center">

                      <p className="text-lg font-bold text-slate-900">
                        {record.totalClasses}
                      </p>

                      <p className="mt-1 text-[11px] font-medium text-slate-500">
                        Total
                      </p>

                    </div>

                  </div>

                  {/* RISK MESSAGE */}

                  <div
                    className={`mt-4 rounded-2xl px-4 py-3 text-xs font-medium ${
                      difference < 0
                        ? "bg-red-50 text-red-700"
                        : difference < 5
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >

                    {difference < 0
                      ? `${Math.abs(
                          difference
                        )}% below the required attendance.`
                      : difference < 5
                      ? `${difference}% above the required threshold. Keep monitoring this subject.`
                      : `${difference}% above the required threshold. Attendance is currently safe.`}

                  </div>

                </div>
              );
            })}

          </div>

        </section>
      )}

      {/* =====================================
          ADD ATTENDANCE MODAL
      ====================================== */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-slate-100 p-6">

              <div className="flex items-start gap-3">

                <div className="rounded-2xl bg-indigo-50 p-3">
                  <CalendarCheck
                    size={22}
                    className="text-indigo-600"
                  />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Add Attendance
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add your current attendance
                    for a subject.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
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
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />

              </div>

              {/* CLASSES */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Classes Attended
                  </label>

                  <input
                    type="number"
                    name="attendedClasses"
                    value={
                      form.attendedClasses
                    }
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Total Classes
                  </label>

                  <input
                    type="number"
                    name="totalClasses"
                    value={
                      form.totalClasses
                    }
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />

                </div>

              </div>

              {/* MINIMUM */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Minimum Required (%)
                </label>

                <input
                  type="number"
                  name="minimumRequired"
                  value={
                    form.minimumRequired
                  }
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Student OS uses this threshold
                  to identify attendance risk.
                </p>

              </div>

              {/* ACTIONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Save Attendance"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Attendance;