import { useEffect, useState } from "react";
import {
  User,
  Camera,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  BookOpen,
  Type,
  Save,
  Palette,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";
import {
  getProfile,
  saveProfile,
} from "../services/api";

function Profile() {
  const [firebaseUid, setFirebaseUid] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    course: "",
    semester: "",
    careerGoal: "",
  });

  const [font, setFont] = useState("Inter");
  const [fontSize, setFontSize] = useState("Medium");

  const [photoPreview, setPhotoPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================================
  // LOAD LOGGED-IN USER PROFILE
  // =========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          setLoading(false);
          return;
        }

        setFirebaseUid(user.uid);

        try {
          const result = await getProfile(user.uid);

          const data = result.data;

          setProfile({
            name: data?.name || user.displayName || "",
            email: data?.email || user.email || "",
            phone: data?.phone || "",
            college: data?.college || "",
            course: data?.course || "",
            semester: data?.semester || "",
            careerGoal: data?.careerGoal || "",
          });

          setFont(
            data?.preferences?.font || "Inter"
          );

          setFontSize(
            data?.preferences?.fontSize || "Medium"
          );

          if (data?.profilePhotoUrl) {
            setPhotoPreview(data.profilePhotoUrl);
          }
        } catch (error) {
          console.error(
            "Failed to load profile:",
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
  // HANDLE INPUT
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // PROFILE PHOTO PREVIEW
  // =========================================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl =
      URL.createObjectURL(file);

    setPhotoPreview(imageUrl);

    // Firebase Storage connection
    // will be added in the next step.
  };

  // =========================================
  // SAVE PROFILE
  // =========================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!firebaseUid) {
      alert(
        "Please log in before saving your profile."
      );
      return;
    }

    try {
      setSaving(true);

      await saveProfile({
        firebaseUid,
        ...profile,
        profilePhotoUrl:
          photoPreview || "",
        preferences: {
          font,
          fontSize,
        },
      });

      alert("Profile saved successfully! ❤️");
    } catch (error) {
      console.error(
        "Failed to save profile:",
        error
      );

      alert(
        error.message ||
          "Failed to save profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // LOADING SCREEN
  // =========================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your profile...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* =====================================
          HEADER
      ====================================== */}

      <div>

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-indigo-500" />

          <p className="text-xs font-bold tracking-[0.18em] text-indigo-600">
            PERSONALIZATION
          </p>

        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Profile & Preferences
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Make Student OS feel like your own
          personal workspace.
        </p>

      </div>

      {/* =====================================
          PROFILE HERO
      ====================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="h-28 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600" />

        <div className="px-6 pb-7 sm:px-8">

          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end">

            {/* PHOTO */}

            <div className="relative">

              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-slate-100 shadow-lg">

                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User
                    size={38}
                    className="text-slate-400"
                  />
                )}

              </div>

              <label
                htmlFor="profile-photo"
                className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border-2 border-white bg-indigo-600 text-white shadow-md transition hover:bg-indigo-500"
              >
                <Camera size={16} />
              </label>

              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />

            </div>

            {/* PROFILE INFO */}

            <div className="pb-1">

              <h2 className="text-2xl font-bold text-slate-900">
                {profile.name || "Your Name"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {profile.course || "Your course"}{" "}
                {profile.semester &&
                  `· ${profile.semester}`}
              </p>

            </div>

          </div>

          <div className="mt-5 flex flex-wrap gap-2">

            <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
              Student
            </span>

            {profile.careerGoal && (
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                {profile.careerGoal}
              </span>
            )}

          </div>

        </div>

      </section>

      {/* =====================================
          PERSONAL INFORMATION
      ====================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

        <div className="mb-6">

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-indigo-50 p-3">
              <User
                size={21}
                className="text-indigo-600"
              />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep your student profile information
                up to date.
              </p>

            </div>

          </div>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {/* NAME */}

          <div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Full Name
            </label>

            <div className="relative">

              <User
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full rounded-2xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

            </div>

          </div>

          {/* EMAIL */}

          <div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Email
            </label>

            <div className="relative">

              <Mail
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="student@example.com"
                className="w-full rounded-2xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

            </div>

          </div>

          {/* PHONE */}

          <div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Phone
            </label>

            <div className="relative">

              <Phone
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                className="w-full rounded-2xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

            </div>

          </div>

          {/* COLLEGE */}

          <div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              College / University
            </label>

            <div className="relative">

              <GraduationCap
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="college"
                value={profile.college}
                onChange={handleChange}
                placeholder="Your college"
                className="w-full rounded-2xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

            </div>

          </div>

          {/* COURSE */}

          <div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Course
            </label>

            <div className="relative">

              <BookOpen
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="course"
                value={profile.course}
                onChange={handleChange}
                placeholder="e.g. B.Tech CSE"
                className="w-full rounded-2xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

            </div>

          </div>

          {/* SEMESTER */}

          <div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Current Semester
            </label>

            <div className="relative">

              <GraduationCap
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="semester"
                value={profile.semester}
                onChange={handleChange}
                placeholder="e.g. 4th Semester"
                className="w-full rounded-2xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

            </div>

          </div>

          {/* CAREER */}

          <div className="md:col-span-2">

            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Career Goal
            </label>

            <div className="relative">

              <Briefcase
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="careerGoal"
                value={profile.careerGoal}
                onChange={handleChange}
                placeholder="e.g. Data Scientist"
                className="w-full rounded-2xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          APPEARANCE
      ====================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

        <div className="mb-7">

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-violet-50 p-3">
              <Palette
                size={21}
                className="text-violet-600"
              />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Appearance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Customize how Student OS looks for you.
              </p>

            </div>

          </div>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {/* FONT */}

          <div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Font
            </label>

            <div className="relative">

              <Type
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={font}
                onChange={(e) =>
                  setFont(e.target.value)
                }
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              >
                <option>Inter</option>
                <option>Poppins</option>
                <option>Nunito</option>
                <option>Roboto</option>
                <option>Plus Jakarta Sans</option>
              </select>

            </div>

            <p className="mt-2 text-xs text-slate-400">
              Choose the font you prefer for Student OS.
            </p>

          </div>

          {/* FONT SIZE */}

          <div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Font Size
            </label>

            <div className="grid grid-cols-3 gap-2">

              {["Small", "Medium", "Large"].map(
                (size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      setFontSize(size)
                    }
                    className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                      fontSize === size
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {size}
                  </button>
                )
              )}

            </div>

            <p className="mt-2 text-xs text-slate-400">
              Adjust the interface text size.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================
          SAVE
      ====================================== */}

      <div className="flex justify-end">

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />

          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>

      </div>

      {/* =====================================
          PERSONALIZATION NOTE
      ====================================== */}

      <section className="rounded-3xl bg-slate-900 p-6 text-white sm:p-7">

        <div className="flex items-start gap-4">

          <div className="rounded-2xl bg-white/10 p-3">
            <Palette size={21} />
          </div>

          <div>

            <h2 className="text-lg font-bold">
              Your Student OS, your way.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Your profile and preferences will
              eventually influence how Student OS
              presents recommendations, progress,
              and your daily workspace.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Profile;