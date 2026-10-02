const Attendance = require("../models/Attendance");

const {
  calculateOverallAttendanceRisk,
} = require("../services/attendanceRiskEngine");

// =========================================
// GET ATTENDANCE RISK
// =========================================

const getAttendanceRisk = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    const attendanceRecords =
      await Attendance.find({
        firebaseUid,
      }).sort({
        subject: 1,
      });

    const risk =
      calculateOverallAttendanceRisk(
        attendanceRecords
      );

    return res.status(200).json({
      success: true,
      data: risk,
    });
  } catch (error) {
    console.error(
      "Attendance risk error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to calculate attendance risk",
      error: error.message,
    });
  }
};

module.exports = {
  getAttendanceRisk,
};