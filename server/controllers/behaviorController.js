const StudySession = require("../models/StudySession");

const {
  analyzeBehavior,
} = require("../services/behaviorEngine");


// =========================================
// GET STUDENT BEHAVIOR
// =========================================

const getBehavior = async (req, res, next) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    const sessions = await StudySession.find({
      firebaseUid,
    }).sort({
      createdAt: -1,
    });

    const behavior = analyzeBehavior(
      sessions
    );

    res.status(200).json({
      success: true,

      data: behavior,

      message:
        "Student behavior analyzed successfully",
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getBehavior,
};