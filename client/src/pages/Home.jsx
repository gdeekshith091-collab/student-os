import { useEffect, useRef, useState } from "react";
import { auth } from "../firebase/firebase";

import {
  getAcademicRisk,
  getDynamicPriority,
  getBehavior,
  getTodayRoadmap,
  getAttendanceRisk,
  createStudySession,
  startStudySession,
  completeStudySession,
} from "../services/api";

const Home = () => {
  const [academicRisk, setAcademicRisk] = useState(null);
  const [nextAction, setNextAction] = useState(null);
  const [sessionPlan, setSessionPlan] = useState(null);
  const [behavior, setBehavior] = useState(null);
  const [todayRoadmap, setTodayRoadmap] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [attendanceRisk, setAttendanceRisk] = useState(null);
  const [academicHealth, setAcademicHealth] = useState(null);
  const [studentName, setStudentName] = useState("");

  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const completionTriggered = useRef(false);
  const audioContextRef = useRef(null);
  const alarmIntervalRef = useRef(null);

  const BREAK_DURATION_SECONDS = 5 * 60;

  const [breakActive, setBreakActive] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(
    BREAK_DURATION_SECONDS
  );
  const [isBreakPaused, setIsBreakPaused] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // =========================================
  // LOAD DASHBOARD INTELLIGENCE
  // =========================================

  const loadDashboardIntelligence = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      setStudentName(user.displayName || "Student");

      const firebaseUid = user.uid;

      const [
        riskResult,
        priorityResult,
        behaviorResult,
        roadmapResult,
        attendanceRiskResult,
      ] = await Promise.all([
        getAcademicRisk(firebaseUid),
        getDynamicPriority(firebaseUid),
        getBehavior(firebaseUid),
        getTodayRoadmap(firebaseUid),
        getAttendanceRisk(firebaseUid),
      ]);

      setAttendanceRisk(attendanceRiskResult?.data || null);

      setAcademicHealth(
        priorityResult?.data?.academicHealth || null
      );

      setAcademicRisk(riskResult?.data || null);

      setNextAction(
        priorityResult?.data?.recommendation || null
      );

      setSessionPlan(
        priorityResult?.data?.sessionPlan || null
      );

      setBehavior(behaviorResult?.data || null);

      setTodayRoadmap(
        roadmapResult?.data?.roadmap || null
      );
    } catch (error) {
      console.error(
        "Failed to load dashboard intelligence:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardIntelligence();
  }, []);

  // =========================================
  // RISK HELPERS
  // =========================================

  const getRiskColor = (level) => {
    if (level === "High") return "text-red-600";
    if (level === "Medium") return "text-amber-600";
    return "text-emerald-600";
  };

  const getRiskBackground = (level) => {
    if (level === "High") {
      return "bg-red-50 border-red-100";
    }

    if (level === "Medium") {
      return "bg-amber-50 border-amber-100";
    }

    return "bg-emerald-50 border-emerald-100";
  };

  const getHealthBackground = (level) => {
    if (level === "High Risk") {
      return "bg-red-50 border-red-100";
    }

    if (level === "Needs Attention") {
      return "bg-amber-50 border-amber-100";
    }

    return "bg-emerald-50 border-emerald-100";
  };

  // =========================================
  // ACTION HELPERS
  // =========================================

  const getActionTypeLabel = (type) => {
    if (type === "exam") return "ACADEMIC EXAM";
    if (type === "academic") return "ACADEMIC PRIORITY";
    return "CAREER PRIORITY";
  };

  const getActionIcon = (type) => {
    if (type === "exam") return "📝";
    if (type === "academic") return "📚";
    return "🌱";
  };

  const getActionDetails = (action) => {
    if (!action) {
      return "Add assignments, exams, or set a career goal to receive a personalized recommendation.";
    }

    if (action.type === "exam") {
      const exam = action.data || {};

      return `${exam.examType || "Exam"} · ${
        exam.importance || "High"
      } importance`;
    }

    if (action.type === "academic") {
      const assignment = action.data || {};

      return `${assignment.priority || "Medium"} priority · ${
        assignment.estimatedHours || 1
      } hour${
        (assignment.estimatedHours || 1) === 1
          ? ""
          : "s"
      } estimated`;
    }

    const skill = action.data || {};

    return `${skill.gap ?? 0}% skill gap · Career importance ${
      skill.importance ?? 0
    }/10`;
  };

  // =========================================
  // NOTIFICATIONS + ALARM
  // =========================================

  const showBrowserNotification = (title, body) => {
    if (typeof Notification === "undefined") return;

    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
      });
    }
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification === "undefined") return;

    if (Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch (error) {
        console.warn(
          "Notification permission was not granted:",
          error
        );
      }
    }
  };

  const stopAlarm = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  };

  const playAlarm = () => {
    try {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const audioContext = audioContextRef.current;

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      stopAlarm();

      const playTone = () => {
        const oscillator =
          audioContext.createOscillator();

        const gainNode =
          audioContext.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
          880,
          audioContext.currentTime
        );

        gainNode.gain.setValueAtTime(
          0.0001,
          audioContext.currentTime
        );

        gainNode.gain.exponentialRampToValueAtTime(
          0.18,
          audioContext.currentTime + 0.02
        );

        gainNode.gain.exponentialRampToValueAtTime(
          0.0001,
          audioContext.currentTime + 0.45
        );

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();

        oscillator.stop(
          audioContext.currentTime + 0.5
        );
      };

      playTone();

      alarmIntervalRef.current =
        setInterval(playTone, 900);

      window.setTimeout(stopAlarm, 4500);
    } catch (error) {
      console.warn(
        "Unable to play alarm:",
        error
      );
    }
  };

  const pushInAppNotification = (message) => {
    setNotificationMessage(message);

    window.setTimeout(() => {
      setNotificationMessage("");
    }, 5000);
  };

  // =========================================
  // START STUDY SESSION
  // =========================================

  const handleStartSession = async () => {
    try {
      const user = auth.currentUser;

      if (!user || !nextAction) return;

      setSessionLoading(true);

      await requestNotificationPermission();

      stopAlarm();

      setBreakActive(false);
      setBreakTimeLeft(BREAK_DURATION_SECONDS);
      setIsBreakPaused(false);

      const sessionResult =
        await createStudySession({
          firebaseUid: user.uid,
          type: nextAction.type,
          title: nextAction.title,
          durationMinutes:
            sessionPlan?.durationMinutes || 45,
        });

      const sessionId =
        sessionResult.data._id;

      const startResult =
        await startStudySession(
          sessionId,
          user.uid
        );

      setActiveSession(startResult.data);

      const durationSeconds =
        (startResult.data.durationMinutes || 45) *
        60;

      setTimeLeft(durationSeconds);
      setIsTimerPaused(false);
      completionTriggered.current = false;

      pushInAppNotification(
        `▶️ Focus session started — ${formatTime(
          durationSeconds
        )} to go.`
      );

      showBrowserNotification(
        "Student OS — Focus session started",
        `${startResult.data.title} · ${startResult.data.durationMinutes} minute focus session.`
      );
    } catch (error) {
      console.error(
        "Failed to start study session:",
        error
      );

      alert(
        error.message ||
          "Failed to start study session"
      );
    } finally {
      setSessionLoading(false);
    }
  };

  // =========================================
  // COMPLETE STUDY SESSION
  // =========================================

  const handleCompleteSession = async (
    completedByTimer = false
  ) => {
    try {
      const user = auth.currentUser;

      if (!user || !activeSession) return;

      setSessionLoading(true);
      completionTriggered.current = true;

      const result =
        await completeStudySession(
          activeSession._id,
          user.uid
        );

      setActiveSession(null);
      setTimeLeft(0);
      setIsTimerPaused(false);

      playAlarm();

      const completionTitle =
        completedByTimer
          ? "Student OS — Time's up!"
          : "Student OS — Session complete";

      const completionMessage =
        completedByTimer
          ? "🔔 Time's up! Your focus session is complete. Break time starts now."
          : "🎉 Session complete! Break time starts now.";

      const completionBody =
        completedByTimer
          ? `Great work! Your ${
              result.data?.title || "focus"
            } session is complete. Take a short break.`
          : `Your ${
              result.data?.title || "focus"
            } session is complete. Take a short break.`;

      pushInAppNotification(
        completionMessage
      );

      showBrowserNotification(
        completionTitle,
        completionBody
      );

      setBreakActive(true);
      setBreakTimeLeft(BREAK_DURATION_SECONDS);
      setIsBreakPaused(false);

      await loadDashboardIntelligence();

      console.log(
        "Completed session:",
        result.data
      );
    } catch (error) {
      console.error(
        "Failed to complete study session:",
        error
      );

      alert(
        error.message ||
          "Failed to complete study session"
      );
    } finally {
      setSessionLoading(false);
    }
  };

  // =========================================
  // TIMER
  // =========================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  const toggleTimer = () => {
    setIsTimerPaused(
      (previous) => !previous
    );
  };

  useEffect(() => {
    if (!activeSession || isTimerPaused) {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);

          if (!completionTriggered.current) {
            completionTriggered.current = true;

            handleCompleteSession(true);
          }

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession, isTimerPaused]);

  // =========================================
  // BREAK TIMER
  // =========================================

  useEffect(() => {
    if (!breakActive || isBreakPaused) {
      return undefined;
    }

    const timer = setInterval(() => {
      setBreakTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);

          playAlarm();

          pushInAppNotification(
            "🔔 Break over! You're ready for your next focus session."
          );

          showBrowserNotification(
            "Student OS — Break over",
            "Your 5-minute break is finished. Ready for your next focus session?"
          );

          setBreakActive(false);
          setIsBreakPaused(false);

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [breakActive, isBreakPaused]);

  const toggleBreakTimer = () => {
    setIsBreakPaused(
      (previous) => !previous
    );
  };

  const skipBreak = () => {
    setBreakActive(false);
    setBreakTimeLeft(0);
    setIsBreakPaused(false);
    stopAlarm();
  };

  // =========================================
  // GREETING
  // =========================================

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 5) return "Good night 🌙";
    if (hour < 12) return "Good morning 🌅";
    if (hour < 17) return "Good afternoon ☀️";
    if (hour < 21) return "Good evening 🌆";

    return "Good night 🌙";
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

      {/* =========================================
          NOTIFICATION
      ========================================= */}

      {notificationMessage && (
        <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
              ✓
            </div>

            <p className="pt-1 text-sm font-semibold leading-5 text-slate-900">
              {notificationMessage}
            </p>
          </div>
        </div>
      )}

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="mb-8">

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          <p className="text-sm font-semibold tracking-wide text-slate-500">
            STUDENT OS
          </p>
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {getGreeting()}, {studentName}
        </h1>

        <p className="mt-2 max-w-2xl text-base leading-6 text-slate-500">
          Your semester and career intelligence at a glance.
        </p>

      </header>

      {/* =========================================
          NEXT BEST ACTION — HERO
      ========================================= */}

      <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-slate-900 p-6 text-white shadow-xl sm:p-8">

        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-3xl">

            <div className="mb-5 flex flex-wrap items-center gap-2">

              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wider text-slate-200">
                🎯 NEXT BEST ACTION
              </span>

              {nextAction && (
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-300">
                  {getActionIcon(nextAction.type)}{" "}
                  {getActionTypeLabel(nextAction.type)}
                </span>
              )}

            </div>

            {loading ? (
              <>
                <div className="h-9 w-72 animate-pulse rounded-xl bg-white/10" />

                <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded-lg bg-white/10" />
              </>
            ) : nextAction ? (
              <>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {nextAction.title}
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  {nextAction.reason}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">

                  <span className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">
                    Priority score{" "}
                    <strong className="text-white">
                      {nextAction.score}
                    </strong>
                  </span>

                  <span className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">
                    {getActionDetails(nextAction)}
                  </span>

                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold">
                  No recommendation yet
                </h2>

                <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">
                  Add academic tasks or set a career goal
                  to receive a personalized recommendation.
                </p>
              </>
            )}

          </div>

          {/* SESSION CONTROL */}

          <div className="w-full flex-shrink-0 lg:w-56">

            {activeSession ? (
              <div className="space-y-3">

                <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-center backdrop-blur">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Focus time
                  </p>

                  <p className="mt-1 text-4xl font-bold tabular-nums tracking-tight">
                    {formatTime(timeLeft)}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={toggleTimer}
                  disabled={
                    sessionLoading ||
                    timeLeft === 0
                  }
                  className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isTimerPaused
                    ? "▶ Resume"
                    : "⏸ Pause"}
                </button>

                <button
                  type="button"
                  onClick={handleCompleteSession}
                  disabled={sessionLoading}
                  className="w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sessionLoading
                    ? "Completing..."
                    : "✓ Complete Early"}
                </button>

              </div>
            ) : nextAction ? (
              <button
                type="button"
                onClick={handleStartSession}
                disabled={sessionLoading}
                className="w-full rounded-2xl bg-white px-6 py-4 text-sm font-bold text-slate-900 shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sessionLoading
                  ? "Starting..."
                  : "▶ Start Session"}
              </button>
            ) : null}

          </div>

        </div>
      </section>

      {/* =========================================
          QUICK INTELLIGENCE CARDS
      ========================================= */}

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Academic Risk */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Academic Risk
              </p>

              <h3
                className={`mt-2 text-2xl font-bold ${
                  academicRisk
                    ? getRiskColor(academicRisk.level)
                    : "text-slate-900"
                }`}
              >
                {academicRisk?.level || "—"}
              </h3>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-lg">
              📚
            </div>

          </div>

          {academicRisk && (
            <>
              <div className="mt-5 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">
                  Risk score
                </span>

                <span className="font-bold text-slate-800">
                  {academicRisk.score}/100
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all ${
                    academicRisk.level === "High"
                      ? "bg-red-500"
                      : academicRisk.level === "Medium"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{
                    width: `${academicRisk.score}%`,
                  }}
                />
              </div>
            </>
          )}

        </div>

        {/* Career */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Career Intelligence
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                Active
              </h3>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-lg">
              🌱
            </div>

          </div>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Your skills are being compared with your selected career goal.
          </p>

        </div>

        {/* Recommendation */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recommendation Engine
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {nextAction ? "Ready" : "Waiting"}
              </h3>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-lg">
              🧠
            </div>

          </div>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Academic urgency and career gaps are evaluated together.
          </p>

        </div>

        {/* Attendance */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Attendance
              </p>

              <h3
                className={`mt-2 text-2xl font-bold ${
                  attendanceRisk
                    ? getRiskColor(
                        attendanceRisk.overallRisk
                      )
                    : "text-slate-900"
                }`}
              >
                {attendanceRisk?.overallRisk || "—"}
              </h3>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-lg">
              📊
            </div>

          </div>

          {attendanceRisk && (
            <p className="mt-4 text-sm text-slate-500">
              Overall score{" "}
              <span className="font-bold text-slate-800">
                {attendanceRisk.overallScore}
              </span>
            </p>
          )}

        </div>

      </section>

      {/* =========================================
          ACTIVE SESSION
      ========================================= */}

      {activeSession && (
        <section className="mb-8 overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-2">

                <p className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                  ⏱️ Focus session
                </p>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm">
                  {isTimerPaused
                    ? "Paused"
                    : "In Progress"}
                </span>

              </div>

              <h2 className="mt-3 text-xl font-bold text-slate-900">
                {activeSession.title}
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Stay focused for this personalized{" "}
                {activeSession.durationMinutes}-minute session.
              </p>

              <div className="mt-5">

                <div className="mb-2 flex items-center justify-between text-sm">

                  <span className="font-medium text-slate-600">
                    Session progress
                  </span>

                  <span className="font-bold text-slate-900">
                    {formatTime(timeLeft)} remaining
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-emerald-100">

                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: `${
                        activeSession.durationMinutes > 0
                          ? Math.max(
                              0,
                              Math.min(
                                100,
                                ((activeSession.durationMinutes * 60 -
                                  timeLeft) /
                                  (activeSession.durationMinutes * 60)) *
                                  100
                              )
                            )
                          : 0
                      }%`,
                    }}
                  />

                </div>

              </div>

            </div>

            <div className="flex-shrink-0 rounded-3xl bg-slate-900 px-8 py-6 text-center text-white shadow-lg">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Time left
              </p>

              <p className="mt-1 text-4xl font-bold tabular-nums">
                {formatTime(timeLeft)}
              </p>

            </div>

          </div>

        </section>
      )}

      {/* =========================================
          BREAK TIMER
      ========================================= */}

      {breakActive && (
        <section className="mb-8 overflow-hidden rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <p className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
                  ☕ Break time
                </p>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-700 shadow-sm">
                  {isBreakPaused
                    ? "Paused"
                    : "Resting"}
                </span>

              </div>

              <h2 className="mt-3 text-xl font-bold text-slate-900">
                Recharge before your next focus session
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Student OS recommends a 5-minute break after completing your focus session.
              </p>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

              <div className="rounded-2xl bg-white px-6 py-4 text-center shadow-sm">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Break remaining
                </p>

                <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">
                  {formatTime(breakTimeLeft)}
                </p>

              </div>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={toggleBreakTimer}
                  className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  {isBreakPaused
                    ? "▶ Resume"
                    : "⏸ Pause"}
                </button>

                <button
                  type="button"
                  onClick={skipBreak}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Skip Break
                </button>

              </div>

            </div>

          </div>

        </section>
      )}

      {/* =========================================
          BEHAVIOR INTELLIGENCE
      ========================================= */}

      <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl">
              🧠
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Behavior Intelligence
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                What Student OS learned about you
              </h2>
            </div>

          </div>

          <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
            Adaptive learning
          </span>

        </div>

        <p className="mb-6 text-sm leading-6 text-slate-500">
          Student OS learns from your completed study sessions
          to understand your study patterns.
        </p>

        {behavior ? (

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Typical session
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {behavior.averageSessionDuration} min
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Average completed session
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Completion rate
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {behavior.completionRate}%
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Sessions completed
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total sessions
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {behavior.totalSessions}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Study sessions recorded
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Completed
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-700">
                {behavior.completedSessions}
              </p>

              <p className="mt-1 text-sm text-emerald-700/70">
                Finished study sessions
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Academic sessions
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {behavior.academicSessions}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Completed academic sessions
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Career sessions
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {behavior.careerSessions}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Completed career sessions
              </p>
            </div>

          </div>

        ) : (

          <div className="rounded-2xl bg-slate-50 p-6 text-center">
            <p className="text-base font-semibold text-slate-700">
              Student OS is still learning your study patterns.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Complete more study sessions to unlock deeper insights.
            </p>
          </div>

        )}

      </section>

      {/* =========================================
          TODAY'S ROADMAP
      ========================================= */}

      <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

        <div className="mb-6">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
              🗺️
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Today's Roadmap
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                What Student OS recommends for today
              </h2>
            </div>

          </div>

          {todayRoadmap?.behaviorMessage && (
            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-sm leading-6 text-slate-600">
                🧠 {todayRoadmap.behaviorMessage}
              </p>
            </div>
          )}

        </div>

        {todayRoadmap?.sessions?.length > 0 ? (

          <div className="space-y-4">

            {todayRoadmap.sessions.map((session) => (

              <div
                key={`${session.order}-${session.title}`}
                className={`rounded-2xl p-5 transition ${
                  session.order === 1
                    ? "bg-slate-900 text-white shadow-lg"
                    : "border border-slate-100 bg-slate-50"
                }`}
              >

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex items-start gap-4">

                    <div
                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                        session.order === 1
                          ? "bg-white/10 text-white"
                          : "bg-white text-slate-900 shadow-sm"
                      }`}
                    >
                      {session.order}
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <span
                          className={`text-xs font-bold uppercase tracking-wide ${
                            session.order === 1
                              ? "text-slate-400"
                              : "text-slate-500"
                          }`}
                        >
                          {session.type === "exam"
                            ? "📝 Academic Exam"
                            : session.type === "academic"
                            ? "📚 Academic"
                            : "🌱 Career"}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            session.order === 1
                              ? "bg-white/10 text-slate-300"
                              : "bg-white text-slate-600"
                          }`}
                        >
                          {session.status}
                        </span>

                      </div>

                      <h3
                        className={`mt-2 text-lg font-bold ${
                          session.order === 1
                            ? "text-white"
                            : "text-slate-900"
                        }`}
                      >
                        {session.title}
                      </h3>

                      <p
                        className={`mt-1 text-sm leading-6 ${
                          session.order === 1
                            ? "text-slate-300"
                            : "text-slate-500"
                        }`}
                      >
                        {session.reason}
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap items-center gap-2">

                    <span
                      className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                        session.order === 1
                          ? "bg-white/10 text-white"
                          : "border border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      ⏱️ {session.durationMinutes} min
                    </span>

                    <span
                      className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                        session.order === 1
                          ? "bg-white/10 text-white"
                          : "border border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      Score {session.priorityScore}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="rounded-2xl bg-slate-50 p-6 text-center">
            <p className="text-base font-semibold text-slate-700">
              No roadmap has been generated yet.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add assignments or assess your career skills
              to generate today's personalized roadmap.
            </p>
          </div>

        )}

      </section>

      {/* =========================================
          TODAY'S FOCUS
      ========================================= */}

      <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

        <div className="mb-6">

          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Today's Focus
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            What Student OS wants you to focus on
          </h2>

        </div>

        {nextAction ? (

          <div className="rounded-2xl bg-slate-50 p-5">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-lg text-white">
                  {getActionIcon(nextAction.type)}
                </div>

                <div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {nextAction.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {nextAction.reason}
                  </p>

                  {nextAction.attendanceNote && (
                    <p className="mt-3 text-xs font-semibold text-slate-600">
                      📊 {nextAction.attendanceNote}
                    </p>
                  )}

                  {nextAction.behaviorNote && (
                    <p className="mt-2 text-xs font-semibold text-slate-600">
                      🧠 {nextAction.behaviorNote}
                    </p>
                  )}

                </div>

              </div>

              <span className="w-fit whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">
                Score {nextAction.score}
              </span>

            </div>

          </div>

        ) : (

          <div className="rounded-2xl bg-slate-50 p-6 text-center">
            <p className="text-base font-semibold text-slate-700">
              Your focus will appear here.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add assignments and career information
              to activate Student OS intelligence.
            </p>
          </div>

        )}

        {/* =========================================
            ACADEMIC HEALTH
        ========================================= */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Academic Health
              </p>

              <h3
                className={`mt-2 text-xl font-bold ${
                  academicHealth
                    ? getRiskColor(
                        academicHealth.healthLevel ===
                          "High Risk"
                          ? "High"
                          : academicHealth.healthLevel ===
                            "Needs Attention"
                          ? "Medium"
                          : "Low"
                      )
                    : "text-slate-900"
                }`}
              >
                {academicHealth
                  ? academicHealth.healthLevel
                  : "Academic Health"}
              </h3>

              {academicHealth ? (
                <div className="mt-3 space-y-1">
                  {academicHealth.reasons?.map(
                    (reason, index) => (
                      <p
                        key={index}
                        className="text-sm leading-6 text-slate-500"
                      >
                        • {reason}
                      </p>
                    )
                  )}
                </div>
              ) : (
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Your overall academic health will appear here.
                </p>
              )}

            </div>

            {academicHealth && (
              <span className="w-fit whitespace-nowrap rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                Score {academicHealth.healthScore}/100
              </span>
            )}

          </div>

          {academicHealth && (
            <div className="mt-5 grid gap-3 sm:grid-cols-3">

              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold text-slate-400">
                  ACADEMIC RISK
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {academicHealth.academicRisk.level}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold text-slate-400">
                  PENDING ASSIGNMENTS
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {academicHealth.pendingAssignments}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold text-slate-400">
                  UPCOMING EXAMS
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {academicHealth.upcomingExams}
                </p>
              </div>

            </div>
          )}

        </div>

        {/* =========================================
            ATTENDANCE INTELLIGENCE
        ========================================= */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Attendance Intelligence
              </p>

              <h3
                className={`mt-2 text-xl font-bold ${
                  attendanceRisk
                    ? getRiskColor(
                        attendanceRisk.overallRisk
                      )
                    : "text-slate-900"
                }`}
              >
                {attendanceRisk
                  ? `Attendance Risk: ${attendanceRisk.overallRisk}`
                  : "Attendance Risk"}
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {attendanceRisk
                  ? attendanceRisk.subjectsAtRisk === 0
                    ? "Your attendance is currently within a safe range."
                    : `${attendanceRisk.subjectsAtRisk} subject${
                        attendanceRisk.subjectsAtRisk > 1
                          ? "s"
                          : ""
                      } need attention.`
                  : "Attendance intelligence will appear here."}
              </p>

            </div>

            {attendanceRisk && (
              <span className="w-fit whitespace-nowrap rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                Score {attendanceRisk.overallScore}
              </span>
            )}

          </div>

          {attendanceRisk &&
            attendanceRisk.subjectRisks?.length > 0 && (

              <div className="mt-5 space-y-3">

                {attendanceRisk.subjectRisks.map(
                  (subject) => (

                    <div
                      key={subject.subject}
                      className={`flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
                        subject.risk === "High"
                          ? "border-red-100 bg-red-50"
                          : subject.risk === "Medium"
                          ? "border-amber-100 bg-amber-50"
                          : "border-slate-100 bg-slate-50"
                      }`}
                    >

                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {subject.subject}
                        </p>

                        <p className="text-xs text-slate-500">
                          {subject.attendedClasses} of{" "}
                          {subject.totalClasses} classes
                        </p>
                      </div>

                      <div className="text-left sm:text-right">

                        <p className="text-sm font-bold text-slate-900">
                          {subject.percentage}%
                        </p>

                        <p className="text-xs text-slate-500">
                          Required{" "}
                          {subject.minimumRequired}%
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>
            )}

        </div>

      </section>

    </div>
  );
};

export default Home;