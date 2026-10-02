const Timetable = require("../models/Timetable");

// =========================================
// CREATE TIMETABLE ENTRY
// =========================================

const createTimetableEntry = async (req, res) => {
  try {
    const {
      firebaseUid,
      day,
      subject,
      startTime,
      endTime,
      room,
      type,
    } = req.body;

    if (
      !firebaseUid ||
      !day ||
      !subject ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Firebase UID, day, subject, start time and end time are required",
      });
    }

    const timetableEntry =
      await Timetable.create({
        firebaseUid,
        day,
        subject,
        startTime,
        endTime,
        room: room || "",
        type: type || "Lecture",
      });

    return res.status(201).json({
      success: true,
      message:
        "Timetable entry created successfully",
      data: timetableEntry,
    });
  } catch (error) {
    console.error(
      "Create timetable error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create timetable entry",
      error: error.message,
    });
  }
};

// =========================================
// GET TIMETABLE
// =========================================

const getTimetable = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    const timetable =
      await Timetable.find({
        firebaseUid,
      }).sort({
        day: 1,
        startTime: 1,
      });

    return res.status(200).json({
      success: true,
      data: timetable,
    });
  } catch (error) {
    console.error(
      "Get timetable error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch timetable",
      error: error.message,
    });
  }
};

// =========================================
// UPDATE TIMETABLE ENTRY
// =========================================

const updateTimetableEntry = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      day,
      subject,
      startTime,
      endTime,
      room,
      type,
    } = req.body;

    const timetableEntry =
      await Timetable.findByIdAndUpdate(
        id,
        {
          day,
          subject,
          startTime,
          endTime,
          room: room || "",
          type: type || "Lecture",
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!timetableEntry) {
      return res.status(404).json({
        success: false,
        message:
          "Timetable entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Timetable entry updated successfully",
      data: timetableEntry,
    });
  } catch (error) {
    console.error(
      "Update timetable error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update timetable entry",
      error: error.message,
    });
  }
};

// =========================================
// DELETE TIMETABLE ENTRY
// =========================================

const deleteTimetableEntry = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const timetableEntry =
      await Timetable.findByIdAndDelete(id);

    if (!timetableEntry) {
      return res.status(404).json({
        success: false,
        message:
          "Timetable entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Timetable entry deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete timetable error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete timetable entry",
      error: error.message,
    });
  }
};

module.exports = {
  createTimetableEntry,
  getTimetable,
  updateTimetableEntry,
  deleteTimetableEntry,
};