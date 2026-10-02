const Attendance = require("../models/Attendance");

// =========================================
// CREATE ATTENDANCE
// =========================================

const createAttendance = async (req, res) => {
  try {
    const {
      firebaseUid,
      subject,
      attendedClasses,
      totalClasses,
      minimumRequired,
    } = req.body;

    if (
      !firebaseUid ||
      !subject ||
      attendedClasses === undefined ||
      totalClasses === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Firebase UID, subject, attended classes and total classes are required",
      });
    }

    const attendance =
      await Attendance.create({
        firebaseUid,
        subject,
        attendedClasses,
        totalClasses,
        minimumRequired:
          minimumRequired ?? 75,
      });

    return res.status(201).json({
      success: true,
      message:
        "Attendance created successfully",
      data: attendance,
    });
  } catch (error) {
    console.error(
      "Create attendance error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create attendance",
      error: error.message,
    });
  }
};

// =========================================
// GET ATTENDANCE
// =========================================

const getAttendance = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    const attendance =
      await Attendance.find({
        firebaseUid,
      }).sort({
        subject: 1,
      });

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error(
      "Get attendance error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch attendance",
      error: error.message,
    });
  }
};

// =========================================
// UPDATE ATTENDANCE
// =========================================

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      subject,
      attendedClasses,
      totalClasses,
      minimumRequired,
    } = req.body;

    const attendance =
      await Attendance.findByIdAndUpdate(
        id,
        {
          subject,
          attendedClasses,
          totalClasses,
          minimumRequired,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message:
          "Attendance record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Attendance updated successfully",
      data: attendance,
    });
  } catch (error) {
    console.error(
      "Update attendance error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update attendance",
      error: error.message,
    });
  }
};

// =========================================
// DELETE ATTENDANCE
// =========================================

const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance =
      await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message:
          "Attendance record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Attendance deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete attendance error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete attendance",
      error: error.message,
    });
  }
};

module.exports = {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
};