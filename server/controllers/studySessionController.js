const StudySession = require("../models/StudySession");


// =========================================
// CREATE STUDY SESSION
// =========================================

const createStudySession = async (req, res, next) => {
  try {
    const {
      firebaseUid,
      type,
      title,
      durationMinutes,
    } = req.body;

    if (!firebaseUid || !type || !title) {
      return res.status(400).json({
        success: false,
        message:
          "Firebase UID, session type, and title are required",
      });
    }

    const studySession =
      await StudySession.create({
        firebaseUid,
        type,
        title,
        durationMinutes:
          durationMinutes || 45,
        status: "Planned",
      });

    res.status(201).json({
      success: true,
      data: studySession,
      message:
        "Study session created successfully",
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// START STUDY SESSION
// =========================================

const startStudySession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firebaseUid } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    const studySession =
      await StudySession.findOneAndUpdate(
        {
          _id: id,
          firebaseUid,
        },
        {
          status: "In Progress",
          startedAt: new Date(),
        },
        {
          new: true,
        }
      );

    if (!studySession) {
      return res.status(404).json({
        success: false,
        message: "Study session not found",
      });
    }

    res.status(200).json({
      success: true,
      data: studySession,
      message:
        "Study session started successfully",
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// COMPLETE STUDY SESSION
// =========================================

const completeStudySession = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { firebaseUid } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    const studySession =
      await StudySession.findOneAndUpdate(
        {
          _id: id,
          firebaseUid,
        },
        {
          status: "Completed",
          completedAt: new Date(),
        },
        {
          new: true,
        }
      );

    if (!studySession) {
      return res.status(404).json({
        success: false,
        message: "Study session not found",
      });
    }

    res.status(200).json({
      success: true,
      data: studySession,
      message:
        "Study session completed successfully",
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// GET STUDY SESSIONS
// =========================================

const getStudySessions = async (
  req,
  res,
  next
) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    const studySessions =
      await StudySession.find({
        firebaseUid,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      data: studySessions,
      message:
        "Study sessions fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createStudySession,
  startStudySession,
  completeStudySession,
  getStudySessions,
};