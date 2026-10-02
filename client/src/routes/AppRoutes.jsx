import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Semester from "../pages/Semester";
import Career from "../pages/Career";
import Goals from "../pages/Goals";
import Progress from "../pages/Progress";
import Assignments from "../pages/Assignments";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import Exams from "../pages/Exams";
import Timetable from "../pages/Timetable";
import Attendance from "../pages/Attendance";
import Profile from "../pages/Profile";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/semester"
          element={<Semester />}
        />

        <Route
          path="/career"
          element={<Career />}
        />

        <Route
          path="/goals"
          element={<Goals />}
        />

        <Route
          path="/progress"
          element={<Progress />}
        />

        <Route
          path="/assignments"
          element={<Assignments />}
        />

        <Route
          path="/exams"
          element={<Exams />}
        />

        <Route
          path="/timetable"
          element={<Timetable />}
        />

        <Route
          path="/attendance"
          element={<Attendance />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;