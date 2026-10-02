const Timetable = require("../models/Timetable");
const {
  extractTimetableFromImage,
} = require("../services/timetableScannerService");

const scanTimetable = async (req, res, next) => {
  try {
    const { firebaseUid } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Timetable image is required",
      });
    }

    const extractedEntries =
      await extractTimetableFromImage(
        req.file.buffer,
        req.file.mimetype
      );

    if (!extractedEntries.length) {
      return res.status(400).json({
        success: false,
        message:
          "No timetable entries could be detected from the image",
      });
    }

    const entriesToSave = extractedEntries.map(
      (entry) => ({
        firebaseUid,
        day: entry.day,
        subject: entry.subject,
        startTime: entry.startTime,
        endTime: entry.endTime,
        room: entry.room || "",
        type: entry.type || "Lecture",
      })
    );

    const savedEntries =
      await Timetable.insertMany(entriesToSave);

    res.status(201).json({
      success: true,
      data: savedEntries,
      count: savedEntries.length,
      message:
        `${savedEntries.length} timetable entries extracted and saved successfully`,
    });
  } catch (error) {
    console.error(
      "Timetable scanner error:",
      error
    );

    next(error);
  }
};

module.exports = {
  scanTimetable,
};