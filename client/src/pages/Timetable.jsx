import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import {
  CalendarDays,
  Clock,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { auth } from "../firebase/firebase";

import {
  createTimetableEntry,
  getTimetable,
  deleteTimetableEntry,
} from "../services/api";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Timetable = () => {
  const [firebaseUid, setFirebaseUid] = useState(null);

  const [entries, setEntries] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    day: "Monday",
    subject: "",
    startTime: "",
    endTime: "",
    room: "",
    type: "Lecture",
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
          setEntries([]);
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================================
  // FETCH TIMETABLE
  // =========================================

  useEffect(() => {
    if (!firebaseUid) return;

    const loadTimetable = async () => {
      try {
        setLoading(true);

        const result =
          await getTimetable(firebaseUid);

        setEntries(result?.data || []);
      } catch (error) {
        console.error(
          "Failed to load timetable:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadTimetable();
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
  // CREATE ENTRY
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firebaseUid) return;

    try {
      setSaving(true);

      const result =
        await createTimetableEntry({
          firebaseUid,
          ...form,
        });

      setEntries((prev) => [
        ...prev,
        result.data,
      ]);

      setForm({
        day: "Monday",
        subject: "",
        startTime: "",
        endTime: "",
        room: "",
        type: "Lecture",
      });

      setShowForm(false);
    } catch (error) {
      console.error(
        "Failed to create timetable entry:",
        error
      );

      alert(
        error.message ||
          "Failed to create timetable entry"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // DELETE ENTRY
  // =========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this timetable entry?"
    );

    if (!confirmed) return;

    try {
      await deleteTimetableEntry(id);

      setEntries((prev) =>
        prev.filter(
          (entry) => entry._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete timetable entry:",
        error
      );

      alert(
        error.message ||
          "Failed to delete timetable entry"
      );
    }
  };

  // =========================================
  // GROUP BY DAY
  // =========================================

  const getEntriesForDay = (day) => {
    return entries
      .filter(
        (entry) => entry.day === day
      )
      .sort((a, b) =>
        a.startTime.localeCompare(
          b.startTime
        )
      );
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-3xl bg-slate-100"
              />
            )
          )}
        </div>
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
              ACADEMIC SCHEDULE
            </p>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Timetable
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Organize your weekly classes and keep
            your academic schedule in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm(true)
          }
          className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-500"
        >
          <Plus size={18} />

          Add Class
        </button>
      </div>

      {/* =====================================
          EMPTY STATE
      ====================================== */}

      {entries.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <CalendarDays size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Your timetable is empty
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Add your classes manually to build
            your weekly schedule.
          </p>

          <button
            type="button"
            onClick={() =>
              setShowForm(true)
            }
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-500"
          >
            <Plus size={17} />

            Add Class
          </button>

        </div>
      )}

      {/* =====================================
          WEEKLY TIMETABLE
      ====================================== */}

      {entries.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">

          {days.map((day) => {
            const dayEntries =
              getEntriesForDay(day);

            return (
              <div
                key={day}
                className="rounded-3xl border border-slate-200 bg-white shadow-sm"
              >

                {/* DAY HEADER */}

                <div className="border-b border-slate-100 px-5 py-4">

                  <div className="flex items-center justify-between">

                    <h2 className="font-bold text-slate-900">
                      {day}
                    </h2>

                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600">
                      {dayEntries.length}
                    </span>

                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {dayEntries.length}{" "}
                    {dayEntries.length === 1
                      ? "class"
                      : "classes"}
                  </p>

                </div>

                {/* CLASSES */}

                <div className="space-y-3 p-4">

                  {dayEntries.length === 0 ? (

                    <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                      <p className="text-sm text-slate-400">
                        No classes
                      </p>
                    </div>

                  ) : (

                    dayEntries.map(
                      (entry) => (
                        <div
                          key={entry._id}
                          className="group rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30"
                        >

                          <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">

                              <h3 className="truncate font-bold text-slate-900">
                                {entry.subject}
                              </h3>

                              <span className="mt-2 inline-block rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                                {entry.type}
                              </span>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  entry._id
                                )
                              }
                              className="rounded-lg p-2 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>

                          <div className="mt-4 space-y-2.5 text-sm text-slate-500">

                            <div className="flex items-center gap-2">
                              <Clock
                                size={15}
                                className="text-indigo-500"
                              />

                              <span>
                                {entry.startTime}{" "}
                                –{" "}
                                {entry.endTime}
                              </span>
                            </div>

                            {entry.room && (
                              <div className="flex items-center gap-2">

                                <MapPin
                                  size={15}
                                  className="text-indigo-500"
                                />

                                <span>
                                  {entry.room}
                                </span>

                              </div>
                            )}

                          </div>

                        </div>
                      )
                    )

                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* =====================================
          ADD CLASS MODAL
      ====================================== */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Add Class
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a class to your weekly timetable.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* DAY */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Day
                </label>

                <select
                  name="day"
                  value={form.day}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                >
                  {days.map((day) => (
                    <option
                      key={day}
                      value={day}
                    >
                      {day}
                    </option>
                  ))}
                </select>
              </div>

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
                  placeholder="e.g. Machine Learning"
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* TIME */}

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Start Time
                  </label>

                  <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    End Time
                  </label>

                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

              </div>

              {/* ROOM */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Room
                </label>

                <input
                  type="text"
                  name="room"
                  value={form.room}
                  onChange={handleChange}
                  placeholder="e.g. Lab 204"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* TYPE */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Class Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                >
                  <option value="Lecture">
                    Lecture
                  </option>

                  <option value="Lab">
                    Lab
                  </option>

                  <option value="Tutorial">
                    Tutorial
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* ACTIONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Save Class"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Timetable;