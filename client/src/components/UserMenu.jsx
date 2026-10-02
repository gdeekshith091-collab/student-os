import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

function UserMenu() {
  const [loggingOut, setLoggingOut] = useState(false);

  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* User information */}
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium text-white">
          {user?.displayName || "Student"}
        </p>

        <p className="text-xs text-slate-400">
          {user?.email || ""}
        </p>
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
        {(user?.displayName || user?.email || "S")
          .charAt(0)
          .toUpperCase()}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 text-sm transition disabled:opacity-50"
      >
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}

export default UserMenu;