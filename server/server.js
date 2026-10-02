const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// Routes
const userRoutes = require("./routes/userRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const priorityRoutes = require("./routes/priorityRoutes");
const careerGoalRoutes = require("./routes/careerGoalRoutes");
const skillRoutes = require("./routes/skillRoutes");
const skillAssessmentRoutes = require("./routes/skillAssessmentRoutes");
const skillGapRoutes = require("./routes/skillGapRoutes");
const dynamicPriorityRoutes = require("./routes/dynamicPriorityRoutes");
const studySessionRoutes = require("./routes/studySessionRoutes");
const behaviorRoutes = require("./routes/behaviorRoutes");
const progressRoutes = require("./routes/progressRoutes");
const todayRoadmapRoutes = require("./routes/todayRoadmapRoutes");
const examRoutes = require("./routes/examRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const attendanceRiskRoutes = require("./routes/attendanceRiskRoutes");  
const profileRoutes = require("./routes/profileRoutes");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(
  "/api-docs",
  swaggerUi.serveFiles(swaggerSpec),
  swaggerUi.setup(swaggerSpec)
);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/assignments", assignmentRoutes);
app.use("/api/v1/priority", priorityRoutes);
app.use("/api/v1/career-goals", careerGoalRoutes);
app.use("/api/v1/skills", skillRoutes);
app.use(
  "/api/v1/skill-assessments",
  skillAssessmentRoutes
);
app.use(
  "/api/v1/skill-gaps",
  skillGapRoutes
);
app.use(
  "/api/v1/dynamic-priority",
  dynamicPriorityRoutes
);
app.use(
  "/api/v1/study-sessions",
  studySessionRoutes
);
app.use(
  "/api/v1/behavior",
  behaviorRoutes
);
app.use(
  "/api/v1/progress",
  progressRoutes
);
app.use(
  "/api/v1/today-roadmap",
  todayRoadmapRoutes
);
app.use(
  "/api/v1/exams",
  examRoutes
);
app.use(
  "/api/v1/timetable",
  timetableRoutes
);
app.use(
  "/api/v1/attendance",
  attendanceRoutes
);
app.use(
  "/api/v1/attendance-risk",
  attendanceRiskRoutes
);
app.use("/api/v1/profile", profileRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Student OS API is running",
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(5000, () => {
      console.log(
        "Student OS API running on http://localhost:5000"
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });