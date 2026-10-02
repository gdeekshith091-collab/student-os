import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import UserMenu from "../components/UserMenu";

import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  Target,
  TrendingUp,
  ClipboardList,
  CalendarDays,
  CalendarClock,
  CalendarCheck,
  User,
} from "lucide-react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { getProfile } from "../services/api";

function MainLayout() {
  const [font, setFont] = useState("Inter");
  const [fontSize, setFontSize] = useState("Medium");

  const navItems = [
    {
      name: "Overview",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Semester",
      path: "/semester",
      icon: GraduationCap,
    },
    {
      name: "Assignments",
      path: "/assignments",
      icon: ClipboardList,
    },
    {
      name: "Exams",
      path: "/exams",
      icon: CalendarDays,
    },
    {
      name: "Timetable",
      path: "/timetable",
      icon: CalendarClock,
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: CalendarCheck,
    },
    {
      name: "Career",
      path: "/career",
      icon: Briefcase,
    },
    {
      name: "Goals",
      path: "/goals",
      icon: Target,
    },
    {
      name: "Progress",
      path: "/progress",
      icon: TrendingUp,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  // Load saved appearance preferences
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          return;
        }

        try {
          const result = await getProfile(user.uid);

          if (result?.data?.preferences) {
            setFont(
              result.data.preferences.font || "Inter"
            );

            setFontSize(
              result.data.preferences.fontSize || "Medium"
            );
          }
        } catch (error) {
          console.error(
            "Failed to load appearance preferences:",
            error
          );
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Apply font globally
  useEffect(() => {
    const fontMap = {
      Inter: "Inter, sans-serif",
      Poppins: "Poppins, sans-serif",
      Nunito: "Nunito, sans-serif",
      Roboto: "Roboto, sans-serif",
      "Plus Jakarta Sans":
        "'Plus Jakarta Sans', sans-serif",
    };

    document.documentElement.style.setProperty(
  "--student-os-font",
  fontMap[font] || "Inter, sans-serif"
);

    const sizeMap = {
      Small: "14px",
      Medium: "16px",
      Large: "18px",
    };

    document.documentElement.style.setProperty(
  "--student-os-font-size",
  sizeMap[fontSize] || "16px"
);

    return () => {
     document.documentElement.style.removeProperty(
  "--student-os-font"
);

document.documentElement.style.removeProperty(
  "--student-os-font-size"
);
    };
  }, [font, fontSize]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">

        <div className="flex h-20 items-center border-b border-slate-200 px-6">

          <div>

            <h1 className="text-xl font-bold text-slate-900">
              Student OS
            </h1>

            <p className="mt-0.5 text-xs text-slate-500">
              Student Intelligence System
            </p>

          </div>

        </div>

        <nav className="space-y-2 p-4">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={19} />

                {item.name}
              </NavLink>
            );
          })}

        </nav>

        <div className="absolute bottom-6 left-4 right-4 rounded-xl bg-indigo-50 p-4">

          <p className="text-sm font-semibold text-indigo-900">
            Student OS
          </p>

          <p className="mt-1 text-xs leading-5 text-indigo-700">
            Student decides.
            <br />
            Student grows.
          </p>

        </div>

      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur">

          <div className="lg:hidden">

            <h1 className="text-lg font-bold text-slate-900">
              Student OS
            </h1>

            <p className="text-xs text-slate-500">
              Intelligence System
            </p>

          </div>

          <div className="hidden lg:block">

            <p className="text-sm font-medium text-slate-500">
              Student Workspace
            </p>

            <p className="text-xs text-slate-400">
              Academic + Career Intelligence
            </p>

          </div>

          <UserMenu />

        </header>

        <main className="p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default MainLayout;