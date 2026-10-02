import { useState } from "react";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithCredential,
} from "firebase/auth";

import { useNavigate } from "react-router-dom";

import { auth } from "../firebase/firebase";
import { createUser } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState(false);

  const syncUserWithMongoDB = async (firebaseUser) => {
    const userData = {
      firebaseUid: firebaseUser.uid,
      name: firebaseUser.displayName || "Student",
      email: firebaseUser.email || "",
      profileImage: firebaseUser.photoURL || "",
      timezone: "Asia/Kolkata",
    };

    await createUser(userData);
  };

  // EMAIL + PASSWORD LOGIN
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      await syncUserWithMongoDB(result.user);

      navigate("/");
    } catch (err) {
      console.error("EMAIL LOGIN ERROR:", err);

      setError(
        err.code === "auth/invalid-credential"
          ? "Email or password is incorrect. If you normally use Google, click Enable Email Login below first."
          : `${err.code || "Error"}: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(
        auth,
        provider
      );

      await syncUserWithMongoDB(result.user);

      navigate("/");
    } catch (err) {
      console.error("GOOGLE LOGIN ERROR:", err);

      setError(
        `${err.code || "Error"}: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // LINK EMAIL + PASSWORD TO EXISTING GOOGLE ACCOUNT
  const handleEnableEmailLogin = async () => {
    setError("");

    if (!password) {
      setError(
        "Enter the password you want to use for email login first."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    setLinking(true);

    try {
      const provider = new GoogleAuthProvider();

      // Sign in with the existing Google account
      const googleResult =
        await signInWithPopup(
          auth,
          provider
        );

      const googleUser = googleResult.user;

      // Make sure the typed email belongs to
      // the Google account being linked
      if (
        email.trim() &&
        googleUser.email?.toLowerCase() !==
          email.trim().toLowerCase()
      ) {
        setError(
          `Use the same email as your Google account: ${googleUser.email}`
        );

        return;
      }

      // Create an Email/Password credential
      const credential =
        EmailAuthProvider.credential(
          googleUser.email,
          password
        );

      // Link it to the SAME Firebase account
      await linkWithCredential(
        googleUser,
        credential
      );

      await syncUserWithMongoDB(
        googleUser
      );

      alert(
        "Email login enabled successfully! You can now log in using your email and password."
      );

      navigate("/");
    } catch (err) {
      console.error(
        "ENABLE EMAIL LOGIN ERROR:",
        err
      );

      if (
        err.code ===
        "auth/provider-already-linked"
      ) {
        setError(
          "Email login is already enabled for this account."
        );
      } else if (
        err.code ===
        "auth/email-already-in-use"
      ) {
        setError(
          "This email is already connected to another Firebase account."
        );
      } else {
        setError(
          `${err.code || "Error"}: ${err.message}`
        );
      }
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 lg:flex">

      {/* LEFT SIDE */}
      <div className="relative hidden min-h-screen overflow-hidden lg:flex lg:w-[56%]">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/login-study.png')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-indigo-950/65 to-violet-950/60" />

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/25 blur-3xl" />

        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-violet-500/25 blur-3xl" />

        <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

          {/* LOGO */}
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-lg font-bold text-white shadow-lg">
              S
            </div>

            <div>
              <p className="text-base font-bold text-white">
                Student OS
              </p>

              <p className="text-[10px] text-indigo-200">
                Student Intelligence System
              </p>
            </div>

          </div>

          {/* MAIN MESSAGE */}
          <div className="max-w-xl">

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
              Semester × Career Intelligence
            </p>

            <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              Your semester.
              <br />
              Your career.
              <br />

              <span className="text-indigo-300">
                One intelligent system.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-6 text-slate-200">
              Understand your academic workload,
              build the skills your career needs,
              and know what to focus on next.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">

              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs text-white backdrop-blur">
                🎓 Academic Intelligence
              </div>

              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs text-white backdrop-blur">
                🎯 Career Intelligence
              </div>

              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs text-white backdrop-blur">
                🧠 Smart Recommendations
              </div>

            </div>

          </div>

          {/* FOOTER */}
          <p className="text-xs text-indigo-200">
            <span className="text-emerald-400">●</span>{" "}
            Learn · Grow · Build Your Future
          </p>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 px-5 py-10 lg:w-[44%]">

        <div className="w-full max-w-md">

          {/* MOBILE LOGO */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 font-bold text-white">
              S
            </div>

            <div>
              <p className="font-bold text-white">
                Student OS
              </p>

              <p className="text-[10px] text-slate-400">
                Student Intelligence System
              </p>
            </div>

          </div>

          {/* HEADING */}
          <div className="mb-7">

            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Welcome back
            </p>

            <h2 className="text-3xl font-bold text-white">
              Continue your journey.
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Sign in to access your semester and career intelligence.
            </p>

          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* LOGIN CARD */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur">

            <form
              onSubmit={handleEmailLogin}
              className="space-y-4"
            >

              {/* EMAIL */}
              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-200">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />

              </div>

              {/* PASSWORD */}
              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-200">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />

              </div>

              {/* SIGN IN */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In →"}
              </button>

            </form>

            {/* DIVIDER */}
            <div className="my-5 flex items-center gap-3">

              <div className="h-px flex-1 bg-white/10" />

              <span className="text-[10px] text-slate-500">
                OR
              </span>

              <div className="h-px flex-1 bg-white/10" />

            </div>

            {/* GOOGLE */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || linking}
              className="w-full rounded-xl border border-white/10 bg-transparent py-3 text-sm font-medium text-white transition hover:bg-white/5 disabled:opacity-60"
            >
              <span className="mr-2 font-bold">
                G
              </span>

              Continue with Google
            </button>

            {/* ENABLE EMAIL LOGIN */}
            <div className="mt-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">

              <p className="text-xs font-semibold text-indigo-300">
                Want to use email + password?
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                Enter your email and the password you
                want to use above, then enable email login.
              </p>

              <button
                type="button"
                onClick={handleEnableEmailLogin}
                disabled={linking}
                className="mt-3 w-full rounded-lg border border-indigo-500/30 bg-indigo-500/10 py-2.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/20 disabled:opacity-60"
              >
                {linking
                  ? "Connecting..."
                  : "Enable Email Login"}
              </button>

            </div>

          </div>

          {/* FOOTER */}
          <p className="mt-6 text-center text-[11px] text-slate-500">
            Student OS&nbsp; • &nbsp;Student decides. Student grows.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;